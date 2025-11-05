use std::fs;
use std::path::Path;
use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
pub struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
}

#[command]
pub fn read_project_dir(path: String) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();

    for entry in fs::read_dir(&path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_type = entry.file_type().map_err(|e| e.to_string())?;
        entries.push(FileEntry {
            name: entry.file_name().to_string_lossy().into_owned(),
            path: entry.path().to_string_lossy().into_owned(),
            is_dir: file_type.is_dir(),
        });
    }

    Ok(entries)
}
