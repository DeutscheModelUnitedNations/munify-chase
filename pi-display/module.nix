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

    wifiSsid = lib.mkOption {
      type = lib.types.str;
      description = "WiFi SSID.";
    };

    wifiPsk = lib.mkOption {
      type = lib.types.str;
      description = "WiFi pre-shared key. Baked into the image (no secret store on Pi 4).";
    };

    # Seconds before access-token expiry at which we refresh + re-seed the
    # browser session. Keep the Logto access-token TTL long (hours) so the
    # brief kiosk reload is rare.
    refreshMarginSeconds = lib.mkOption {
      type = lib.types.int;
      default = 120;
    };
  };

  config = lib.mkIf cfg.enable {
    # --- Network (baked WiFi; no input devices on the appliance) ----------
    networking.wireless = {
      enable = true;
      networks.${cfg.wifiSsid}.psk = cfg.wifiPsk;
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

    # --- Auth + token refresh helper -------------------------------------
    systemd.services.chase-kiosk-auth = {
      description = "CHASE kiosk: OIDC device grant + token refresh";
      wantedBy = [ "multi-user.target" ];
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      serviceConfig = {
        Type = "simple";
        ExecStart = "${helper}/bin/chase-kiosk-helper";
        Restart = "always";
        RestartSec = 5;
        # Pi-generated device id + refresh token live here, root-only.
        StateDirectory = "chase-kiosk";
        StateDirectoryMode = "0700";
        # Helper restarts the kiosk to re-seed the session before expiry.
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
        QRENCODE = "${pkgs.qrencode}/bin/qrencode";
        SYSTEMCTL = "${pkgs.systemd}/bin/systemctl";
      };
    };

    # The helper needs to restart the kiosk unit to re-seed cookies.
    security.polkit.enable = true;

    environment.systemPackages = [ pkgs.chromium pkgs.qrencode ];

    # Headless appliance conveniences.
    services.openssh.enable = lib.mkDefault true;
    documentation.enable = false;
  };
}
