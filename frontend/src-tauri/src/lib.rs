// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod features;
mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init());
    features::register_all(builder)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
