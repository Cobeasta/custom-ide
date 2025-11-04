pub mod explorer;
pub use explorer::*;
pub fn register_all<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    let builder = explorer::register_handlers(builder);
    builder
}
