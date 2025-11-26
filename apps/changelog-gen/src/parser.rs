use anyhow::Result;
use conventional_commit_parser::{parse, commit::CommitType};
use crate::git::CommitInfo;

#[derive(Debug, Clone)]
pub struct ParsedCommit {
    pub hash: String,
    pub commit_type: String,
    pub scope: Option<String>,
    pub summary: String,
    pub body: Option<String>,
    pub breaking: bool,
    pub date: chrono::DateTime<chrono::Utc>,
    pub author: String,
}

pub fn parse_commits(commits: Vec<CommitInfo>) -> Vec<ParsedCommit> {
    commits
        .into_iter()
        .filter_map(|commit| parse_single_commit(commit).ok())
        .collect()
}

fn parse_single_commit(commit: CommitInfo) -> Result<ParsedCommit> {
    let message = commit.message.lines().next().unwrap_or("").trim();
    let parsed = parse(message)
        .map_err(|e| anyhow::anyhow!("failed to parse commit message: {}", e))?;

    let commit_type = match parsed.commit_type {
        CommitType::Feature => "feat",
        CommitType::BugFix => "fix",
        CommitType::Documentation => "docs",
        CommitType::Style => "style",
        CommitType::Refactor => "refactor",
        CommitType::Performances => "perf",
        CommitType::Test => "test",
        CommitType::Build => "build",
        CommitType::Ci => "ci",
        CommitType::Chore => "chore",
        CommitType::Revert => "revert",
        CommitType::Custom(ref s) => s.as_str(),
    };

    Ok(ParsedCommit {
        hash: commit.hash,
        commit_type: commit_type.to_string(),
        scope: parsed.scope,
        summary: parsed.summary,
        body: parsed.body,
        breaking: parsed.is_breaking_change,
        date: commit.date,
        author: commit.author,
    })
}
