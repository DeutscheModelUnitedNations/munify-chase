use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // WebKitGTK's DMABuf renderer fails with EGL_BAD_PARAMETER on Wayland
    // (especially NVIDIA) — see https://github.com/tauri-apps/tauri/issues/9394.
    // The AppImage GTK hook additionally forces GDK_BACKEND=x11, under which
    // EGL must not keep probing the Wayland platform. Both must be set before
    // WebKit initializes, hence here instead of a post-build AppImage patch
    // (which would also invalidate the updater signature).
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        if std::env::var("GDK_BACKEND").as_deref() == Ok("x11") {
            std::env::remove_var("WAYLAND_DISPLAY");
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {}))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
