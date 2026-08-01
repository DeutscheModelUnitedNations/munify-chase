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
    networking.firewall.trustedInterfaces = [ cfg.wlanInterface ];

    # Belt-and-suspenders against the Translate bubble: `--disable-features=
    # Translate,TranslateUI` alone kept resurfacing it, because recent
    # Chromium re-derives the "offer to translate" heuristic from the
    # profile's translate prefs regardless of that switch. The managed
    # policy is the one mechanism Chromium documents as authoritative here
    # (enterprise policy, evaluated before/independent of profile prefs and
    # of --incognito) — see chromeenterprise.google/policies/#TranslateEnabled.
    environment.etc."chromium/policies/managed/chase-kiosk.json".text = builtins.toJSON {
      TranslateEnabled = false;
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
      };
    };

    # The helper needs to restart the kiosk unit to re-seed cookies.
    security.polkit.enable = true;

    # `iw` for AP capability probes; `iptables` is pulled in by NM's hotspot
    # NAT path; `qrencode` for the WIFI: and portal-URL QRs.
    environment.systemPackages = [
      pkgs.chromium
      pkgs.qrencode
      pkgs.networkmanager
      pkgs.iw
      pkgs.iptables
    ];

    # Headless appliance conveniences.
    documentation.enable = false;
  };
}
