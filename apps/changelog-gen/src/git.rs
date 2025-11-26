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

    if let Some(from) = from_oid {
        if from == to_oid {
            return Ok(Vec::new());
        }
        return get_commits_between(&repo, from, to_oid);
    }

    let mut revwalk = repo.revwalk()?;
    revwalk.set_sorting(git2::Sort::TOPOLOGICAL | git2::Sort::TIME)?;
    revwalk.push(to_oid)?;

    let mut commits = Vec::new();
    for oid in revwalk {
        let commit = repo.find_commit(oid?)?;
        commits.push(extract_commit_info(&commit)?);
    }

    Ok(commits)
}

fn get_commits_between(
    repo: &Repository,
    from: Oid,
    to: Oid,
) -> Result<Vec<CommitInfo>> {
    let mut revwalk = repo.revwalk()?;
    revwalk.set_sorting(git2::Sort::TOPOLOGICAL | git2::Sort::TIME)?;
    revwalk.push(to)?;
    
    let mut commits = Vec::new();
    for oid in revwalk {
        let oid = oid?;
        if oid == from {
            break;
        }
        let commit = repo.find_commit(oid)?;
        commits.push(extract_commit_info(&commit)?);
    }
    
    Ok(commits)
}

fn resolve_reference(repo: &Repository, reference: &str) -> Result<Oid> {
    match repo.revparse_single(reference) {
        Ok(obj) => {
            let commit = obj.peel_to_commit()
                .context(format!("reference '{}' does not point to a commit", reference))?;
            Ok(commit.id())
        }
        Err(_) => {
            Oid::from_str(reference)
                .context(format!("failed to resolve reference: {}", reference))
        }
    }
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
