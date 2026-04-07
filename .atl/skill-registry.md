# Skill Registry — express-cli-tool

Generated: 2026-04-06

## User Skills
| Skill | Trigger | Source |
|-------|---------|--------|
| branch-pr | PR creation, opening pull requests, preparing review branches | ~/.config/opencode/skills/branch-pr/SKILL.md |
| go-testing | Writing Go tests, Bubbletea TUI coverage, teatest usage | ~/.config/opencode/skills/go-testing/SKILL.md |
| issue-creation | Creating GitHub issues, reporting bugs/features, enforcing issue-first flow | ~/.config/opencode/skills/issue-creation/SKILL.md |
| judgment-day | Requests mentioning “judgment day”, adversarial/dual review, "juzgar" | ~/.config/opencode/skills/judgment-day/SKILL.md |
| skill-creator | Adding new AI skills, documenting project-specific patterns | ~/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

### branch-pr
- Issue-first: every PR MUST reference an approved issue and add exactly one `type:*` label.
- Branch names follow `type/description` (`feat/`, `fix/`, etc.) and commits MUST be conventional commits.
- Use the PR template sections (issue link, PR type checkbox, summary, changes table, test plan, contributor checklist).
- Run `shellcheck` on modified scripts before pushing; automated checks enforce labels + shellcheck.
- Breaking changes require the `!` indicator plus `type:breaking-change` label.

### go-testing
- Default to table-driven tests for Go functions; cover success + error cases with `t.Run` subtests.
- For Bubbletea TUIs, test `Model` state transitions directly and use `teatest.NewTestModel` for interactive flows.
- Use golden files for deterministic TUI output; update with `go test -update` when snapshots change.
- Organize tests alongside source files (`*_test.go`) and keep `testdata/` for goldens.
- Common commands: `go test ./...`, `go test -cover ./...`, `go test -short` for skipping integrations.

### issue-creation
- Issues are mandatory before PRs; pick Bug Report vs Feature Request templates — blank issues are disabled.
- Fill every required field (pre-flight checks, problem/bug description, reproduction steps, expected vs actual).
- Bug reports auto-label `bug` + `status:needs-review`; feature requests add `enhancement` + `status:needs-review`.
- Maintainers must promote to `status:approved` before implementation; add priority labels when triaging.
- Questions or discussions belong in GitHub Discussions, not issues.

### judgment-day
- Run two blind judges in parallel using the skill resolver + compact rules before launch; never review inline.
- Judges classify severities (CRITICAL, WARNING real/theoretical, SUGGESTION) and must report skill resolution status.
- Fix agents only touch confirmed issues; after fixes, immediately re-run both judges for re-judgment.
- Escalate to the user after two fix iterations if issues persist; don’t declare APPROVED until both judges are clean.
- Always maintain a verdict table with confirmed vs suspect findings and ask user before applying fixes.

### skill-creator
- Create a new skill when a reusable workflow/pattern needs explicit instructions; skip for one-offs or existing docs.
- Directory layout: `skills/{name}/SKILL.md` plus optional `assets/` templates and `references/` to local docs.
- Frontmatter requires name, description (include trigger), license Apache-2.0, author, version.
- Follow the provided SKILL.md template (When to Use, Critical Patterns, Examples, Commands, Resources).
- Register each new skill in `AGENTS.md` and ensure naming follows `{technology}` or `{project-component}` conventions.
