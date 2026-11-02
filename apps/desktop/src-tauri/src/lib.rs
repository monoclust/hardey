use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{Manager, WindowEvent};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

#[derive(Debug, Serialize, Deserialize)]
struct SavedPosition {
    x: i32,
    y: i32,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .setup(|app| {
            // Sprint 1: register HARDEY to launch at macOS login.
            // A user-facing toggle will be added with the preferences workspace.
            #[cfg(target_os = "macos")]
            app.autolaunch().enable()?;

            // Restore the floating orb's last known desktop position.
            let config_dir = app.path().app_config_dir()?;
            fs::create_dir_all(&config_dir)?;
            let position_file = config_dir.join("orb-position.json");
            if let Ok(contents) = fs::read_to_string(&position_file) {
                if let Ok(saved) = serde_json::from_str::<SavedPosition>(&contents) {
                    if let Some(orb) = app.get_webview_window("orb") {
                        let _ = orb.set_position(tauri::PhysicalPosition::new(saved.x, saved.y));
                    }
                }
            }

            // Persist movement without coupling the React UI to a storage mechanism.
            if let Some(orb) = app.get_webview_window("orb") {
                let position_file = position_file.clone();
                orb.on_window_event(move |event| {
                    if let WindowEvent::Moved(position) = event {
                        let saved = SavedPosition { x: position.x, y: position.y };
                        if let Ok(contents) = serde_json::to_vec(&saved) {
                            let _ = fs::write(&position_file, contents);
                        }
                    }
                });
            }

            Ok(())
        })
        // Closing the workspace should hide it, not terminate HARDEY or the orb.
        .on_window_event(|window, event| {
            if window.label() == "workspace" {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running HARDEY desktop application");
}
