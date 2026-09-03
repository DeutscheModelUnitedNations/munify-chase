{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.services.chaseKiosk;
  helper = pkgs.writers.writePython3Bin "chase-kiosk-helper"
    {
      libraries = [ ];
      flakeIgnore = [ "E501" "E722" "W503" ];
    } (builtins.readFile ./chase-kiosk-helper.py);

  # Cage's own source (this pinned v0.2.0) actually does the right thing
  # already: it only draws a cursor when the Wayland seat has pointer
  # capability, and hides it (wlr_cursor_unset_image) otherwise. The bug
  # wasn't cage refusing to hide the cursor — it was our own assumption
  # about WLR_LIBINPUT_NO_DEVICES: per wlroots' own docs that variable only
  # "set[s] to 1 to not fail without any input devices" (a startup-failure
  # check), it does NOT stop libinput from detecting and using a real input
  # device if one exists — including ones the kernel synthesizes on its own
  # (e.g. from HDMI-CEC), which is exactly what cage-kiosk/cage#524
  # describes and recommends udev rules against. See the
  # `LIBINPUT_IGNORE_DEVICE` rule below — that's the actual fix; this
  # transparent Xcursor theme is kept only as a harmless second layer in
  # case some other, non-seat-capability code path (e.g. inside Chromium
  # itself) ever renders a cursor independent of that.
  transparentCursorTheme = pkgs.runCommand "chase-kiosk-transparent-cursor" {
    nativeBuildInputs = [ pkgs.xorg.xcursorgen ];
    passAsFile = [ "png64" ];
    # Smallest valid transparent PNG (1x1, alpha 0), base64-encoded.
    png64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  } ''
    mkdir -p $out/share/icons/transparent/cursors
    base64 -d "$png64Path" > cursor.png
    echo "1 0 0 cursor.png" > cursor.cfg
    xcursorgen cursor.cfg $out/share/icons/transparent/cursors/default
    for name in left_ptr left_ptr_watch pointer hand hand1 hand2 text xterm \
                wait watch progress crosshair arrow; do
      ln -s default "$out/share/icons/transparent/cursors/$name"
    done
    cat > $out/share/icons/transparent/index.theme <<THEME
[Icon Theme]
Name=transparent
Comment=Invisible cursor for kiosk mode
THEME
  '';
in
{
  options.services.chaseKiosk = {
    enable = lib.mkEnableOption "MUNify CHASE display kiosk";

    baseUrl = lib.mkOption {
      type = lib.types.str;
      example = "https://chase.example.org";
      description = "Public base URL of the CHASE instance.";
    };

    oidcAuthority = lib.mkOption {
      type = lib.types.str;
      description = "OIDC discovery URL (…/.well-known/openid-configuration).";
    };

    oidcClientId = lib.mkOption {
      type = lib.types.str;
      description = "OIDC client id of the shared display application.";
    };

    oidcScopes = lib.mkOption {
      type = lib.types.str;
      default = "openid profile email offline_access roles";
      description = "Scopes requested in the device grant. Must yield a refresh token and the roles claim.";
    };

    wlanInterface = lib.mkOption {
      type = lib.types.str;
      default = "wlan0";
      description = "WiFi interface used both for the upstream connection and the provisioning AP.";
    };

    provisionProbeUrl = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        URL the helper HEAD-probes to decide whether the upstream network
        works. Defaults to the OIDC authority (the most relevant target).
      '';
    };

    provisionFailureThreshold = lib.mkOption {
      type = lib.types.ints.positive;
      default = 6;
      description = "Consecutive probe failures (>0) before falling back to the AP/portal.";
    };

    provisionProbeIntervalSeconds = lib.mkOption {
      type = lib.types.ints.positive;
      default = 30;
      description = "Seconds between connectivity probes (>0).";
    };

    # Seconds before access-token expiry at which we refresh + re-seed the
    # browser session. Keep the Logto access-token TTL long (hours) so the
    # brief kiosk reload is rare.
    refreshMarginSeconds = lib.mkOption {
      type = lib.types.ints.positive;
      default = 120;
    };
  };

  config = lib.mkIf cfg.enable {
    # --- Network: NetworkManager owns the WiFi stack so the helper can
    # toggle between client mode and hotspot mode via `nmcli` (no D-Bus).
    # No SSID is baked into the image; provisioning happens at first boot.
    networking.networkmanager.enable = true;
    networking.wireless.enable = false;
    # "ap0" matches chase-kiosk-helper.py's AP_BRIDGE_IFACE default (not
    # exposed as its own option — it's an internal implementation detail,
    # only ever created transiently while bridging a captive portal). It
    # has to be trusted too, or the firewall silently drops the DHCP
    # exchange to a device joining that bridge network: WPA association
    # happens at layer 2 (802.11), invisible to an IP-layer firewall, so it
    # always succeeds regardless of this setting — only DHCP (UDP/IP, on
    # the new interface) actually gets blocked, which looks exactly like
    # "joins the network but never gets a working IP" on the client.
    networking.firewall.trustedInterfaces = [ cfg.wlanInterface "ap0" ];

    # This display has no keyboard/mouse, but the kernel can still present
    # libinput with an input device it never asked for — a monitor's
    # HDMI-CEC remote surfaced as a synthetic input device is the common
    # case (cage-kiosk/cage#524) — and if libinput reports pointer
    # capability, cage correctly shows a real cursor for it (not a bug,
    # see the comment on transparentCursorTheme above). WLR_LIBINPUT_NO_
    # DEVICES doesn't stop that; only telling libinput itself to ignore
    # every input-subsystem device does, which is also a reasonable
    # security stance on its own — a bystander plugging in a real USB
    # keyboard/mouse shouldn't be able to drive a public kiosk.
    services.udev.extraRules = ''
      SUBSYSTEM=="input", ENV{LIBINPUT_IGNORE_DEVICE}="1"
    '';

    # Lock Chromium down as hard as possible so nothing it ever grows —
    # today or in some future version — gets a chance to pop a bubble/prompt
    # over the display. Command-line switches (--disable-features=X, etc.)
    # are the wrong primary tool for this: as the Translate case below shows,
    # Chromium routinely re-derives UI heuristics from profile prefs
    # independent of the switch that supposedly turned the feature off.
    # Enterprise managed policy is the one mechanism Chromium documents as
    # authoritative — evaluated ahead of/independent of profile prefs and of
    # --incognito — so every prompt-shaped surface is disabled here instead,
    # not just Translate. See chromeenterprise.google/policies/ for each key.
    environment.etc."chromium/policies/managed/chase-kiosk.json".text = builtins.toJSON {
      TranslateEnabled = false;

      # Permission-prompt bubbles: deny every one outright (2 = block) rather
      # than leaving them on "ask", so a future site feature never gets a
      # chance to surface a request bubble in the first place.
      DefaultNotificationsSetting = 2;
      DefaultGeolocationSetting = 2;
      DefaultMediaStreamSetting = 2;
      DefaultSensorsSetting = 2;
      DefaultSerialGuardSetting = 2;
      DefaultWebUsbGuardSetting = 2;
      DefaultWebHidGuardSetting = 2;
      DefaultWebBluetoothGuardSetting = 2;
      DefaultFileSystemReadGuardSetting = 2;
      DefaultFileSystemWriteGuardSetting = 2;
      DefaultPopupsSetting = 2;
      DefaultInsecureContentSetting = 2;
      AudioCaptureAllowed = false;
      VideoCaptureAllowed = false;

      # This display's input devices are all disabled (see the udev rule
      # below), so Chromium can never see the user gesture its default
      # autoplay policy requires before letting a page's Web Audio API make
      # sound (the resolution-adoption "gong" — see AdoptionConfetti.svelte
      # — otherwise plays silently forever on kiosk). A wildcard rather than
      # an exact-origin pattern deliberately sidesteps the URL-pattern
      # scheme-matching bugs noted below (URLBlocklist/URLAllowlist) — this
      # Chromium only ever navigates between the local bootstrap page and
      # the CHASE origin anyway, so "everywhere" and "those two origins" are
      # equivalent in practice here.
      AutoplayAllowlist = [ "*" ];

      # Account/profile/sync surfaces: this Chromium is a single anonymous
      # kiosk session with no Google account, ever — deny sign-in so nothing
      # ever offers to sync, add a person, or switch to guest mode.
      BrowserSignin = 0;
      SyncDisabled = true;
      BrowserAddPersonEnabled = false;
      BrowserGuestModeEnabled = false;
      PasswordManagerEnabled = false;
      AutofillAddressEnabled = false;
      AutofillCreditCardEnabled = false;
      SpellcheckEnabled = false;
      SearchSuggestEnabled = false;
      AlternateErrorPagesEnabled = false;

      # First-run/update/default-browser nags — irrelevant on an appliance
      # that never sees a human pick Chromium, but each is its own bubble.
      DefaultBrowserSettingEnabled = false;
      MetricsReportingEnabled = false;
      BuiltInDnsClientEnabled = false;
      CommandLineFlagSecurityWarningsEnabled = false;

      # Downloads/extensions/devtools: this kiosk never needs to save a
      # file, install anything, or be debugged locally — block the actions
      # instead of just hiding their UI, so there's nothing left to prompt.
      DownloadRestrictions = 3;
      ExtensionInstallBlocklist = [ "*" ];
      DeveloperToolsAvailability = 2;
      SSLErrorOverrideAllowed = false;

      # A URLBlocklist/URLAllowlist pair restricting navigation to just the
      # local bootstrap page + the CHASE origin was tried here as extra
      # defense-in-depth, but caused two separate real outages: first a
      # missing-scheme pattern quirk blocked everything including the local
      # page, and after fixing that, the scheme-exact allowlist entry
      # (https://) still didn't cover the app's WebSocket subscription
      # traffic (wss://), silently blocking all GraphQL live-query/mutation
      # traffic with nothing reaching the backend to even log. Getting
      # Chromium's URL-filter scheme-matching exactly right isn't something
      # that can be verified without a real device to test against, and this
      # wasn't part of the actual ask (popups/prompts, handled by the
      # policies above) — removed rather than risk a third outage.
    };

    # --- Auto-login + Wayland kiosk (cage runs a single Chromium) ---------
    services.cage = {
      enable = true;
      user = "kiosk";
      # Chromium points at the LOCAL bootstrap page. The helper writes that
      # page; it auto-submits the OIDC tokens to CHASE (top-level navigation
      # so cookies land in Chromium's jar) and 303-redirects to /kiosk.
      program = "${pkgs.chromium}/bin/chromium "
        + "--kiosk --noerrdialogs --disable-infobars --incognito "
        + "--disable-session-crashed-bubble --check-for-update-interval=31536000 "
        # --disable-infobars doesn't cover it: Chromium moved the translate
        # prompt to its own bubble UI, not the (deprecated) infobar system.
        # The display serves multiple languages by design (per-device locale),
        # so Chrome's "this page isn't in your language" heuristic fires
        # constantly; disable the feature outright rather than the UI for it.
        + "--disable-features=Translate,TranslateUI "
        + "http://127.0.0.1:8081/";
    };
    services.cage.environment.WLR_LIBINPUT_NO_DEVICES = "1";
    services.cage.environment.XCURSOR_THEME = "transparent";
    services.cage.environment.XCURSOR_PATH = "${transparentCursorTheme}/share/icons";

    users.users.kiosk = {
      isNormalUser = true;
      group = "kiosk";
    };
    users.groups.kiosk = { };

    # Never blank the screen.
    services.cage.extraArguments = [ "-d" ];

    # --- Auth + provisioning + token refresh helper ----------------------
    # The helper drives WiFi (via nmcli), runs the captive portal on :80
    # when no network is reachable, then handles the OIDC device grant +
    # refresh loop. It owns network bring-up; no network-online ordering.
    systemd.services.chase-kiosk-auth = {
      description = "CHASE kiosk: WiFi provisioning, OIDC device grant + token refresh";
      wantedBy = [ "multi-user.target" ];
      after = [ "NetworkManager.service" ];
      wants = [ "NetworkManager.service" ];
      serviceConfig = {
        Type = "simple";
        ExecStart = "${helper}/bin/chase-kiosk-helper";
        Restart = "always";
        RestartSec = 5;
        # Pi-generated device id + refresh token + hotspot PSK live here.
        StateDirectory = "chase-kiosk";
        StateDirectoryMode = "0700";
        AmbientCapabilities = [ ];
      };
      environment = {
        CHASE_BASE_URL = cfg.baseUrl;
        OIDC_AUTHORITY = cfg.oidcAuthority;
        OIDC_CLIENT_ID = cfg.oidcClientId;
        OIDC_SCOPES = cfg.oidcScopes;
        STATE_DIR = "/var/lib/chase-kiosk";
        BOOTSTRAP_DIR = "/run/chase-kiosk";
        BOOTSTRAP_PORT = "8081";
        REFRESH_MARGIN = toString cfg.refreshMarginSeconds;
        WLAN_IFACE = cfg.wlanInterface;
        PROVISION_HTTP_PORT = "80";
        PROVISION_PROBE_URL = if cfg.provisionProbeUrl != null then cfg.provisionProbeUrl else cfg.oidcAuthority;
        PROVISION_FAILURE_THRESHOLD = toString cfg.provisionFailureThreshold;
        PROVISION_PROBE_INTERVAL = toString cfg.provisionProbeIntervalSeconds;
        QRENCODE = "${pkgs.qrencode}/bin/qrencode";
        NMCLI = "${pkgs.networkmanager}/bin/nmcli";
        SYSTEMCTL = "${pkgs.systemd}/bin/systemctl";
        IW = "${pkgs.iw}/bin/iw";
        IP = "${pkgs.iproute2}/bin/ip";
      };
    };

    # The helper needs to restart the kiosk unit to re-seed cookies.
    security.polkit.enable = true;

    # `iw` for AP capability probes; `iproute2` for the AP-bridge virtual
    # interface; `iptables` is pulled in by NM's hotspot NAT path;
    # `qrencode` for the WIFI: and portal-URL QRs.
    environment.systemPackages = [
      pkgs.chromium
      pkgs.qrencode
      pkgs.networkmanager
      pkgs.iw
      pkgs.iproute2
      pkgs.iptables
    ];

    # Headless appliance conveniences.
    documentation.enable = false;
  };
}
