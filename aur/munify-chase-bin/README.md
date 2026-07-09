# `munify-chase-bin` (AUR)

Repackages the `.deb` asset from each stable GitHub release into an Arch
Linux package. It doesn't build from source: the Tauri frontend build bakes
in production config (`PUBLIC_OIDC_AUTHORITY`, `PUBLIC_API_URL`, …) at build
time (see `.github/workflows/ci.yml`), so building on a user's machine
without those values would produce a broken app. Shipping the same binary
that CI already builds and signs is the standard approach for apps like
this — see e.g. `slack-desktop`, `discord`, `1password` on the AUR, which do
the same `.deb`/`.tar.gz`-repack trick instead of compiling from source.

**Status: manual only.** [AUR account registration is currently
suspended](https://archlinux.org/news/active-aur-malicious-packages-incident/)
following a security incident, so this isn't published to AUR yet and there's
no CI automation for it. Maintain `PKGBUILD`/`.SRCINFO` here by hand (see
below) until registration reopens and someone reserves the package name.

## Installing directly from this repo (no AUR account needed)

AUR is just a hosting/discovery layer for `PKGBUILD` files — `makepkg`
doesn't care where one comes from:

```bash
git clone https://github.com/DeutscheModelUnitedNations/munify-chase.git
cd munify-chase/aur/munify-chase-bin
makepkg -si   # requires the base-devel group
```

With an AUR helper (e.g. `yay`), point its local-build operation at the
directory instead of a package name — this still resolves dependencies and
registers the result with pacman like a normal AUR install:

```bash
git clone https://github.com/DeutscheModelUnitedNations/munify-chase.git
yay -Bi munify-chase/aur/munify-chase-bin   # paru: paru -Bi ...
```

Caveat: `pkgver`/`sha256sums` here are only bumped by hand when someone
updates this file — they reflect whatever was last updated, not necessarily
the latest GitHub release. If `pkgver` is behind the latest release tag,
update `pkgver` and `sha256sums` (or run `updpkgsums`) before `makepkg -si`,
or just open the release page and grab the matching `.deb` directly instead
of packaging it.

## Updating this PKGBUILD for a new release

```bash
cd aur/munify-chase-bin
sed -i 's/^pkgver=.*/pkgver=<new version>/' PKGBUILD
updpkgsums                      # refetches the .deb and recomputes sha256sums
makepkg --printsrcinfo > .SRCINFO
makepkg -si                     # sanity-check the build locally
```

Commit the updated `PKGBUILD`/`.SRCINFO` alongside the version bump.

## Publishing to AUR (once registration reopens)

1. Register an AUR account (https://aur.archlinux.org/register) and add an
   SSH public key under Account Settings → "My SSH Public Keys".
2. Reserve the package name and push this directory's contents:
   ```bash
   git clone ssh://aur@aur.archlinux.org/munify-chase-bin.git
   cd munify-chase-bin
   cp /path/to/this/aur/munify-chase-bin/{PKGBUILD,.SRCINFO} .
   git add PKGBUILD .SRCINFO
   git commit -m "Initial import"
   git push
   ```
3. From then on, repeat this push after each version bump (see above), or
   revisit automating it with something like
   [KSXGitHub/github-actions-deploy-aur](https://github.com/KSXGitHub/github-actions-deploy-aur)
   in a GitHub Actions workflow if maintaining it by hand becomes a burden.
