// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // WebKitGTK's DMA-BUF renderer is unreliable on some Linux GPU/driver
    // combinations (notably NVIDIA and many Wayland setups), causing blank
    // windows. Disabling it forces a stable rendering path. This is the
    // workaround recommended by Tauri (tauri-apps/tauri#9394). Set before the
    // webview is created; harmless on systems that don't need it.
    #[cfg(target_os = "linux")]
    // SAFETY: called at the very start of main, before any threads are spawned.
    unsafe {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    munify_chase_lib::run()
}
