use tauri::command;
use atomicwrites::{AtomicFile, OverwriteBehavior};
use std::io::Write;

#[command]
pub fn open_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}
#[command]
pub fn save_file(path: String, content: String) -> Result<(), String> {
    let af = AtomicFile::new(path, OverwriteBehavior::AllowOverwrite);
    af.write(|f| f.write_all(content.as_bytes())).map_err(|e| e.to_string())
}