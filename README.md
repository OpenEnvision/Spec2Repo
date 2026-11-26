# Spec2Repo: Benchmarking Repository Construction against Behavioral Specifications

- **Project Page & Leaderboard:** [https://openenvision.github.io/Spec2Repo/](https://openenvision.github.io/Spec2Repo/)
- **Paper (PDF):** [Spec2Repo.pdf](Spec2Repo.pdf)

## Overview

**Spec2Repo** is a benchmark of **150 repository-construction tasks** across five programming languages (Python, TypeScript, Rust, Java, and Go). An agent receives only a user-facing behavioral specification and an empty workspace, and must build an installable or buildable repository from scratch. Submissions are evaluated by **16,597 hidden tests** grouped into **1,962 specified capabilities** that interact with the repository strictly through its declared public interface.

- The Spec2Repo tasks and hidden test suites are kept private to prevent contamination. To evaluate a model or scaffold on Spec2Repo, contact `frostlin2005@gmail.com`.
- This repository hosts the [project page](https://openenvision.github.io/Spec2Repo/) and the [paper manuscript (`Spec2Repo.pdf`)](Spec2Repo.pdf).
