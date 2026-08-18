"""MUNify CHASE Pi display helper.

Drives WiFi (NetworkManager via nmcli), runs a captive portal on first
boot / connectivity loss, then runs the OAuth 2.0 Device Authorization
Grant + refresh loop. It NEVER hands the refresh token to CHASE (Logto
rotates it on use); instead it serves a tiny local page that a top-level
browser navigation auto-submits to /api/kiosk/session so the auth
cookies land in Chromium.

stdlib only + the `qrencode` and `nmcli` CLIs. No secrets in the repo;
the device id, refresh token, and per-device hotspot PSK are persisted
root-only under STATE_DIR.
"""

import http.server
import json
import os
import re
import secrets
import socketserver
import subprocess
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

BASE_URL = os.environ["CHASE_BASE_URL"].rstrip("/")
AUTHORITY = os.environ["OIDC_AUTHORITY"]
CLIENT_ID = os.environ["OIDC_CLIENT_ID"]
SCOPES = os.environ.get("OIDC_SCOPES", "openid profile email offline_access roles")
STATE_DIR = os.environ.get("STATE_DIR", "/var/lib/chase-kiosk")
BOOTSTRAP_DIR = os.environ.get("BOOTSTRAP_DIR", "/run/chase-kiosk")
BOOTSTRAP_PORT = int(os.environ.get("BOOTSTRAP_PORT", "8081"))
REFRESH_MARGIN = int(os.environ.get("REFRESH_MARGIN", "120"))
WLAN_IFACE = os.environ.get("WLAN_IFACE", "wlan0")
PROVISION_HTTP_PORT = int(os.environ.get("PROVISION_HTTP_PORT", "80"))
PROVISION_PROBE_URL = os.environ.get("PROVISION_PROBE_URL") or AUTHORITY
PROVISION_FAILURE_THRESHOLD = int(os.environ.get("PROVISION_FAILURE_THRESHOLD", "6"))
PROVISION_PROBE_INTERVAL = int(os.environ.get("PROVISION_PROBE_INTERVAL", "30"))
QRENCODE = os.environ.get("QRENCODE", "qrencode")
NMCLI = os.environ.get("NMCLI", "nmcli")
SYSTEMCTL = os.environ.get("SYSTEMCTL", "systemctl")
IW = os.environ.get("IW", "iw")
IP = os.environ.get("IP", "ip")
# Second, virtual radio interface used only while bridging a captive portal
# (WLAN_IFACE stays joined to the venue network; this one serves the
# operator's phone). Only ever brought up on hardware that
# supports_concurrent_ap_sta().
AP_BRIDGE_IFACE = os.environ.get("AP_BRIDGE_IFACE", "ap0")

STATE_FILE = os.path.join(STATE_DIR, "state.json")
INDEX = os.path.join(BOOTSTRAP_DIR, "index.html")
QR_AUTH_PNG = os.path.join(BOOTSTRAP_DIR, "qr-auth.png")
QR_WIFI_PNG = os.path.join(BOOTSTRAP_DIR, "qr-wifi.png")
QR_PORTAL_PNG = os.path.join(BOOTSTRAP_DIR, "qr-portal.png")
QR_TRIGGER_PNG = os.path.join(BOOTSTRAP_DIR, "qr-trigger.png")
# Plain-HTTP site built specifically for this exact purpose (checking/
# triggering captive portals) — a reliable, one-scan way to reach the
# venue's sign-in page during the AP+STA bridge, rather than relying on a
# phone's own captive-portal auto-detection heuristics, which iOS in
# particular doesn't always trigger reliably.
CAPTIVE_PORTAL_TRIGGER_URL = "http://neverssl.com/"

# Matches src/lib/helpers/nanoid.ts (nolookalikes-safe, printable on screen).
NANOID_ALPHABET = "6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz"

HOTSPOT_CONNECTION = "chase-kiosk-hotspot"
# Separate connection profile for the captive-portal bridge AP (runs
# alongside WLAN_IFACE's own client connection, not instead of it) so the
# two never collide or get torn down together.
BRIDGE_HOTSPOT_CONNECTION = "chase-kiosk-bridge-hotspot"
# NetworkManager's `wifi hotspot` mode hands out 10.42.0.0/24 with the
# Pi at 10.42.0.1; this is hardcoded in NM and not configurable per-call.
HOTSPOT_GATEWAY = "10.42.0.1"

# Signalled by the portal when /connect receives credentials.
_provision_event = threading.Event()
_provision_status = {
    "state": "idle",
    "message": ""
}


# --- nanoid / state ---------------------------------------------------------

def nanoid(length: int = 30) -> str:
    return "".join(secrets.choice(NANOID_ALPHABET) for _ in range(length))


def load_state() -> dict:
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(state: dict) -> None:
    os.makedirs(STATE_DIR, exist_ok=True)
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f)
    os.chmod(tmp, 0o600)
    os.replace(tmp, STATE_FILE)


def set_provision_status(state: str, message: str = "") -> None:
    _provision_status["state"] = state
    _provision_status["message"] = message


# --- HTTP helpers (outbound) ------------------------------------------------

def http_post_form(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(
        url, data=body, headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def http_get(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as resp:
        return json.loads(resp.read().decode())


def discover() -> dict:
    return http_get(AUTHORITY)


def device_deleted(device_id: str) -> bool:
    """True only on a definitive 404 from /api/kiosk/status — the
    displayDevice row is genuinely gone. Deliberately does NOT trigger on
    `revoked` (that endpoint only ever reports existence, not revocation —
    see its docstring) or on any network/server error: this gates dropping
    the refresh token, so a false positive here would force a real,
    working session back through a full re-pairing for no reason. Fails
    closed (False) on anything but an explicit 404.
    """
    url = f"{BASE_URL}/api/kiosk/status?deviceId={urllib.parse.quote(device_id)}"
    try:
        with urllib.request.urlopen(url, timeout=10):
            return False
    except urllib.error.HTTPError as e:
        return e.code == 404
    except Exception:
        return False


def connectivity_ok() -> bool:
    """Cheap reachability probe. HEAD if accepted, else GET-and-close."""
    try:
        req = urllib.request.Request(PROVISION_PROBE_URL, method="HEAD")
        with urllib.request.urlopen(req, timeout=5):
            return True
    except urllib.error.HTTPError:
        # 4xx/5xx still means we have a usable network path.
        return True
    except Exception:
        pass
    try:
        with urllib.request.urlopen(PROVISION_PROBE_URL, timeout=5) as r:
            r.read(1)
            return True
    except Exception:
        return False


# Well-known captive-portal-detection probes from three different vendors —
# the same technique iOS/Android/Windows/macOS themselves use — queried
# together rather than trusting a single one. Each has its own "no portal"
# signature (an exact status code, an exact body, or both), since a portal
# that redirects or rewrites one of these but not another is exactly the
# false-negative case multiple probes exist to catch. urllib follows
# redirects automatically, so a 30x to an injected login page still resolves
# to a non-matching status/body here.
_CAPTIVE_PORTAL_PROBES = [
    # (url, expected_status, expected_body_or_None)
    (
        "http://captive.apple.com/hotspot-detect.html",
        200,
        "<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>",
    ),
    ("http://connectivitycheck.gstatic.com/generate_204", 204, None),
    ("http://www.msftconnecttest.com/connecttest.txt", 200, "Microsoft Connect Test"),
]


def _probe_clean(url: str, expected_status: int, expected_body: "str | None") -> "bool | None":
    """True if this probe's response matches its own "no portal" signature,
    False if it doesn't (redirect, injected body, wrong status), None if the
    probe couldn't complete at all (DNS failure, connection reset, timeout)."""
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            if r.status != expected_status:
                return False
            if expected_body is None:
                return True
            body = r.read(2048).decode("utf-8", "replace")
            return expected_body in body
    except Exception:
        return None


def captive_portal_likely() -> bool:
    """Best-effort captive-portal detection across several vendors' probes.

    Only meaningful to call once nmcli reports a successful WPA handshake +
    DHCP lease but connectivity_ok() still fails — distinguishes "this
    network needs a browser sign-in" from a genuinely dead connection so we
    can give the operator a more useful message. Returns False (no portal)
    only if every probe that completed came back clean; a single probe
    reporting interception is enough to call it a portal, since a portal
    that only intercepts one of these hosts is exactly the case multiple
    probes exist to catch.
    """
    results = [_probe_clean(url, status, body) for url, status, body in _CAPTIVE_PORTAL_PROBES]
    if any(r is False for r in results):
        return True
    if all(r is None for r in results):
        # Every probe failed to even complete. Weaker evidence *against* a
        # captive portal than a clean non-matching response, not stronger —
        # plenty of real venue portals (this is the primary target network
        # for this device) block DNS resolution for anything outside their
        # own domain entirely, rather than cleanly redirecting the HTTP
        # request. This is only ever called after connectivity_ok() has
        # already failed despite a successful WPA handshake + DHCP lease, so
        # there's already strong reason to suspect a portal — defaulting to
        # False here would silently send every such network down the
        # generic "internet access failed" path instead of the
        # captive-portal-specific one (bridge AP, or the travel-router/
        # MAC-whitelist advice).
        return True
    # At least one probe completed and none reported interception.
    return False


def mac_address() -> str:
    """WLAN hardware address — handed to venue IT to whitelist a device
    stuck behind a captive portal this script can't click through itself."""
    try:
        with open(f"/sys/class/net/{WLAN_IFACE}/address") as f:
            return f.read().strip()
    except Exception:
        return "unknown"


# --- iw / concurrent AP+STA capability --------------------------------------
#
# Some WiFi chips can run as an access point and a station at once on one
# radio; others genuinely cannot. This is a hardware/driver property, not
# something we can paper over, so we probe for it and take a different path
# depending on the answer rather than assuming either way.

def _iw(*args: str, timeout: int = 10) -> subprocess.CompletedProcess:
    return subprocess.run([IW, *args], capture_output=True, text=True, timeout=timeout)


def _wlan_phy() -> "str | None":
    """Which `iw` phy backs WLAN_IFACE (e.g. 'phy0'), or None if undetectable."""
    try:
        res = _iw("dev", WLAN_IFACE, "info")
    except Exception:
        return None
    m = re.search(r"^\s*wiphy (\d+)", res.stdout, re.MULTILINE)
    return f"phy{m.group(1)}" if m else None


def wlan_channel_and_band() -> "tuple[int, str] | None":
    """Channel + nmcli band token (bg|a) WLAN_IFACE's radio is actually
    tuned to right now, read straight from `iw dev <WLAN_IFACE> info`'s
    "channel: N (freq MHz)" line. None if it can't be determined (not
    actually associated yet, iw parsing failure, ...).
    """
    try:
        res = _iw("dev", WLAN_IFACE, "info")
    except Exception:
        return None
    m = re.search(r"channel (\d+) \((\d+) MHz\)", res.stdout)
    if not m:
        return None
    channel = int(m.group(1))
    freq = int(m.group(2))
    return channel, ("a" if freq >= 3000 else "bg")


def supports_concurrent_ap_sta() -> bool:
    """Best-effort check of whether this radio can be a station (joined to
    the venue network) and an access point (serving the operator's phone)
    at the same time — needed to bridge a captive portal without dropping
    the upstream connection. Driver/chipset-dependent; `iw` has no
    machine-readable output for this, so we scrape `iw phy <N> info`'s
    "valid interface combinations" section. Any parse failure returns
    False — safer to fall back to the single-radio flow than to attempt
    something that may not actually be supported.
    """
    phy = _wlan_phy()
    if not phy:
        return False
    try:
        res = _iw("phy", phy, "info")
    except Exception:
        return False
    if res.returncode != 0:
        return False

    text = res.stdout
    start = text.find("valid interface combinations:")
    if start == -1:
        return False

    # Each combination is printed as one or more indented lines starting
    # with '*', continuing until "total <= N, #channels <= N"; the section
    # ends at the next line that isn't part of a combination entry.
    block_lines = []
    for line in text[start:].splitlines()[1:]:
        stripped = line.strip()
        if not stripped:
            break
        if stripped.startswith(("*", "total", "#channels")) or "{" in stripped:
            block_lines.append(stripped)
            continue
        break

    for combo in "\n".join(block_lines).split("*")[1:]:
        # Each combination lists one or more independent caps, e.g.
        # "#{ managed } <= 1, #{ AP, mesh point } <= 1" (managed and AP each
        # get their own interface) vs. "#{ managed, AP } <= 1" (they share a
        # single slot and can't coexist). Every cap in the combo applies to
        # the same active interface set, so *all* of them — not just the
        # first managed/AP match — have to allow one managed + one AP at
        # once, and so does the combo's overall "total <= N" limit, if any.
        groups: list[tuple[set[str], int]] = []
        for m in re.finditer(r"#\{([^}]*)\}\s*<=\s*(\d+)", combo):
            types = {t.strip() for t in m.group(1).split(",")}
            groups.append((types, int(m.group(2))))

        relevant = [g for g in groups if g[0] & {"managed", "AP"}]
        if not relevant:
            continue
        if not all(cap >= len(types & {"managed", "AP"}) for types, cap in relevant):
            continue

        total_match = re.search(r"total\s*<=\s*(\d+)", combo)
        if total_match and int(total_match.group(1)) < 2:
            continue

        return True
    return False


def _iface_exists(name: str) -> bool:
    """False both when the interface genuinely doesn't exist and when `ip`
    itself couldn't be run — this only ever gates whether to (re)create the
    bridge interface, and creating it is itself guarded, so failing closed
    here is safe, whereas letting an exception escape isn't: this is called
    from deep inside the captive-portal bridge path, and an uncaught
    exception there previously meant the operator's setup screen silently
    reset with no error shown at all."""
    try:
        res = subprocess.run([IP, "link", "show", name], capture_output=True, text=True, timeout=10)
    except Exception:
        return False
    return res.returncode == 0


def _nm_device_ready(name: str, timeout: float = 8.0, interval: float = 0.5) -> bool:
    """Poll nmcli until NetworkManager itself reports `name` as a real,
    usable device rather than "unmanaged" or "unavailable" (or absent
    entirely). A virtual interface just created via `iw ... interface add`
    exists at the kernel level immediately, but NetworkManager only learns
    about it once its own udev/netlink event loop catches up — calling
    `nmcli device wifi hotspot` before that point reliably fails with
    "device is not available" even though `ip link show` already sees it.
    """
    deadline = time.time() + timeout
    while time.time() < deadline:
        res = _nmcli("-t", "-f", "DEVICE,STATE", "device", "status", timeout=10)
        for line in res.stdout.splitlines():
            device, sep, state = line.partition(":")
            if sep and device == name and state not in ("unmanaged", "unavailable"):
                return True
        time.sleep(interval)
    return False


def ensure_ap_bridge_iface() -> bool:
    """Create AP_BRIDGE_IFACE as a second virtual interface on WLAN_IFACE's
    radio, in AP mode, leaving WLAN_IFACE itself untouched, and wait for
    NetworkManager to actually pick it up. Idempotent. Returns False if
    creation fails (e.g. the hardware lied about supports_concurrent_ap_sta(),
    or the interface is stuck from a previous crashed run in a state `iw`
    won't reuse), or if NetworkManager never notices the new device."""
    if not _iface_exists(AP_BRIDGE_IFACE):
        try:
            res = _iw("dev", WLAN_IFACE, "interface", "add", AP_BRIDGE_IFACE, "type", "__ap")
        except Exception:
            return False
        if res.returncode != 0:
            return False
    return _nm_device_ready(AP_BRIDGE_IFACE)


def delete_ap_bridge_iface() -> None:
    # Best-effort cleanup, always called from a `finally` — must never raise,
    # or it would replace whatever exception/return was already in flight.
    try:
        subprocess.run([IP, "link", "set", AP_BRIDGE_IFACE, "down"], capture_output=True, timeout=10)
    except Exception:
        pass
    try:
        _iw("dev", AP_BRIDGE_IFACE, "del")
    except Exception:
        pass


# --- nmcli wrappers ---------------------------------------------------------

def _nmcli(*args: str, timeout: int = 30) -> subprocess.CompletedProcess:
    return subprocess.run(
        [NMCLI, *args], capture_output=True, text=True, timeout=timeout
    )


def _nm_unescape(s: str) -> str:
    r"""Reverse nmcli --terse escaping (`\:` -> `:`, `\\` -> `\`)."""
    out, i = [], 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            out.append(s[i + 1])
            i += 2
        else:
            out.append(s[i])
            i += 1
    return "".join(out)


def scan_networks() -> list[dict]:
    """List visible WiFi networks. Returns [{ssid, signal, security}, ...]."""
    # `rescan auto` lets nmcli reuse a recent scan if fresh.
    _nmcli("device", "wifi", "rescan", "ifname", WLAN_IFACE, timeout=15)
    res = _nmcli(
        "-t", "-f", "SSID,SIGNAL,SECURITY",
        "device", "wifi", "list", "ifname", WLAN_IFACE,
        timeout=15,
    )
    seen, out = set(), []
    for line in res.stdout.splitlines():
        # Split on unescaped ':'.
        parts, buf = [], []
        i = 0
        while i < len(line):
            if line[i] == "\\" and i + 1 < len(line):
                buf.append(line[i:i + 2])
                i += 2
            elif line[i] == ":":
                parts.append("".join(buf))
                buf = []
                i += 1
            else:
                buf.append(line[i])
                i += 1
        parts.append("".join(buf))
        if len(parts) < 3:
            continue
        ssid = _nm_unescape(parts[0])
        if not ssid or ssid in seen:
            continue
        seen.add(ssid)
        try:
            signal = int(parts[1])
        except ValueError:
            signal = 0
        out.append({"ssid": ssid, "signal": signal, "security": _nm_unescape(parts[2])})
    out.sort(key=lambda n: n["signal"], reverse=True)
    return out


def hotspot_up(
    ssid: str,
    psk: str,
    ifname: str = WLAN_IFACE,
    connection_name: str = HOTSPOT_CONNECTION,
    channel: "int | None" = None,
    band: "str | None" = None,
) -> None:
    """Bring up an AP on `ifname`.

    For the normal (single-radio) case `ifname` is WLAN_IFACE itself, and
    any existing client connection on it is torn down first to free the
    radio for AP mode. For the captive-portal bridge case `ifname` is
    AP_BRIDGE_IFACE, a second virtual interface — WLAN_IFACE's own client
    connection must be left alone there, that's the whole point.

    `channel`/`band` matter only for that bridge case: AP_BRIDGE_IFACE
    shares one physical radio with WLAN_IFACE, and a single radio can only
    ever be tuned to one channel — every WiFi chipset's concurrent AP+STA
    support requires both interfaces to sit on that same channel. Leaving
    nmcli to pick its own default (which knows nothing about WLAN_IFACE's
    existing connection) reliably produces an AP whose SSID broadcasts —
    so it's visible to scan — but whose beacon channel doesn't match where
    the radio is actually transmitting, so a real client's association
    just hangs. Passed straight through to nmcli when both are given.

    Raises RuntimeError if nmcli could not create the hotspot — callers
    must NOT continue (the portal would bind on an interface that has no
    AP and no clients could ever reach it).
    """
    if ifname == WLAN_IFACE:
        _nmcli("device", "disconnect", WLAN_IFACE, timeout=15)
        # NetworkManager needs a moment to actually free the device after a
        # disconnect before it'll accept switching it to AP mode — most
        # visibly right after a failed connect_wifi() at a venue network.
        # hotspot_up_retrying() also retries, but a real settle delay here
        # cuts down how often the first attempt needs to fail at all.
        time.sleep(1)
    args = [
        "device", "wifi", "hotspot",
        "ifname", ifname,
        "con-name", connection_name,
        "ssid", ssid,
        "password", psk,
    ]
    if channel is not None and band is not None:
        args += ["channel", str(channel), "band", band]
    res = _nmcli(*args, timeout=30)
    if res.returncode != 0:
        raise RuntimeError(
            f"nmcli hotspot failed (exit {res.returncode}): "
            f"{(res.stderr or res.stdout or '').strip()}"
        )
    # `device wifi hotspot` has no flag for this — WPS comes up enabled by
    # default, which makes Windows/Android show a WPS-PIN prompt instead of
    # the password field. Disable it post-creation and reactivate.
    _nmcli(
        "connection", "modify", connection_name,
        "802-11-wireless-security.wps-method", "disabled",
        timeout=15,
    )
    res2 = _nmcli("connection", "up", connection_name, timeout=30)
    if res2.returncode != 0:
        raise RuntimeError(
            f"nmcli connection up (after disabling WPS) failed "
            f"(exit {res2.returncode}): {(res2.stderr or res2.stdout or '').strip()}"
        )


def hotspot_up_retrying(
    ssid: str,
    psk: str,
    ifname: str = WLAN_IFACE,
    connection_name: str = HOTSPOT_CONNECTION,
    attempts: int = 5,
    backoff_seconds: float = 3.0,
) -> None:
    """hotspot_up(), retried a few times with a short backoff before giving
    up. NetworkManager can be briefly unready to switch `ifname` from client
    to AP mode right after tearing down a connection on it — most visibly,
    the re-up immediately following a failed connect_wifi() attempt at a
    venue network, or after the AP+STA bridge iface is torn down — so a
    single hotspot_up() failure right there isn't necessarily permanent.
    Callers that reach here after forget_active_wifi() has already dropped
    the last saved WiFi profile have no working fallback network to give up
    to, so this is deliberately given a generous budget rather than a quick
    one. Re-raises the last error if every attempt fails.
    """
    last_error: Exception = RuntimeError("unreachable")
    for attempt in range(1, attempts + 1):
        try:
            hotspot_up(ssid, psk, ifname=ifname, connection_name=connection_name)
            return
        except Exception as e:
            last_error = e
            if attempt < attempts:
                time.sleep(backoff_seconds)
    raise last_error


def hotspot_down(connection_name: str = HOTSPOT_CONNECTION) -> None:
    _nmcli("connection", "down", connection_name, timeout=15)
    _nmcli("connection", "delete", connection_name, timeout=15)


def connect_wifi(ssid: str, psk: str) -> tuple[bool, str]:
    """Try to join `ssid`. Returns (ok, message).

    A bad password or an out-of-range SSID both fail fast (NM gives up
    on the handshake/association within a few seconds); a short timeout
    here just gets the setup AP back sooner on the common failure case.
    """
    args = ["device", "wifi", "connect", ssid, "ifname", WLAN_IFACE]
    if psk:
        args += ["password", psk]
    try:
        res = _nmcli(*args, timeout=25)
    except subprocess.TimeoutExpired:
        return False, f"Timed out connecting to {ssid}."
    if res.returncode == 0:
        return True, "Connected."
    return False, (res.stderr or res.stdout or "Connection failed").strip()


def has_saved_wifi_profile() -> bool:
    """True if NetworkManager has a saved WiFi client profile — active or
    not — other than this helper's own setup/bridge hotspot connections.

    Used to tell a genuinely fresh device (never provisioned, or just
    factory-reset) apart from one that has a real venue network to retry:
    only the latter is worth waiting/retrying for before falling back to
    the setup AP. TYPE is a fixed nmcli vocabulary with no ':' in it, so
    partitioning on the first ':' isolates it even though NAME (an SSID,
    arbitrary) may itself contain escaped colons.
    """
    res = _nmcli("-t", "-f", "TYPE,NAME", "connection", "show", timeout=10)
    for line in res.stdout.splitlines():
        ctype, sep, rest = line.partition(":")
        if not sep or ctype != "802-11-wireless":
            continue
        name = _nm_unescape(rest)
        if name not in (HOTSPOT_CONNECTION, BRIDGE_HOTSPOT_CONNECTION):
            return True
    return False


def forget_active_wifi() -> None:
    """Delete any non-hotspot WLAN connection so the next loop re-provisions."""
    res = _nmcli(
        "-t", "-f", "NAME,TYPE,DEVICE",
        "connection", "show", "--active",
        timeout=10,
    )
    for line in res.stdout.splitlines():
        parts = line.split(":")
        if len(parts) < 3:
            continue
        name, ctype, device = parts[0], parts[1], parts[2]
        if ctype == "802-11-wireless" and name != HOTSPOT_CONNECTION and device == WLAN_IFACE:
            _nmcli("connection", "delete", name, timeout=10)


# --- Page rendering ---------------------------------------------------------

def write_page(html: str) -> None:
    os.makedirs(BOOTSTRAP_DIR, exist_ok=True)
    tmp = INDEX + ".tmp"
    with open(tmp, "w") as f:
        f.write(html)
    os.replace(tmp, INDEX)


def reload_kiosk() -> None:
    # services.cage in NixOS exposes its compositor as `cage-tty1.service`,
    # not `chase-kiosk.service` — restarting reloads Chromium's URL.
    try:
        subprocess.run([SYSTEMCTL, "restart", "cage-tty1.service"], check=False, timeout=30)
    except Exception:
        pass


def make_qr(text: str, path: str) -> None:
    subprocess.run([QRENCODE, "-o", path, "-s", "8", "-m", "2", text], check=True)


def _esc(s: str) -> str:
    return (
        s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        .replace('"', "&quot;").replace("'", "&#39;")
    )


def loading_page(msg: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8>"
        "<title>CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"
        "cursor:none'>"
        f"<h1>{_esc(msg)}</h1></body>"
    )


def _countdown_page(title: str, detail: str, interval: int) -> str:
    """Kiosk page that ticks a live per-second countdown and self-reloads
    after `interval` seconds, so a stalled retry never looks frozen."""
    return (
        "<!doctype html><meta charset=utf-8><title>CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;flex-direction:column;align-items:center;justify-content:center;"
        "height:100vh;margin:0;gap:.5rem;cursor:none'>"
        f"<h1 style='margin:0'>{_esc(title)}</h1>"
        f"<p id=countdown style='margin:0;opacity:.8'>Retrying in {interval}s</p>"
        f"<p style='margin:0;opacity:.6;font-size:.9rem'>{_esc(detail)}</p>"
        "<script>"
        f"let s={interval};"
        "const el=document.getElementById('countdown');"
        "setInterval(()=>{s=Math.max(0,s-1);el.textContent='Retrying in '+s+'s';},1000);"
        f"setTimeout(()=>location.reload(),{interval * 1000});"
        "</script></body>"
    )


def waiting_for_network_page(attempt: int, threshold: int, interval: int) -> str:
    """Shown while connectivity is down but we haven't given up and started
    WiFi setup yet."""
    return _countdown_page(
        "Waiting for network…",
        f"Attempt {attempt} of {threshold} — starting WiFi setup if this keeps failing.",
        interval,
    )


def reconnecting_page(attempt: int, interval: int, error: str = "") -> str:
    """Shown when the OIDC discover/refresh/device-grant call fails
    transiently (network blip, Logto 5xx, timeout)."""
    detail = f"Attempt {attempt} — {error}" if error else f"Attempt {attempt}"
    return _countdown_page("Reconnecting…", detail, interval)


def provisioning_kiosk_page(ssid: str, psk: str, portal_url: str, error: str = "") -> str:
    """Kiosk-facing screen when there's no upstream network.

    `error` carries the reason the last connection attempt failed (wrong
    password, unreachable, captive portal, …) — the operator's phone loses
    this display's setup network the instant a test starts, so it may never
    see the phone-side error page; showing it here too doesn't depend on
    that connection surviving.
    """
    error_html = (
        "<div style='background:#7f1d1d;color:#fff;padding:.75rem 1.25rem;"
        "border-radius:.5rem;max-width:42rem;text-align:center'>"
        f"{_esc(error)}</div>"
        if error
        else ""
    )
    return (
        "<!doctype html><meta charset=utf-8><title>Set up WiFi</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "margin:0;padding:2rem;display:flex;flex-direction:column;"
        "align-items:center;justify-content:center;min-height:100vh;gap:1.5rem;"
        "cursor:none'>"
        "<h1 style='margin:0'>This display needs a network connection</h1>"
        f"{error_html}"
        "<p style='margin:0;opacity:.8;max-width:42rem;text-align:center'>"
        "Scan the left QR with your phone to join this display's setup network, "
        "then scan the right QR to open the captive portal and pick the venue WiFi.</p>"
        "<p style='margin:0;opacity:.6;max-width:42rem;text-align:center;font-size:.9rem'>"
        "Or just plug in an Ethernet cable — this screen will clear on its own "
        "once it's online, no WiFi setup needed.</p>"
        "<div style='display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;"
        "justify-content:center'>"
        "<div style='display:flex;flex-direction:column;align-items:center;gap:.5rem'>"
        "<img src='qr-wifi.png' style='width:360px;height:360px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        "<div style='opacity:.7;font-size:.9rem'>1. Join WiFi</div></div>"
        "<div style='display:flex;flex-direction:column;align-items:center;gap:.5rem'>"
        "<img src='qr-portal.png' style='width:360px;height:360px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        "<div style='opacity:.7;font-size:.9rem'>2. Open portal</div></div></div>"
        "<div style='display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;"
        "font-family:monospace'>"
        f"<div>Network: <b>{_esc(ssid)}</b></div>"
        f"<div>Password: <b>{_esc(psk)}</b></div>"
        f"<div>Portal: <b>{_esc(portal_url)}</b></div></div>"
        # Cheap heartbeat: helper rewrites INDEX when state advances; reload
        # makes Chromium pick up the new screen without a service restart.
        "<script>setTimeout(()=>location.reload(),5000)</script></body>"
    )


def provisioning_testing_kiosk_page(ssid: str) -> str:
    """Kiosk-facing screen while testing a submitted venue network.

    This is served from the local loopback bootstrap server, not through
    wlan0, so — unlike the operator's phone — it keeps working the whole
    time the radio is busy tearing down the setup AP and joining `ssid`.
    """
    return (
        "<!doctype html><meta charset=utf-8><title>Connecting…</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;flex-direction:column;align-items:center;justify-content:center;"
        "height:100vh;margin:0;gap:1rem;cursor:none'>"
        "<h1 style='margin:0'>Connecting…</h1>"
        f"<p style='opacity:.85;font-size:1.25rem;margin:0'>Trying to join <b>{_esc(ssid)}</b></p>"
        "<p style='opacity:.6;max-width:32rem;text-align:center;margin:0'>"
        "This display's own setup network is offline while it tests the "
        "connection. This can take up to a minute.</p>"
        "</body>"
    )


def captive_portal_bridge_kiosk_page(upstream_ssid: str, bridge_ssid: str, bridge_psk: str) -> str:
    """Shown while bridging a captive portal: WLAN_IFACE stays joined to
    `upstream_ssid` (blocked behind the portal) while AP_BRIDGE_IFACE, a
    second interface, serves the operator's phone so it can reach that
    portal through the Pi's own upstream session and complete it."""
    return (
        "<!doctype html><meta charset=utf-8><title>Sign in to WiFi</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "margin:0;padding:2rem;display:flex;flex-direction:column;"
        "align-items:center;justify-content:center;min-height:100vh;gap:1.25rem;"
        "text-align:center;cursor:none'>"
        f"<h1 style='margin:0'>'{_esc(upstream_ssid)}' needs a sign-in</h1>"
        "<p style='margin:0;opacity:.8;max-width:42rem'>"
        "Scan the left QR with your phone to join this display's setup "
        "network (same one as before), then scan the right QR — you should "
        f"land on the sign-in page for <b>{_esc(upstream_ssid)}</b>. "
        "Complete it there; this display picks up the connection "
        "automatically once you're done.</p>"
        "<div style='display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;"
        "justify-content:center'>"
        "<div style='display:flex;flex-direction:column;align-items:center;gap:.5rem'>"
        "<img src='qr-wifi.png' style='width:260px;height:260px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        "<div style='opacity:.7;font-size:.9rem'>1. Join WiFi</div></div>"
        "<div style='display:flex;flex-direction:column;align-items:center;gap:.5rem'>"
        "<img src='qr-trigger.png' style='width:260px;height:260px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        "<div style='opacity:.7;font-size:.9rem'>2. Open sign-in page</div></div></div>"
        "<div style='font-family:monospace;opacity:.9'>"
        f"<div>Setup network: <b>{_esc(bridge_ssid)}</b></div>"
        f"<div>Password: <b>{_esc(bridge_psk)}</b></div></div>"
        "<script>setTimeout(()=>location.reload(),5000)</script>"
        "</body>"
    )


def device_grant_page(verification_uri: str, user_code: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Pair CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;flex-direction:column;align-items:center;justify-content:center;"
        "height:100vh;margin:0;gap:1rem;cursor:none'>"
        "<h1>Sign this display in</h1>"
        "<p>Scan and sign in with your own CHASE account.</p>"
        "<img src='qr-auth.png' style='width:420px;height:420px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        f"<p>{_esc(verification_uri)}</p>"
        f"<p style='font-size:2rem;font-weight:bold;letter-spacing:.2em'>{_esc(user_code)}</p>"
        # The device-grant poll can take a while; refresh keeps the page live.
        "<script>setTimeout(()=>location.reload(),10000)</script>"
        "</body>"
    )


def session_page(tokens: dict, device_id: str) -> str:
    # Auto-submitting form: a top-level POST so Set-Cookie lands in Chromium.
    def field(name, value):
        if value is None:
            return ""
        return f"<input type=hidden name={name} value=\"{_esc(str(value))}\">"

    action = f"{BASE_URL}/api/kiosk/session"
    return (
        "<!doctype html><meta charset=utf-8><title>CHASE display</title>"
        "<body onload='document.forms[0].submit()' "
        "style='background:#1d232a;cursor:none'>"
        f"<form method=post action=\"{_esc(action)}\">"
        + field("accessToken", tokens.get("access_token"))
        + field("idToken", tokens.get("id_token"))
        + field("expiresIn", tokens.get("expires_in"))
        + field("deviceId", device_id)
        + "</form></body>"
    )


_MANUAL_SSID_VALUE = "__manual__"


def portal_form_page(networks: list[dict], message: str = "") -> str:
    options = "".join(
        f"<option value=\"{_esc(n['ssid'])}\">"
        f"{_esc(n['ssid'])} ({n['signal']}%)"
        f"{' [open]' if not n['security'] else ''}</option>"
        for n in networks
    )
    if not options:
        options = "<option disabled>No networks visible — wait a few seconds and reload</option>"
    options += f"<option value=\"{_MANUAL_SSID_VALUE}\">Other (hidden network)…</option>"
    msg_html = (
        f"<p style='background:#fee;color:#900;padding:.75rem;border-radius:.5rem'>{_esc(message)}</p>"
        if message else ""
    )
    return (
        "<!doctype html><meta charset=utf-8><title>CHASE display — WiFi setup</title>"
        "<style>body{font-family:sans-serif;max-width:32rem;margin:2rem auto;padding:0 1rem}"
        "label{display:block;margin:.75rem 0 .25rem;font-weight:600}"
        "select,input{width:100%;padding:.6rem;border:1px solid #ccc;border-radius:.5rem;font-size:1rem}"
        "button{margin-top:1rem;width:100%;padding:.75rem;background:#1d232a;color:#fff;border:0;"
        "border-radius:.5rem;font-size:1rem}</style>"
        "<body>"
        "<h1>Connect this display to WiFi</h1>"
        f"{msg_html}"
        # Outside the form and type=button so it can never submit it. Its
        # own full-width button rather than a small icon next to the select
        # — the network list only updates on reload (nmcli's scan cache is
        # ~10s server-side), which isn't obvious unless this says so plainly.
        "<button type=button onclick='location.reload()' "
        "style='width:100%;padding:.75rem;margin-top:1rem;font-size:1rem;"
        "font-weight:600;background:#fff;color:#1d232a;"
        "border:2px solid #1d232a;border-radius:.5rem'>"
        "↻ Rescan for Wi-Fi networks</button>"
        "<form method=post action=/connect>"
        "<label for=ssid>Network</label>"
        f"<select id=ssid name=ssid required "
        f"onchange=\"document.getElementById('manualWrap').style.display="
        f"this.value==='{_MANUAL_SSID_VALUE}'?'block':'none'\">{options}</select>"
        "<div id=manualWrap style='display:none'>"
        "<label for=manualSsid>Network name (SSID)</label>"
        "<input id=manualSsid name=manualSsid type=text autocomplete=off>"
        "</div>"
        "<label for=psk>Password</label>"
        "<input id=psk name=psk type=password autocomplete=off>"
        "<button type=submit>Connect</button>"
        "</form></body>"
    )


def portal_testing_page(message: str = "") -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Testing connection</title>"
        "<body style='font-family:sans-serif;max-width:32rem;margin:4rem auto;text-align:center'>"
        f"<h1>{_esc(message or 'Testing WiFi connection…')}</h1>"
        "<p>The display drops its setup network while it tries to join yours, "
        "so this page will stop updating. If it succeeds, this page just goes "
        "quiet — you can close it. If it fails, the setup network comes back "
        "and this page will show the error.</p>"
        # Keep polling /status; if the AP briefly drops while the Pi joins
        # the new network, the reload just retries once it's back.
        "<script>setTimeout(()=>location.reload(),1500)</script>"
        "</body>"
    )


def portal_success_page() -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Connected</title>"
        "<body style='font-family:sans-serif;max-width:32rem;margin:4rem auto;text-align:center'>"
        "<h1>Connected</h1><p>The display is now online. You can close this page.</p></body>"
    )


# --- HTTP servers -----------------------------------------------------------

def serve_bootstrap() -> None:
    """Local-only :8081 server serving the kiosk-facing INDEX + QR pngs."""
    os.makedirs(BOOTSTRAP_DIR, exist_ok=True)
    write_page(loading_page("Starting…"))

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=BOOTSTRAP_DIR, **kw)

        def log_message(self, *a):
            pass

    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", BOOTSTRAP_PORT), Handler)
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()


class PortalHandler(http.server.BaseHTTPRequestHandler):
    """Captive portal on :80 (bound to the hotspot subnet)."""

    server_version = "CHASEKiosk/1"

    # Credentials submitted via /connect; the main loop pops it.
    pending: "dict[str, str] | None" = None
    last_error: str = ""
    networks_cache: list = []
    networks_cache_at: float = 0.0

    def log_message(self, *a):
        pass

    def _redirect(self, location: str) -> None:
        self.send_response(302)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _html(self, code: int, body: str) -> None:
        data = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    @classmethod
    def _scan_cached(cls) -> list:
        now = time.time()
        if not cls.networks_cache or now - cls.networks_cache_at > 10:
            try:
                cls.networks_cache = scan_networks()
            except Exception:
                cls.networks_cache = []
            cls.networks_cache_at = now
        return cls.networks_cache

    def do_GET(self):  # noqa: N802
        path = urllib.parse.urlparse(self.path).path
        if path in ("/", "/index.html"):
            self._html(200, portal_form_page(self._scan_cached(), PortalHandler.last_error))
            PortalHandler.last_error = ""
            return
        if path == "/status":
            status = _provision_status["state"]
            message = _provision_status["message"]
            if status == "testing":
                self._html(200, portal_testing_page(message))
                return
            if status == "failed":
                self._html(200, portal_form_page(self._scan_cached(), message))
                return
            if status == "success":
                self._html(200, portal_success_page())
                return
            self._html(200, portal_form_page(self._scan_cached()))
            return
        # Captive-portal probes from every major OS hit known paths and want
        # specific responses. ANYTHING that isn't the success response above
        # nudges the OS to pop the captive-portal sheet, so we just redirect
        # to the form.
        self._redirect(f"http://{HOTSPOT_GATEWAY}/")

    def do_POST(self):  # noqa: N802
        if urllib.parse.urlparse(self.path).path != "/connect":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length).decode("utf-8", "replace")
        form = urllib.parse.parse_qs(raw)
        ssid = (form.get("ssid", [""])[0] or "").strip()
        if ssid == _MANUAL_SSID_VALUE:
            ssid = (form.get("manualSsid", [""])[0] or "").strip()
        psk = (form.get("psk", [""])[0] or "")
        if not ssid:
            PortalHandler.last_error = "Pick a network or enter its name."
            self._redirect("/")
            return
        PortalHandler.pending = {"ssid": ssid, "psk": psk}
        _provision_event.set()
        self._html(200, portal_testing_page(f"Testing {ssid}…"))


class _ReusableThreadingTCPServer(socketserver.ThreadingTCPServer):
    # Setting allow_reuse_address on the instance after __init__ is a no-op
    # because server_bind has already run. The flag must be on the class.
    allow_reuse_address = True
    daemon_threads = True


def serve_portal() -> _ReusableThreadingTCPServer:
    server = _ReusableThreadingTCPServer(("0.0.0.0", PROVISION_HTTP_PORT), PortalHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


# --- Provisioning loop ------------------------------------------------------

def hotspot_credentials(state: dict, device_id: str) -> tuple[str, str]:
    """Per-device SSID + PSK, persisted so they're stable across reboots."""
    ssid = state.get("hotspot_ssid")
    psk = state.get("hotspot_psk")
    if not ssid:
        ssid = f"CHASE-Display-{device_id[-4:]}"
        state["hotspot_ssid"] = ssid
    if not psk:
        psk = nanoid(10)
        state["hotspot_psk"] = psk
    save_state(state)
    return ssid, psk


def wifi_qr_payload(ssid: str, psk: str) -> str:
    # Standard Wi-Fi network share QR (`WIFI:T:WPA;S:<ssid>;P:<psk>;;`).
    # Escape the special chars in SSID/PSK per the format spec.
    def esc(s: str) -> str:
        out = []
        for ch in s:
            if ch in ("\\", ";", ",", ":", '"'):
                out.append("\\")
            out.append(ch)
        return "".join(out)

    return f"WIFI:T:WPA;S:{esc(ssid)};P:{esc(psk)};;"


def try_captive_portal_bridge(
    bridge_ssid: str, bridge_psk: str, upstream_ssid: str, timeout_seconds: int = 300
) -> tuple[bool, str]:
    """Bring up AP_BRIDGE_IFACE while WLAN_IFACE stays joined to
    `upstream_ssid`, so the operator can rejoin from their phone and
    complete the venue's captive portal — its redirect applies to the Pi's
    own upstream session (by IP/MAC), so once satisfied every device behind
    this bridge, the Pi included, gets full internet access at once.

    Only call this after supports_concurrent_ap_sta() and a successful
    WPA handshake + DHCP lease on WLAN_IFACE. Returns (True, "") once
    connectivity_ok() succeeds; (False, reason) on setup failure or timeout
    — in either case the bridge AP is always torn down before returning,
    WLAN_IFACE is never touched. The reason matters here more than most:
    supports_concurrent_ap_sta() reads the *driver's advertised* interface
    combinations, but real hardware (the Pi's own onboard chip included)
    is known to not actually honor concurrent AP+STA despite advertising
    it, so a quick failure right after setup is an expected outcome to be
    able to show, not just a hypothetical.
    """
    # AP_BRIDGE_IFACE shares WLAN_IFACE's physical radio, which can only be
    # tuned to one channel — the bridge AP has to sit on whichever channel
    # WLAN_IFACE is already using for upstream_ssid, or it comes up visibly
    # in a scan but never lets a real client actually associate. Check this
    # before creating anything: if it can't be determined, the bridge would
    # only look like it worked.
    channel_band = wlan_channel_and_band()
    if channel_band is None:
        reason = f"couldn't determine which WiFi channel {upstream_ssid} is on"
        print("chase-kiosk-helper:", reason, flush=True)
        return False, reason

    if not ensure_ap_bridge_iface():
        reason = "could not create the second WiFi interface needed to bridge this portal"
        print("chase-kiosk-helper:", reason, flush=True)
        return False, reason

    try:
        make_qr(CAPTIVE_PORTAL_TRIGGER_URL, QR_TRIGGER_PNG)
        write_page(captive_portal_bridge_kiosk_page(upstream_ssid, bridge_ssid, bridge_psk))
        reload_kiosk()
    except Exception as e:
        print("chase-kiosk-helper: bridge screen failed:", repr(e), flush=True)
        delete_ap_bridge_iface()
        return False, f"could not show the sign-in instructions for {upstream_ssid} ({e})"

    try:
        hotspot_up(
            bridge_ssid, bridge_psk, ifname=AP_BRIDGE_IFACE, connection_name=BRIDGE_HOTSPOT_CONNECTION,
            channel=channel_band[0], band=channel_band[1],
        )
    except Exception as e:
        print("chase-kiosk-helper: bridge hotspot_up failed:", repr(e), flush=True)
        delete_ap_bridge_iface()
        return False, f"this WiFi hardware couldn't run a bridge network alongside {upstream_ssid} ({e})"

    try:
        deadline = time.time() + timeout_seconds
        while time.time() < deadline:
            if connectivity_ok():
                return True, ""
            time.sleep(3)
        return False, "no one completed the sign-in on the bridge network in time"
    finally:
        try:
            hotspot_down(connection_name=BRIDGE_HOTSPOT_CONNECTION)
        except Exception:
            pass
        delete_ap_bridge_iface()


def run_provisioning(state: dict, device_id: str) -> None:
    """Bring up the AP, show the dual-QR screen, wait for /connect success.

    Loops indefinitely and only ever returns on a successful connection.
    main() calls this only after forget_active_wifi() has already dropped
    the last saved WiFi profile, so its own "waiting for network" reconnect
    loop has nothing left to reconnect to — falling out of here early used
    to hand control back to it anyway, which meant a guaranteed
    PROVISION_FAILURE_THRESHOLD * PROVISION_PROBE_INTERVAL (6 * 30s by
    default) of dead waiting on every hiccup in here (NetworkManager
    settling slowly after tearing down a just-failed venue connection, an
    nmcli/iw call raising unexpectedly, ...) before the setup AP ever came
    back. Every failure below — expected or not — is now logged and
    retried in place instead.
    """
    ssid, psk = hotspot_credentials(state, device_id)
    portal_url = f"http://{HOTSPOT_GATEWAY}/"

    while True:
        try:
            set_provision_status("idle")
            make_qr(wifi_qr_payload(ssid, psk), QR_WIFI_PNG)
            make_qr(portal_url, QR_PORTAL_PNG)
            write_page(provisioning_kiosk_page(ssid, psk, portal_url))
            reload_kiosk()

            hotspot_up_retrying(ssid, psk)
        except Exception as e:
            print("chase-kiosk-helper: hotspot_up failed:", repr(e), flush=True)
            time.sleep(15)
            continue

        try:
            portal_server = serve_portal()
        except Exception as e:
            print("chase-kiosk-helper: serve_portal failed:", repr(e), flush=True)
            time.sleep(15)
            continue

        try:
            while True:
                try:
                    # Short poll interval (rather than a long wait) so a LAN
                    # cable plugged in while the QR screen is up gets
                    # noticed on its own — NetworkManager brings Ethernet up
                    # and routes through it automatically, with no nmcli
                    # calls needed from us; connectivity_ok() doesn't care
                    # which interface it went out over.
                    _provision_event.wait(timeout=PROVISION_PROBE_INTERVAL)
                    _provision_event.clear()
                    pending = PortalHandler.pending
                    PortalHandler.pending = None
                    if not pending:
                        if connectivity_ok():
                            set_provision_status("success", "Connected")
                            try:
                                hotspot_down()
                            except Exception:
                                pass
                            return
                        continue
                    set_provision_status("testing", f"Testing {pending['ssid']}")
                    # The phone showing the portal loses this display's setup
                    # AP the instant it goes down below, so mirror progress
                    # on the kiosk's own screen too — it's served over
                    # loopback, unaffected by wlan0.
                    write_page(provisioning_testing_kiosk_page(pending["ssid"]))
                    reload_kiosk()

                    # Tear the hotspot down BEFORE attempting the upstream
                    # connect, otherwise the radio is busy in AP mode and
                    # nmcli will refuse.
                    try:
                        hotspot_down()
                    except Exception:
                        pass

                    ok, msg = connect_wifi(pending["ssid"], pending["psk"])
                    if ok:
                        # Wait for DHCP
                        for _ in range(10):
                            if connectivity_ok():
                                set_provision_status("success", "Connected")
                                return
                            time.sleep(2)
                        # Associated + got an IP, but no real internet access
                        # — likely a venue captive portal. If this radio can
                        # run AP+STA at once, bridge it: bring up a second AP
                        # so the operator can complete the portal from their
                        # phone without WLAN_IFACE ever losing its upstream
                        # connection.
                        if captive_portal_likely():
                            bridge_attempted = supports_concurrent_ap_sta()
                            bridge_reason = "this WiFi hardware doesn't support running a second network at the same time"
                            if bridge_attempted:
                                bridge_ok, bridge_reason = try_captive_portal_bridge(
                                    ssid, psk, pending["ssid"]
                                )
                                if bridge_ok:
                                    set_provision_status("success", "Connected")
                                    return
                            # No AP+STA support, or the bridge attempt
                            # itself failed/timed out — bridge_reason says
                            # which, and why, so this doesn't have to be
                            # chased down in the journal. Best remaining
                            # fix: join a travel router/hotspot that already
                            # signed in to this network instead of joining
                            # it directly (the router absorbs the portal;
                            # everything behind it, including this display,
                            # just sees a clean network). Fallback: surface
                            # the MAC in case venue IT can whitelist it —
                            # not guaranteed to be offered everywhere.
                            msg = (
                                f"Connected to {pending['ssid']}, but it requires an "
                                "additional sign-in (captive portal) before allowing "
                                f"internet access. This display couldn't complete it: "
                                f"{bridge_reason}. Best fix: connect this display to a "
                                "travel router/hotspot that has already signed in "
                                "to this network instead. Otherwise, ask venue "
                                f"staff to whitelist its WiFi hardware address: {mac_address()}"
                            )
                        else:
                            msg = "WiFi connected, but internet access failed."

                    set_provision_status("failed", msg or "Could not connect.")
                    PortalHandler.last_error = msg or "Could not connect — check password."

                    # Bring the hotspot back so the operator can retry.
                    hotspot_up_retrying(ssid, psk)

                    # Show the failure on the kiosk's own screen too, same
                    # reasoning as the "testing" page above — don't rely on
                    # the phone that started the test still being reachable
                    # to see it.
                    write_page(provisioning_kiosk_page(ssid, psk, portal_url, error=PortalHandler.last_error))
                    reload_kiosk()
                except Exception as e:
                    # Anything unexpected here (including hotspot_up_retrying
                    # exhausting its budget) — log it, show it, and restart
                    # the whole round from scratch (fresh QR page, fresh
                    # hotspot_up) rather than falling out to main()'s
                    # reconnect loop. Must surface something on screen, not
                    # just to the journal — silently redrawing the plain QR
                    # page here previously looked indistinguishable from a
                    # network test that was never attempted at all.
                    print("chase-kiosk-helper: provisioning round failed:", repr(e), flush=True)
                    error_message = f"Something went wrong testing that network ({str(e) or type(e).__name__}). Retrying — try again in a moment."
                    PortalHandler.last_error = error_message
                    set_provision_status("failed", error_message)
                    try:
                        write_page(provisioning_kiosk_page(ssid, psk, portal_url, error=error_message))
                        reload_kiosk()
                    except Exception:
                        pass
                    time.sleep(10)
                    break
        finally:
            try:
                portal_server.shutdown()
            except Exception:
                pass
            # shutdown() stops serve_forever but leaves the listening socket
            # bound; server_close() releases it so the next provisioning
            # round can rebind on :80 without a TIME_WAIT collision.
            try:
                portal_server.server_close()
            except Exception:
                pass


def wait_for_connectivity(max_wait_seconds: int) -> bool:
    """Return True once connectivity_ok(); False after the budget elapses."""
    deadline = time.time() + max_wait_seconds
    while time.time() < deadline:
        if connectivity_ok():
            return True
        time.sleep(2)
    return False


# --- OIDC device grant + refresh -------------------------------------------

def device_authorization(meta: dict) -> dict:
    da_endpoint = meta["device_authorization_endpoint"]
    token_endpoint = meta["token_endpoint"]

    resp = http_post_form(da_endpoint, {"client_id": CLIENT_ID, "scope": SCOPES})
    verification = resp.get("verification_uri_complete") or resp["verification_uri"]
    make_qr(verification, QR_AUTH_PNG)
    write_page(device_grant_page(resp["verification_uri"], resp["user_code"]))
    reload_kiosk()

    interval = int(resp.get("interval", 5))
    deadline = time.time() + int(resp.get("expires_in", 600))
    while time.time() < deadline:
        time.sleep(interval)
        try:
            tokens = http_post_form(
                token_endpoint,
                {
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
                    "device_code": resp["device_code"],
                    "client_id": CLIENT_ID,
                },
            )
        except urllib.error.HTTPError as e:
            err = json.loads(e.read().decode()).get("error", "")
            if err == "authorization_pending":
                continue
            if err == "slow_down":
                interval += 5
                continue
            raise
        return tokens
    raise TimeoutError("device authorization expired")


def refresh(meta: dict, refresh_token: str) -> dict:
    return http_post_form(
        meta["token_endpoint"],
        {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": CLIENT_ID,
        },
    )


def _parse_oauth_error(exc: BaseException) -> "dict | None":
    """Parse an HTTPError's RFC 6749 JSON error body ({error, error_description}).

    The response stream can only be read once, so callers must do this a
    single time and share the result rather than each calling exc.read().
    """
    if not isinstance(exc, urllib.error.HTTPError):
        return None
    try:
        return json.loads(exc.read().decode())
    except Exception:
        return None


def _error_summary(exc: BaseException, oauth_error: "dict | None") -> str:
    """Short, screen-safe description of an OIDC/network failure."""
    if isinstance(exc, urllib.error.HTTPError):
        detail = oauth_error.get("error_description") or oauth_error.get("error") if oauth_error else None
        msg = f"HTTP {exc.code}: {detail}" if detail else f"HTTP {exc.code} {exc.reason}"
    elif isinstance(exc, urllib.error.URLError):
        msg = str(exc.reason)
    else:
        msg = str(exc) or type(exc).__name__
    return msg[:200]


# --- Main loop --------------------------------------------------------------

def main() -> None:
    serve_bootstrap()

    state = load_state()
    device_id = state.get("device_id") or nanoid()
    state["device_id"] = device_id
    save_state(state)

    consecutive_failures = 0
    reconnect_attempts = 0
    meta: dict | None = None

    while True:
        # 1. Make sure we have upstream connectivity.
        if not connectivity_ok():
            consecutive_failures += 1
            # A device with no saved WiFi profile at all (first boot, or
            # just factory-reset) has nothing worth retrying — go straight
            # to the setup AP instead of burning PROVISION_FAILURE_THRESHOLD
            # * PROVISION_PROBE_INTERVAL on probes that can only ever fail.
            # A device that DOES have a saved profile still gets the full
            # wait/retry budget first, since that profile is worth retrying
            # (a momentary AP blip, DHCP renewal, etc.).
            no_saved_network = False
            if consecutive_failures == 1:
                try:
                    no_saved_network = not has_saved_wifi_profile()
                except Exception as e:
                    # Can't tell — assume a profile exists (the prior,
                    # safer behavior: wait/retry rather than possibly
                    # jumping to the setup AP while still holding a
                    # perfectly good saved connection).
                    print("chase-kiosk-helper: has_saved_wifi_profile:", repr(e), flush=True)
            if no_saved_network or consecutive_failures >= PROVISION_FAILURE_THRESHOLD:
                # Sustained loss → re-provision. forget_active_wifi() drops
                # the saved NM connection so the radio is free for AP mode.
                try:
                    forget_active_wifi()
                except Exception as e:
                    print("chase-kiosk-helper: forget_active_wifi:", repr(e), flush=True)
                # run_provisioning() itself retries every failure it knows
                # about and is not expected to raise, but forget_active_wifi()
                # just dropped the only saved WiFi profile — if something
                # here does raise anyway, falling through to the connectivity
                # check below would just be a guaranteed
                # PROVISION_FAILURE_THRESHOLD * PROVISION_PROBE_INTERVAL dead
                # wait with nothing to reconnect to, so retry calling back in
                # instead of letting that happen.
                try:
                    run_provisioning(state, device_id)
                except Exception as e:
                    print("chase-kiosk-helper: run_provisioning crashed:", repr(e), flush=True)
                    time.sleep(5)
                consecutive_failures = 0
                meta = None  # re-discover after a network change
                continue
            write_page(
                waiting_for_network_page(
                    consecutive_failures, PROVISION_FAILURE_THRESHOLD, PROVISION_PROBE_INTERVAL
                )
            )
            if consecutive_failures == 1:
                # Chromium runs --kiosk pinned to this page's URL, but once
                # OIDC succeeds it navigates away to the live CHASE app
                # (session_page's auto-submit). Rewriting the file alone
                # wouldn't be seen from there — force it back on screen.
                reload_kiosk()
            time.sleep(PROVISION_PROBE_INTERVAL)
            continue
        consecutive_failures = 0

        # 2. OIDC bootstrap / refresh.
        try:
            if meta is None:
                meta = discover()
            if not state.get("refresh_token"):
                tokens = device_authorization(meta)
            else:
                tokens = refresh(meta, state["refresh_token"])

            # Persist the (possibly rotated) refresh token immediately.
            if tokens.get("refresh_token"):
                state["refresh_token"] = tokens["refresh_token"]
                save_state(state)

            write_page(session_page(tokens, device_id))
            reload_kiosk()
            reconnect_attempts = 0

            # 3. Sleep until just before expiry, but keep probing so we can
            # fall back to provisioning if the venue WiFi dies mid-session.
            expires_in = int(tokens.get("expires_in", 3600))
            sleep_until = time.time() + max(30, expires_in - REFRESH_MARGIN)
            while time.time() < sleep_until:
                time.sleep(min(PROVISION_PROBE_INTERVAL, max(1, int(sleep_until - time.time()))))
                if not connectivity_ok():
                    consecutive_failures += 1
                    if consecutive_failures >= PROVISION_FAILURE_THRESHOLD:
                        break  # outer loop will re-provision
                else:
                    consecutive_failures = 0
                    # Deleting a device (unlike revoking it) means CHASE has
                    # no record of it left at all — drop the refresh token so
                    # a stolen/lost Pi can't keep operating on it indefinitely.
                    # A merely-revoked device keeps its token; the browser's
                    # own live query already shows the revoked screen for
                    # that case, nothing to do here.
                    if device_deleted(device_id):
                        print(
                            "chase-kiosk-helper: device deleted server-side, "
                            "dropping refresh token",
                            flush=True,
                        )
                        state.pop("refresh_token", None)
                        save_state(state)
                        break  # outer loop will start a fresh device grant
        except Exception as e:
            # Only `invalid_grant` from Logto means the refresh token is
            # actually dead (revoked / expired / rotated-and-leaked).
            # Transient failures (network blip, Logto 5xx, timeout) must
            # NOT wipe the token, or every hiccup forces a QR #1 re-auth.
            oauth_error = _parse_oauth_error(e)
            if oauth_error and oauth_error.get("error") == "invalid_grant":
                state.pop("refresh_token", None)
                save_state(state)
            reconnect_attempts += 1
            write_page(reconnecting_page(reconnect_attempts, 10, _error_summary(e, oauth_error)))
            if reconnect_attempts == 1:
                # Same reasoning as the network-wait branch: Chromium may
                # already be showing the live CHASE app on another origin,
                # so rewriting the file alone wouldn't be seen from there.
                reload_kiosk()
            print("chase-kiosk-helper:", repr(e), flush=True)
            time.sleep(10)


if __name__ == "__main__":
    main()
