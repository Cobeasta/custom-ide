use tauri::api::dialog::FileDialogBuilder;
use crate::services::file_system::FileSystemService;

/// Opens a native folder picker dialog and returns the selected path.
#[tauri::command]
pub async fn open_folder_dialog() -> Option<String> {
    use std::sync::mpsc::channel;

    let (tx, rx) = channel();
    FileDialogBuilder::new().pick_folder(move |folder_path| {
        let _ = tx.send(folder_path.map(|p| p.display().to_string()));
    });

    rx.recv().unwrap_or(None)
}

/// Lists the files in the given folder using FileSystemService.
#[tauri::command]
pub fn list_folder_files(path: String) -> Vec<String> {
    FileSystemService::read_dir(&path).unwrap_or_default()
}
