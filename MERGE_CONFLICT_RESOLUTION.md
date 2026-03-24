# Merge conflict resolution note (Journal page)

If GitHub shows markers like below in `src/pages/Journal.tsx`:

```txt
<<<<<<< codex/fix-next...
...current change...
=======
...incoming change...
>>>>>>> main
```

that means Git cannot auto-merge both branches because both touched the same lines.

## What is happening

- **Current change** = your PR branch version.
- **Incoming change** = target branch (`main`) version.
- You must pick one side or manually combine both and remove the markers.

## Recommended resolution for this repo

Keep the **magazine-style Journal layout** and ensure these are present after resolving:

- `formatDateLabel()` helper.
- `featuredPosts` section + `MAGAZINE` masthead.
- interview list rows with `SmartImage`.
- `Seo` metadata call for `/journal`.

## Quick workflow

1. In GitHub conflict editor, choose **Accept both changes** where needed.
2. Manually edit to one clean final version.
3. Remove all conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Mark as resolved and commit.
5. Pull/rebase locally if needed and run:

```bash
npm run lint
npm run build
```

## Local verification command

Use this before committing to ensure no conflict markers remain:

```bash
rg "^(<<<<<<<|=======|>>>>>>>)" src/pages/Journal.tsx
```

If that command prints nothing, markers are removed.
