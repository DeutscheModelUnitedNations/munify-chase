"""MUNify CHASE Pi display helper.

Runs the OAuth 2.0 Device Authorization Grant on first boot, then a refresh
loop. It NEVER hands the refresh token to CHASE (Logto rotates it on use);
instead it serves a tiny local page that a top-level browser navigation
auto-submits to /api/kiosk/session so the auth cookies land in Chromium.

stdlib only + the `qrencode` CLI. No secrets in the repo; the device id and
refresh token are persisted root-only under STATE_DIR.
"""

import http.server
import json
import os
import secrets
import socketserver
import subprocess
import threading
import time
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
QRENCODE = os.environ.get("QRENCODE", "qrencode")
SYSTEMCTL = os.environ.get("SYSTEMCTL", "systemctl")

STATE_FILE = os.path.join(STATE_DIR, "state.json")
INDEX = os.path.join(BOOTSTRAP_DIR, "index.html")
QR_PNG = os.path.join(BOOTSTRAP_DIR, "qr.png")

# Matches src/lib/helpers/nanoid.ts (nolookalikes-safe, 30 chars).
NANOID_ALPHABET = "6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz"


def nanoid() -> str:
    return "".join(secrets.choice(NANOID_ALPHABET) for _ in range(30))


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


def make_qr(text: str) -> None:
    subprocess.run([QRENCODE, "-o", QR_PNG, "-s", "8", "-m", "2", text], check=True)


def loading_page(msg: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8>"
        "<title>CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;align-items:center;justify-content:center;height:100vh;margin:0'>"
        f"<h1>{msg}</h1></body>"
    )


def device_grant_page(verification_uri: str, user_code: str) -> str:
    return (
        "<!doctype html><meta charset=utf-8><title>Pair CHASE display</title>"
        "<body style='font-family:sans-serif;background:#1d232a;color:#fff;"
        "display:flex;flex-direction:column;align-items:center;justify-content:center;"
        "height:100vh;margin:0;gap:1rem'>"
        "<h1>Sign this display in</h1>"
        "<p>Scan and sign in as the shared CHASE display account.</p>"
        "<img src='qr.png' style='width:420px;height:420px;background:#fff;"
        "padding:1rem;border-radius:1rem'>"
        f"<p>{verification_uri}</p>"
        f"<p style='font-size:2rem;font-weight:bold;letter-spacing:.2em'>{user_code}</p>"
        # The device-grant poll can take a while; refresh keeps the page live.
        "<script>setTimeout(()=>location.reload(),10000)</script>"
        "</body>"
    )


def session_page(tokens: dict, device_id: str) -> str:
    # Auto-submitting form: a top-level POST so Set-Cookie lands in Chromium.
    def field(name, value):
        if value is None:
            return ""
        v = str(value).replace("&", "&amp;").replace('"', "&quot;")
        return f"<input type=hidden name={name} value=\"{v}\">"

    action = f"{BASE_URL}/api/kiosk/session"
    return (
        "<!doctype html><meta charset=utf-8><title>CHASE display</title>"
        "<body onload='document.forms[0].submit()' "
        "style='background:#1d232a'>"
        f"<form method=post action=\"{action}\">"
        + field("accessToken", tokens.get("access_token"))
        + field("idToken", tokens.get("id_token"))
        + field("expiresIn", tokens.get("expires_in"))
        + field("deviceId", device_id)
        + "</form></body>"
    )


def serve_bootstrap() -> None:
    os.makedirs(BOOTSTRAP_DIR, exist_ok=True)
    write_page(loading_page("Starting…"))

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=BOOTSTRAP_DIR, **kw)

        def log_message(self, *a):
            pass

    httpd = socketserver.TCPServer(("127.0.0.1", BOOTSTRAP_PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()


def device_authorization(meta: dict, device_id: str) -> dict:
    da_endpoint = meta["device_authorization_endpoint"]
    token_endpoint = meta["token_endpoint"]

    resp = http_post_form(da_endpoint, {"client_id": CLIENT_ID, "scope": SCOPES})
    verification = resp.get("verification_uri_complete") or resp["verification_uri"]
    make_qr(verification)
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


def main() -> None:
    serve_bootstrap()
    meta = discover()

    state = load_state()
    device_id = state.get("device_id") or nanoid()
    state["device_id"] = device_id
    save_state(state)

    while True:
        try:
            if not state.get("refresh_token"):
                tokens = device_authorization(meta, device_id)
            else:
                tokens = refresh(meta, state["refresh_token"])

            # Persist the (possibly rotated) refresh token immediately.
            if tokens.get("refresh_token"):
                state["refresh_token"] = tokens["refresh_token"]
                save_state(state)

            write_page(session_page(tokens, device_id))
            reload_kiosk()

            expires_in = int(tokens.get("expires_in", 3600))
            time.sleep(max(30, expires_in - REFRESH_MARGIN))
        except Exception as e:
            # A failed refresh (revoked/expired) drops back to device grant.
            state.pop("refresh_token", None)
            save_state(state)
            write_page(loading_page("Reconnecting…"))
            print("chase-kiosk-helper:", repr(e), flush=True)
            time.sleep(10)


if __name__ == "__main__":
    main()
