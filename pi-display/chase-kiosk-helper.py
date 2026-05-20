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

STATE_FILE = os.path.join(STATE_DIR, "state.json")
INDEX = os.path.join(BOOTSTRAP_DIR, "index.html")
QR_AUTH_PNG = os.path.join(BOOTSTRAP_DIR, "qr-auth.png")
QR_WIFI_PNG = os.path.join(BOOTSTRAP_DIR, "qr-wifi.png")
QR_PORTAL_PNG = os.path.join(BOOTSTRAP_DIR, "qr-portal.png")

# Matches src/lib/helpers/nanoid.ts (nolookalikes-safe, printable on screen).
NANOID_ALPHABET = "6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz"

HOTSPOT_CONNECTION = "chase-kiosk-hotspot"
# NetworkManager's `wifi hotspot` mode hands out 10.42.0.0/24 with the
# Pi at 10.42.0.1; this is hardcoded in NM and not configurable per-call.
HOTSPOT_GATEWAY = "10.42.0.1"

# Signalled by the portal when /connect receives credentials.
_provision_event = threading.Event()


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


# --- nmcli wrappers ---------------------------------------------------------

def _nmcli(*args: str, timeout: int = 30) -> subprocess.CompletedProcess:
    return subprocess.run(
        [NMCLI, *args], capture_output=True, text=True, timeout=timeout
    )


def _nm_unescape(s: str) -> str:
    """Reverse nmcli --terse escaping (`\:` -> `:`, `\\` -> `\`)."""
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
                buf.append(line[i:i + 2]); i += 2
            elif line[i] == ":":
                parts.append("".join(buf)); buf = []; i += 1
            else:
                buf.append(line[i]); i += 1
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


def hotspot_up(ssid: str, psk: str) -> None:
    """Bring up the per-device AP. Tears down any client connection first."""
    # Drop any active connection on the WLAN so the radio is free for AP mode.
    _nmcli("device", "disconnect", WLAN_IFACE, timeout=15)
    _nmcli(
        "device", "wifi", "hotspot",
        "ifname", WLAN_IFACE,
        "con-name", HOTSPOT_CONNECTION,
        "ssid", ssid,
        "password", psk,
        timeout=30,
    )


def hotspot_down() -> None:
    _nmcli("connection", "down", HOTSPOT_CONNECTION, timeout=15)
    _nmcli("connection", "delete", HOTSPOT_CONNECTION, timeout=15)


def connect_wifi(ssid: str, psk: str) -> tuple[bool, str]:
    """Try to join `ssid`. Returns (ok, message)."""
    args = ["device", "wifi", "connect", ssid, "ifname", WLAN_IFACE]
    if psk:
        args += ["password", psk]
    res = _nmcli(*args, timeout=45)
    if res.returncode == 0:
        return True, "Connected."
    return False, (res.stderr or res.stdout or "Connection failed").strip()


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
    # cage/Chromium points at the bootstrap page; restarting reloads it.
    try:
        subprocess.run([SYSTEMCTL, "restart", "chase-kiosk"], check=False, timeout=30)
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
        "display:flex;align-items:center;justify-content:center;height:100vh;margin:0'>"
        f"<h1>{_esc(msg)}</h1></body>"
    )


def provisioning_kiosk_page(ssid: str, psk: str, portal_url: str) -> str:
    """Kiosk-facing screen when there's no upstream network."""
    return (
        "<!doctype html><meta charset=utf-8><title>Set up WiFi</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "margin:0;padding:2rem;display:flex;flex-direction:column;"
        "align-items:center;justify-content:center;min-height:100vh;gap:1.5rem'>"
        "<h1 style='margin:0'>This display needs WiFi</h1>"
        "<p style='margin:0;opacity:.8;max-width:42rem;text-align:center'>"
        "Scan the left QR with your phone to join this display's setup network, "
        "then scan the right QR to open the captive portal and pick the venue WiFi.</p>"
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


def device_grant_page(verification_uri: str, user_code: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Pair CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;flex-direction:column;align-items:center;justify-content:center;"
        "height:100vh;margin:0;gap:1rem'>"
        "<h1>Sign this display in</h1>"
        "<p>Scan and sign in as the shared CHASE display account.</p>"
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
        "style='background:#1d232a'>"
        f"<form method=post action=\"{_esc(action)}\">"
        + field("accessToken", tokens.get("access_token"))
        + field("idToken", tokens.get("id_token"))
        + field("expiresIn", tokens.get("expires_in"))
        + field("deviceId", device_id)
        + "</form></body>"
    )


def portal_form_page(networks: list[dict], message: str = "") -> str:
    options = "".join(
        f"<option value=\"{_esc(n['ssid'])}\">"
        f"{_esc(n['ssid'])} ({n['signal']}%)"
        f"{' [open]' if not n['security'] else ''}</option>"
        for n in networks
    )
    if not options:
        options = "<option disabled>No networks visible — wait a few seconds and reload</option>"
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
        "<form method=post action=/connect>"
        "<label for=ssid>Network</label>"
        f"<select id=ssid name=ssid required>{options}</select>"
        "<label for=psk>Password</label>"
        "<input id=psk name=psk type=password autocomplete=off>"
        "<button type=submit>Connect</button>"
        "</form></body>"
    )


def portal_connecting_page(ssid: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Connecting…</title>"
        "<meta http-equiv=refresh content='8;url=/status'>"
        "<body style='font-family:sans-serif;max-width:32rem;margin:4rem auto;text-align:center'>"
        f"<h1>Joining {_esc(ssid)}…</h1>"
        "<p>The display will rejoin your venue's WiFi. You can close this page.</p>"
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
            # If main() consumed the pending creds, we either succeeded
            # (hotspot is gone, can't reach this page) or failed (error set).
            if PortalHandler.last_error:
                self._html(200, portal_form_page(self._scan_cached(), PortalHandler.last_error))
                PortalHandler.last_error = ""
            else:
                self._html(200, portal_success_page())
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
        psk = (form.get("psk", [""])[0] or "")
        if not ssid:
            PortalHandler.last_error = "Pick a network."
            self._redirect("/")
            return
        PortalHandler.pending = {"ssid": ssid, "psk": psk}
        _provision_event.set()
        self._html(200, portal_connecting_page(ssid))


def serve_portal() -> "socketserver.ThreadingTCPServer":
    server = socketserver.ThreadingTCPServer(("0.0.0.0", PROVISION_HTTP_PORT), PortalHandler)
    server.allow_reuse_address = True
    server.daemon_threads = True
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


def run_provisioning(state: dict, device_id: str) -> None:
    """Bring up the AP, show the dual-QR screen, wait for /connect success."""
    ssid, psk = hotspot_credentials(state, device_id)
    portal_url = f"http://{HOTSPOT_GATEWAY}/"

    make_qr(wifi_qr_payload(ssid, psk), QR_WIFI_PNG)
    make_qr(portal_url, QR_PORTAL_PNG)
    write_page(provisioning_kiosk_page(ssid, psk, portal_url))
    reload_kiosk()

    try:
        hotspot_up(ssid, psk)
    except Exception as e:
        print("chase-kiosk-helper: hotspot_up failed:", repr(e), flush=True)
        time.sleep(15)
        return

    portal_server = serve_portal()
    try:
        while True:
            _provision_event.wait(timeout=300)
            _provision_event.clear()
            pending = PortalHandler.pending
            PortalHandler.pending = None
            if not pending:
                continue
            # Tear the hotspot down BEFORE attempting the upstream connect,
            # otherwise the radio is busy in AP mode and nmcli will refuse.
            try:
                hotspot_down()
            except Exception:
                pass
            ok, msg = connect_wifi(pending["ssid"], pending["psk"])
            if ok and connectivity_ok():
                return
            PortalHandler.last_error = msg or "Could not connect — check the password."
            # Bring the hotspot back so the operator can retry.
            try:
                hotspot_up(ssid, psk)
            except Exception as e:
                print("chase-kiosk-helper: hotspot re-up failed:", repr(e), flush=True)
                time.sleep(10)
                return
    finally:
        try:
            portal_server.shutdown()
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


# --- Main loop --------------------------------------------------------------

def main() -> None:
    serve_bootstrap()

    state = load_state()
    device_id = state.get("device_id") or nanoid()
    state["device_id"] = device_id
    save_state(state)

    consecutive_failures = 0
    meta: dict | None = None

    while True:
        # 1. Make sure we have upstream connectivity.
        if not connectivity_ok():
            consecutive_failures += 1
            if consecutive_failures >= PROVISION_FAILURE_THRESHOLD:
                # Sustained loss → re-provision. forget_active_wifi() drops
                # the saved NM connection so the radio is free for AP mode.
                try:
                    forget_active_wifi()
                except Exception as e:
                    print("chase-kiosk-helper: forget_active_wifi:", repr(e), flush=True)
                run_provisioning(state, device_id)
                consecutive_failures = 0
                meta = None  # re-discover after a network change
                continue
            write_page(loading_page("Waiting for network…"))
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
        except Exception as e:
            # A failed refresh (revoked/expired) drops back to device grant.
            state.pop("refresh_token", None)
            save_state(state)
            write_page(loading_page("Reconnecting…"))
            print("chase-kiosk-helper:", repr(e), flush=True)
            time.sleep(10)


if __name__ == "__main__":
    main()
