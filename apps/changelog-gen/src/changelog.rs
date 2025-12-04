use anyhow::Result;
use std::collections::HashMap;
use crate::parser::ParsedCommit;
use crate::config::Config;

pub fn generate(commits: &[ParsedCommit], config: &Config) -> Result<String> {
    let mut output = String::new();
    output.push_str("# Changelog\n\n");

    let grouped = group_by_type(commits, config);

    for (type_name, type_commits) in grouped {
        if type_commits.is_empty() {
            continue;
        }

        output.push_str(&format!("### {}\n\n", type_name));

        for commit in type_commits {
            let scope_str = commit.scope.as_ref()
                .map(|s| format!("**{}**: ", s))
                .unwrap_or_default();

            let breaking_str = if commit.breaking { "⚠️ BREAKING: " } else { "" };

            // TODO: add different git provider support
            output.push_str(&format!(
                "- {}{}{} ([{}](https://github.com/Chia1104/chiastack.dev/commit/{}))\n",
                breaking_str, scope_str, commit.summary, commit.hash, commit.hash
            ));
        }

        output.push('\n');
    }

    Ok(output)
}

fn group_by_type<'a>(
    commits: &'a [ParsedCommit],
    config: &Config,
) -> Vec<(String, Vec<&'a ParsedCommit>)> {
    let mut groups: HashMap<String, Vec<&ParsedCommit>> = HashMap::new();

    // Group by type_key (e.g., "feat", "fix") instead of display_name
    for commit in commits {
        groups.entry(commit.commit_type.clone())
            .or_insert_with(Vec::new)
            .push(commit);
    }

    // Sort by priority using type_key, then convert to display_name
    let mut result: Vec<_> = groups.into_iter()
        .map(|(type_key, commits)| {
            let display_name = config.get_type_display_name(&type_key).to_string();
            (display_name, commits, config.get_type_priority(&type_key))
        })
        .collect();
    
    result.sort_by_key(|(_, _, priority)| *priority);
    
    // Return only (display_name, commits) tuples
    result.into_iter()
        .map(|(display_name, commits, _)| (display_name, commits))
        .collect()
}
