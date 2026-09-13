{
  description = "MUNify CHASE Pi display appliance — headless kiosk SD image";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "aarch64-linux";
    in
    {
      nixosModules.chase-kiosk = import ./module.nix;

      # Build with:
      #   ./build-image.sh        (guided: prompts WiFi + base URL)
      # or directly:
      #   nix build .#nixosConfigurations.chase-kiosk.config.system.build.sdImage \
      #     --impure   # reads ./local.nix written by build-image.sh
      nixosConfigurations.chase-kiosk = nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          "${nixpkgs}/nixos/modules/installer/sd-card/sd-image-aarch64.nix"
          self.nixosModules.chase-kiosk
          (
            { ... }:
            {
              # local.nix is written by build-image.sh and is gitignored.
              # It only contains WiFi SSID/PSK + the prod CHASE base URL.
              imports = [ ./local.nix ];
              nixpkgs.hostPlatform = system;
              system.stateVersion = "24.11";
            }
          )
        ];
      };
    };
}
