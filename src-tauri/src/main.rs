// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    linux_preflight();

    munify_chase_lib::run()
}

/// Re-exec the binary with the env vars required to prevent GTK/WebKit EGL crashes on Linux.
///
/// The crash (`Could not create default EGL display: EGL_BAD_PARAMETER`) is caused by the
/// AppImage's bundled libwayland-client conflicting with the system EGL stack. It must be fixed
/// via LD_PRELOAD before the dynamic linker loads the bundled copy.  Setting env vars in lib.rs
/// is too late for that — it only affects child processes spawned after init.  Re-execing here
/// (before Tauri/GTK touches anything) is the correct fix.
///
/// See: https://github.com/tauri-apps/tauri/issues/9394
#[cfg(target_os = "linux")]
fn linux_preflight() {
    const SENTINEL: &str = "CHASE_LINUX_PREFLIGHT_DONE";
    if std::env::var(SENTINEL).is_ok() {
        return;
    }

    use std::os::unix::process::CommandExt;

    let exe = match std::env::current_exe() {
        Ok(p) => p,
        Err(_) => return, // can't re-exec, proceed and hope for the best
    };

    let mut cmd = std::process::Command::new(&exe);
    cmd.args(std::env::args_os().skip(1));
    cmd.env(SENTINEL, "1");
    cmd.env("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    cmd.env("WEBKIT_DISABLE_COMPOSITING_MODE", "1");

    // Preload the system libwayland-client to override the AppImage's bundled copy,
    // which conflicts with the system EGL stack on Wayland compositors.
    let wayland_lib_candidates = [
        "/usr/lib/x86_64-linux-gnu/libwayland-client.so.0", // Debian/Ubuntu
        "/usr/lib64/libwayland-client.so.0",                // Fedora/Arch (64-bit)
        "/usr/lib/libwayland-client.so.0",                  // fallback
    ];
    if let Some(path) = wayland_lib_candidates
        .iter()
        .find(|p| std::path::Path::new(p).exists())
    {
        let existing = std::env::var("LD_PRELOAD").unwrap_or_default();
        let preload = if existing.is_empty() {
            path.to_string()
        } else {
            format!("{path}:{existing}")
        };
        cmd.env("LD_PRELOAD", preload);
    }

    // exec() replaces the current process — only returns on error
    let err = cmd.exec();
    eprintln!("linux preflight re-exec failed: {err}");
}
