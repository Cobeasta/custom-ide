use crate::services::file_system::FileSystemService;
use std::sync::mpsc::channel;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

use tauri::Manager;

/// Opens a native folder picker dialog and returns the selected path.
/// Opens a native folder picker dialog and returns the selected path.


/// Lists files in the given folder path.
#[tauri::command]
pub fn list_folder_files(path: String) -> Vec<String> {
    FileSystemService::read_dir(&path).unwrap_or_default()
}
