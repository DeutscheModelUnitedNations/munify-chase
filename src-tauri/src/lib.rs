use tauri::{Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

/// Opens a URL in the system browser with a clean environment.
///
/// The AppImage launcher (linuxdeploy's AppRun) sets LD_LIBRARY_PATH and LD_PRELOAD to
/// point at the bundled Ubuntu libraries so the app runs. But when those leak into a
/// spawned system process — e.g. xdg-open -> flatpak (a Flatpak browser) — flatpak loads
/// the AppImage's old GLib instead of the host's and dies with a symbol lookup error
/// (e.g. missing g_once_init_leave_pointer on Arch). The GTK/GIO_* vars point at bundled
/// modules and cause similar mismatches. Stripping all of them gives the subprocess a
/// pristine host environment.
#[tauri::command]
fn open_url_external(url: String) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&url)
            .env_remove("LD_LIBRARY_PATH")
            .env_remove("LD_PRELOAD")
            .env_remove("GIO_EXTRA_MODULES")
            .env_remove("GTK_PATH")
            .env_remove("GTK_DATA_PREFIX")
            .env_remove("GTK_EXE_PREFIX")
            .env_remove("GTK_IM_MODULE_FILE")
            .env_remove("GDK_PIXBUF_MODULE_FILE")
            .env_remove("GSETTINGS_SCHEMA_DIR")
            .spawn()
            .map(|_| ())
            .map_err(|e| format!("xdg-open failed: {e}"))
    }
    #[cfg(not(target_os = "linux"))]
    {
        Err("open_url_external is Linux-only; use the opener plugin on other platforms".into())
    }
}

#[tauri::command]
fn open_presentation_window(app: tauri::AppHandle, path: String) -> tauri::Result<()> {
    match app.webview_windows().get("presentation") {
        Some(window) => {
            window.set_focus()?;
        }
        None => {
            WebviewWindowBuilder::new(&app, "presentation", WebviewUrl::App(path.into()))
                .title("CHASE – Presentation")
                .inner_size(1280.0, 800.0)
                .resizable(true)
                .build()?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // WebKit2GTK on Linux fails to create an EGL display on systems without
    // proper GPU drivers, causing a segfault. Disabling the DMA-BUF renderer
    // forces software fallback and avoids the crash.
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            // Forward any deep-link URI to the frontend so the OIDC callback
            // can be processed in the already-running instance.
            let _ = app.emit("deep-link-callback", argv);
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![open_presentation_window, open_url_external])
        .setup(|_app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
