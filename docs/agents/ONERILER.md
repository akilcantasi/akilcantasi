# Öneriler turu (2026-11): ajan özeti

Read docs/agents/DENETIM.md first: all its rules apply here, including:
- no personal info;
- Turkish UI, docs and comments;
- the Şafak design rules;
- file ownership;
- the 2-CPU limits;
- no git, no publishing;
- no questions.

This round implements new improvements, not just fixes. Several agents work in parallel.
- Library: `@noble/ed25519` v2 and `@noble/hashes` v1 are already installed for signatures. Use them in the browser and in Node. Node's own `crypto` also supports Ed25519. No other npm install.
- Every feature needs tests:
  - unit tests in tests/;
  - an e2e script for UI, extending existing ones or adding a new e2e/<feature>-check.mjs that exits non-zero on failure.
- Keep all existing tests passing:
  - run the vitest files related to your work;
  - run the full `npx vitest run` once at the end;
  - run your e2e scripts.
- Offline first: nothing may need the internet at runtime except the documented optional online catalog and downloads the user starts.
- Keep backward compatibility with data already on users' phones (localStorage, OPFS, board.json, packs). Old messages and old packs must keep working.
- Update the relevant docs (docs/*.md, docs/qa/*.md) in Turkish.

Final message to me, in English, under 400 words:
- what you built (per item);
- files touched;
- how it was verified, with test commands and results;
- anything the owner must do manually (exactly);
- known limitations.
