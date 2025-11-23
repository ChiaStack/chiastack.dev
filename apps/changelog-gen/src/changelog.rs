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

        output.push_str(&format!("## {}\n\n", type_name));

        for commit in type_commits {
            let scope_str = commit.scope.as_ref()
                .map(|s| format!("**{}**: ", s))
                .unwrap_or_default();

            let breaking_str = if commit.breaking { "⚠️ BREAKING: " } else { "" };

            output.push_str(&format!(
                "- {}{}{} ([{}])\n",
                breaking_str, scope_str, commit.summary, commit.hash
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

    for commit in commits {
        let type_name = config.get_type_display_name(&commit.commit_type);
        groups.entry(type_name.to_string())
            .or_insert_with(Vec::new)
            .push(commit);
    }

    let mut result: Vec<_> = groups.into_iter().collect();
    result.sort_by_key(|(type_name, _)| {
        config.get_type_priority(type_name)
    });

    result
}
