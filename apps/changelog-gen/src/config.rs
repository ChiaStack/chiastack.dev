use serde::{Deserialize, Serialize};
use anyhow::Result;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub types: HashMap<String, TypeConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TypeConfig {
    pub display_name: String,
    pub priority: usize,
    pub include: bool,
}

impl Config {
    pub fn from_file(path: &str) -> Result<Self> {
        let content = std::fs::read_to_string(path)?;
        let config: Config = toml::from_str(&content)?;
        Ok(config)
    }

    pub fn get_type_display_name<'a>(&'a self, type_key: &'a str) -> &'a str {
        self.types
            .get(type_key)
            .map(|t| t.display_name.as_str())
            .unwrap_or(type_key)
    }

    pub fn get_type_priority(&self, type_key: &str) -> usize {
        self.types
            .get(type_key)
            .map(|t| t.priority)
            .unwrap_or(999)
    }
}

impl Default for Config {
    fn default() -> Self {
        let mut types = HashMap::new();

        types.insert("feat".to_string(), TypeConfig {
            display_name: "✨ Features".to_string(),
            priority: 1,
            include: true,
        });

        types.insert("fix".to_string(), TypeConfig {
            display_name: "🐛 Bug Fixes".to_string(),
            priority: 2,
            include: true,
        });

        types.insert("perf".to_string(), TypeConfig {
            display_name: "⚡ Performance Improvements".to_string(),
            priority: 3,
            include: true,
        });

        types.insert("docs".to_string(), TypeConfig {
            display_name: "📝 Documentation".to_string(),
            priority: 4,
            include: true,
        });

        types.insert("refactor".to_string(), TypeConfig {
            display_name: "♻️ Code Refactoring".to_string(),
            priority: 5,
            include: true,
        });

        types.insert("test".to_string(), TypeConfig {
            display_name: "✅ Tests".to_string(),
            priority: 6,
            include: true,
        });

        types.insert("build".to_string(), TypeConfig {
            display_name: "📦 Build System".to_string(),
            priority: 7,
            include: true,
        });

        types.insert("ci".to_string(), TypeConfig {
            display_name: "👷 CI/CD".to_string(),
            priority: 8,
            include: true,
        });

        types.insert("chore".to_string(), TypeConfig {
            display_name: "🔧 Chore".to_string(),
            priority: 9,
            include: false,
        });

        Config { types }
    }
}
