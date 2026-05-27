use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
fn open_presentation_window(app: tauri::AppHandle, url: String) -> Result<(), String> {
    if let Some(existing) = app.get_webview_window("presentation") {
        existing.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }
    let webview_url = url.parse::<tauri::Url>()
        .map(WebviewUrl::External)
        .unwrap_or_else(|_| WebviewUrl::App(url.into()));
    WebviewWindowBuilder::new(&app, "presentation", webview_url)
        .title("CHASE – Presentation")
        .inner_size(1280.0, 800.0)
        .resizable(true)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![open_presentation_window])
        .setup(|app| {
            let win = app.get_webview_window("main").unwrap();
            win.open_devtools();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
