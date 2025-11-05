use std::fs;
use std::path::Path;
use tauri::command;

#[command]
pub fn open_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}