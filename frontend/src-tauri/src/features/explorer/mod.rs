pub mod commands;
pub use commands::*;

pub fn register_handlers<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    builder.invoke_handler(tauri::generate_handler![
        list_folder_files
    ])
}
