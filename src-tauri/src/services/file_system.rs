use std::fs;
use std::io::{self, Read, Write};
use std::path::PathBuf;

pub struct FileSystemService;

impl FileSystemService {
    // List all files in a directory
    pub fn read_dir(path: &str) -> io::Result<Vec<String>> {
        let dir = PathBuf::from(path); // turn string into a path object
        if dir.is_dir() {
            let files = fs::read_dir(dir)? // read all directory entries
                .filter_map(|entry| entry.ok())
                .map(|entry| entry.file_name().to_string_lossy().into_owned()) // file names as strings
                .collect();
            Ok(files)
        } else {
            Ok(vec![]) // not a directory — return empty list
        }
    }

    // Read an entire file into a string
    pub fn read_file(path: &str) -> io::Result<String> {
        fs::read_to_string(path)
    }

    // Write a string into a file
    pub fn write_file(path: &str, content: &str) -> io::Result<()> {
        let mut file = fs::File::create(path)?;
        file.write_all(content.as_bytes())?;
        Ok(())
    }

    // Check if a path exists
    pub fn exists(path: &str) -> bool {
        PathBuf::from(path).exists()
    }
}
