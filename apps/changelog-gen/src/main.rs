use clap::Parser;
use anyhow::Result;

mod git;
mod parser;
mod changelog;
mod config;

#[derive(Parser)]
#[command(name = "changelog-gen")]
#[command(about = "Generate changelog from git commits", long_about = None)]
struct Cli {
    #[arg(short, long, default_value = ".")]
    repo_path: String,

    #[arg(short, long)]
    from: Option<String>,

    #[arg(short, long)]
    to: Option<String>,

    #[arg(short, long, default_value = "CHANGELOG.md")]
    output: String,

    #[arg(short, long)]
    config: Option<String>,
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    let config = if let Some(config_path) = &cli.config {
        config::Config::from_file(config_path)?
    } else {
        config::Config::default()
    };

    let commits = git::get_commits(
        &cli.repo_path,
        cli.from.as_deref(),
        cli.to.as_deref(),
    )?;

    let parsed_commits = parser::parse_commits(commits);
    let changelog = changelog::generate(&parsed_commits, &config)?;

    std::fs::write(&cli.output, changelog)?;
    println!("✅ Changelog generated to: {}", cli.output);

    Ok(())
}
