# Chinese copy — approved design and implementation plan

User approved full separate Chinese copy on 2026-11-16. Use simplified Chinese. Preserve all functionality, photos, numbers, routes and factual caveats. Source commit c2516d7; original Russian remote is read-only (push URL disabled). New public repository: novye-vysoka-zh, working branch codex/chinese, publishing branch codex/pages.

- [x] Copy complete current source and history into isolated clone; never push Russian remote.
- [x] Translate dist/index.html: all text, metadata, alt, aria, placeholders. Consistent brand 新维索卡, land agency 土地商店; preserve contact identifiers.
- [x] Translate all runtime JS data and templates, generated labels and errors. Preserve selectors, data IDs, behavior and calculations. Convert sotka explanations to 100 square metres, retain roubles and actual amounts.
- [x] Adapt Chinese typography without redesign; local Chinese font if needed. Translate vector logos, plan overlays/maps and other embedded visible Russian labels; retain original source assets.
- [x] Verify no Cyrillic user-facing text at rest or after interactions, all scripts syntax, desktop/mobile layout, navigation, galleries, routes, plans, dialogs, validation and success state without actual submission.
- [x] Create new GitHub repo only once local version is reviewable, publish dist into separate pages branch, enable Pages and check public URL. Verify Russian refs unchanged.

Acceptance: complete independent Chinese landing page, functioning public URL, mobile and desktop screenshots, no edits/pushes to Russian repo. Backend integration remains original demo behavior, no fake submission.
