use anyhow::{Context, Result};
use git2::{Commit, Repository, Oid};

pub struct CommitInfo {
    pub hash: String,
    pub message: String,
    pub author: String,
    pub date: chrono::DateTime<chrono::Utc>,
}

pub fn get_commits(
    repo_path: &str,
    from_tag: Option<&str>,
    to_tag: Option<&str>,
) -> Result<Vec<CommitInfo>> {
    let repo = Repository::open(repo_path)
        .context("failed to open git repository")?;

    let from_oid = if let Some(tag) = from_tag {
        Some(resolve_reference(&repo, tag)?)
    } else {
        None
    };

    let to_oid = if let Some(tag) = to_tag {
        resolve_reference(&repo, tag)?
    } else {
        repo.head()?.target().context("failed to get HEAD")?
    };

    let mut revwalk = repo.revwalk()?;
    revwalk.push(to_oid)?;

    if let Some(from) = from_oid {
        revwalk.hide(from)?;
    }

    let mut commits = Vec::new();

    for oid in revwalk {
        let oid = oid?;
        let commit = repo.find_commit(oid)?;
        
        commits.push(extract_commit_info(&commit)?);
    }

    Ok(commits)
}

fn resolve_reference(repo: &Repository, reference: &str) -> Result<Oid> {
    // Git tag
    if let Ok(tag) = repo.find_reference(&format!("refs/tags/{}", reference)) {
        return Ok(tag.peel_to_commit()?.id());
    }
    
    // Git branch
    if let Ok(branch) = repo.find_reference(&format!("refs/heads/{}", reference)) {
        return Ok(branch.peel_to_commit()?.id());
    }
    
    // Git commit hash
    Oid::from_str(reference)
        .context(format!("failed to resolve reference: {}", reference))
}

fn extract_commit_info(commit: &Commit) -> Result<CommitInfo> {
    let message = commit.message()
        .context("failed to get commit message")?
        .to_string();
    
    let author = commit.author().name()
        .context("failed to get author name")?
        .to_string();
    
    let timestamp = commit.time().seconds();
    let date = chrono::DateTime::from_timestamp(timestamp, 0)
        .context("invalid timestamp")?;

    Ok(CommitInfo {
        hash: commit.id().to_string()[..7].to_string(),
        message,
        author,
        date,
    })
}
