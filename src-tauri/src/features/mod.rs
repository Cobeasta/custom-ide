pub mod explorer {
    pub mod commands;
}
pub mod editor {
    pub mod commands;
}
pub fn register_all<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    builder.invoke_handler(tauri::generate_handler![
        explorer::commands::read_project_dir,
        editor::commands::open_file,
        editor::commands::save_file
    ])
}
