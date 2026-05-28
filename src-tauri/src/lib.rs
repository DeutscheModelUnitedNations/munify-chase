use tauri::{Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

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
        .invoke_handler(tauri::generate_handler![open_presentation_window])
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
