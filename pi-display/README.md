# MUNify CHASE — Pi display appliance

A headless Raspberry Pi 4 that boots straight into a full-screen, read-only
committee grid for the conference/committee it is assigned to. No keyboard,
no mouse, no per-device configuration in the image.

## How it works

1. **WiFi provisioning** (only when there's no upstream network) — the Pi
   brings up its own AP (`CHASE-Display-XXXX`, per-device PSK) and shows
   two QRs on screen:
   - **QR W** is a `WIFI:` payload: the operator's phone joins the AP in
     one tap.
   - **QR P** is the captive-portal URL (`http://10.42.0.1/`): the
     operator picks the venue's WiFi from a dropdown, enters the PSK,
     and the Pi connects. The captive-portal sheet usually auto-opens
     after joining; QR P is the fallback if it doesn't.
2. **OIDC sign-in** — the `chase-kiosk-auth` service runs the OAuth 2.0
   Device Authorization Grant against the kiosk's own Logto Application.
   Chromium shows **QR #1** (the Logto verification URL). Any team member
   scans it and signs in with their **own** CHASE credentials — there's no
   shared display account to manage or leak. CHASE tells device-flow
   sessions apart from normal browser logins by _how_ they authenticated
   (which Logto Application issued the token), not by who the person is,
   and forces every one of them read-only regardless of that person's real
   role — see the security note on `kioskOIDCHandle` in
   `src/api/services/kioskOIDC.ts` for the mechanism and why it can't grant
   more access than a plain browser login would.
3. The helper stores the refresh token + a Pi-generated device id under
   `/var/lib/chase-kiosk` (root-only), exchanges tokens for a CHASE
   session, and Chromium moves to `/kiosk`.
4. `/kiosk` shows **QR #2** (pairing) until an organizer assigns the
   device under **`/app/displays`** in CHASE (conference + optional
   committee). Then it renders the live grid.
5. Re-assignment and revocation propagate live (GraphQL liveQuery); no
   reboot. Subsequent boots skip QRs W/P (saved WiFi) and QR #1 (stored
   refresh token), going straight to pairing or the grid.

If the venue WiFi drops for more than ~3 minutes (configurable), the Pi
**auto-falls-back** to the AP/portal screen so the operator can switch
networks without SSH or a reflash. The OIDC session (refresh token on
disk) is preserved across the switch.

**Wired (Ethernet) works with no extra setup.** `module.nix` only enables
NetworkManager (`networking.networkmanager.enable = true`) and never
excludes `eth0` or any other interface from it, so a plugged-in cable gets
NM's default managed-wired-device behavior: an auto-created DHCP profile
that activates on its own. The helper's `connectivity_ok()` probe is a
plain HTTP HEAD to the OIDC authority — it doesn't care which interface
carries the route. So on a Pi with a live Ethernet cable, `connectivity_ok()`
succeeds before the failure-threshold in the main loop is ever reached, the
AP/portal WiFi flow never triggers, and the device goes straight to the
OIDC device-grant screen. Unplugging Ethernet later falls back to the
WiFi AP/portal screen the same way a WiFi drop would.

**Venue captive portals** (hotel/conference-center WiFi that needs its own
browser sign-in before granting internet access): the Pi detects this case
after joining and, if its WiFi chip supports running as an access point and
a client at once (`iw list`'s "valid interface combinations"; most Pi 4/5
onboard chips do), automatically brings up a _second_ AP so the operator can
rejoin from their phone and complete the venue's sign-in — the venue network
never sees the Pi drop its connection while this happens. On hardware that
can't do this, or if the sign-in isn't completed within a few minutes, the
display falls back to suggesting either joining through a travel
router/hotspot instead (recommended — it absorbs the portal for everything
behind it) or asking venue IT to whitelist the Pi's WiFi MAC address, shown
on screen.

The Pi never receives the refresh token back from CHASE — Logto rotates
refresh tokens on use, so the helper stays the sole owner and re-seeds the
browser session (via a top-level form POST to `/api/kiosk/session`) before
the access token expires.

## Logto / OIDC prerequisites

- Create a **separate Logto Application** for the kiosk (distinct client id
  from `PUBLIC_OIDC_CLIENT_ID`, the normal web app's) and enable **only the
  Device flow** on it — no Authorization Code / implicit grant. This is a
  real security requirement, not just tidiness: CHASE tells a device-flow
  session apart from a normal login purely by _which application's token it
  is_ (`OIDC_KIOSK_TRUSTED_AUDIENCES`), so if this Application could also be
  used for a normal interactive login, a token obtained that way would still
  be read-only-forced (this can only ever narrow access, never grant extra),
  but it would defeat the "how did this session authenticate" signal being
  meaningful — keep Device flow as the only enabled grant so that signal
  stays reliable.
- Any staff account can sign in through it — no dedicated display account
  or role to provision or rotate.
- Set `OIDC_KIOSK_TRUSTED_AUDIENCES` (CHASE's server env) to this
  Application's client id (and/or a Logto default API resource identifier,
  comma-separated).
- Recommended: a **long access-token TTL** (hours). The kiosk briefly
  reloads when it re-seeds the session each token period; a long TTL makes
  that rare.

## Build & flash

```bash
cd pi-display
./build-image.sh        # prompts CHASE base URL + OIDC client only
# flash result/sd-image/*.img.zst to the SD card
```

WiFi is **not** baked into the image — every Pi self-provisions at first
boot. `local.nix` (URLs only) is generated by the builder and is
**gitignored**.

## Operating

- **Assign / rename / revoke**: CHASE → `/app/displays`. Global admins see
  every device, including unassigned ones, and can (re)assign or unassign
  any of them. Whoever provisioned a device (signed it in via the device
  flow, QR #1) can also claim it themselves, once, for one of their own
  ADMIN/TEAM conferences — the pairing QR (QR #2) links straight to
  `/app/displays?focus=<id>` for exactly this. Conference admins/team
  members otherwise see and manage only devices already assigned to their
  conference; only global admins can reassign or unassign an already-claimed
  device.
- **Revoke a lost/stolen Pi**: toggle _Revoke_ on its row. The device
  immediately falls back to the revoked screen and can read nothing — but
  keeps its stored refresh token, so restoring it later needs no re-pairing.
- **Permanently retire a Pi**: _Revoke_, then _Delete_ (deletion is only
  ever reachable on an already-revoked device). Unlike revoking alone,
  deletion is a signal the Pi's own helper actively watches for (it polls
  `/api/kiosk/status` on the same cadence as its connectivity checks): the
  moment it sees its row is gone rather than just revoked, it drops its
  locally-stored refresh token and falls back to a fresh device-authorization
  grant (QR #1). It keeps the same device id, so it lands right back on the
  same (still-revoked) row rather than re-pairing as a "new" device — an
  admin still has to explicitly restore it. This means a stolen Pi's old
  refresh token stops being usable the moment it's actually deleted, not
  just hidden from CHASE's own UI.
- **Switch venue WiFi**: do nothing — pull the upstream network and the
  Pi drops back to the AP/portal automatically after ~3 minutes; pick the
  new SSID from the dropdown. The CHASE session survives.
- **Compromised sign-in**: if whoever's credentials were used to provision a
  Pi need to be revoked, rotate/disable that person's Logto credentials (or
  just _Revoke_-then-_Delete_ the device — that forces its stored refresh
  token to stop working, no Logto change needed). There's no shared secret
  to rotate application-wide.

## Security note (physical access)

The refresh token, device id, and per-device hotspot PSK are stored
unencrypted in `/var/lib/chase-kiosk` (Pi 4 has no TPM/secure element). A
stolen Pi exposes a refresh token bound to whichever staff member's account
signed it in — but that token is only ever usable read-only: CHASE forces
every device-flow session down the same kiosk-scoped, read-only path
regardless of the underlying account's real role (see the security note on
`kioskOIDCHandle`), so it can't be used to reach that person's normal
admin/team access even if they hold it. It also exposes the device's own
hotspot PSK (only used briefly during re-provisioning). Mitigations:
_Revoke_ stops it reading anything immediately; _Revoke_-then-_Delete_ goes
further and makes the stolen refresh token itself stop working (the
helper's status poll notices and drops it — see "Permanently retire a Pi"
above), without waiting on or needing a Logto-side change; and, as a
last resort, rotating the provisioning person's Logto credentials directly.
Treat physical access to venue displays accordingly.
