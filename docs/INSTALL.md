# Installing MUNify CHASE

Download the latest installer for your platform from the
[**Releases page**](https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest).

> **Note on security warnings:** the desktop app is currently distributed
> **unsigned** (no paid Apple/Windows code-signing certificate). The app is
> safe, but your operating system will show a warning the first time you open
> it. The steps below explain how to get past it. After the first launch,
> built-in **automatic updates** keep the app current without any further
> warnings.

---

## macOS

1. Download the `.dmg` and open it.
2. Drag **munify-chase** into your **Applications** folder.
3. **First launch only:** right-click (or Control-click) the app in Applications
   and choose **Open**, then confirm **Open** in the dialog. Using right-click →
   Open (instead of double-clicking) is what lets you bypass Gatekeeper for an
   unsigned app.
4. If you instead see **"munify-chase is damaged and can't be opened"**, macOS
   has quarantined the download. Remove the quarantine flag by running this once
   in **Terminal**:

   ```sh
   xattr -dr com.apple.quarantine /Applications/munify-chase.app
   ```

   Then open the app normally.

Future updates are downloaded and applied automatically by the app and launch
**without** any Gatekeeper prompt.

---

## Windows

1. Download the `.exe` installer and run it.
2. Windows SmartScreen may show **"Windows protected your PC."** Click
   **More info**, then **Run anyway**.
3. The installer runs **per-user** (no administrator prompt). If
   [Microsoft Edge WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)
   isn't already installed (it ships with Windows 11 and most Windows 10
   machines), the installer downloads it automatically — this needs an internet
   connection during install.

Future updates are downloaded and applied automatically by the app.

---

## Linux

Pick the package that matches your system:

- **AppImage** (portable, any distro): make it executable, then run it.

  ```sh
  chmod +x munify-chase_*_amd64.AppImage
  ./munify-chase_*_amd64.AppImage
  ```

- **Debian / Ubuntu** (`.deb`):

  ```sh
  sudo apt install ./munify-chase_*_amd64.deb
  ```

- **Fedora / RHEL** (`.rpm`):

  ```sh
  sudo dnf install ./munify-chase-*.x86_64.rpm
  ```

The AppImage is self-contained and includes the workarounds needed for the
embedded web view to run across different distributions.

---

## A note on signing in

Logging in opens your system browser to authenticate, then hands you back to the
app through the `munify-chase://` link. This only works when the app is
**installed** through one of the installers above — the link handler is
registered during installation. Running a loose, un-installed binary will open
the browser but won't be able to complete the login.
