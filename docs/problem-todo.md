# Problem detail pages —

## Old implementation (`Problem.php`) vs new implementation (`/problems/[key]`)

(Ignoring quiz, game, circuit problems.)

| Status | Area                                                | Old                                | New                                                        |
| ------ | --------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| ✅     | Statement + HTML + downloads                        | Yes                                | Yes                                                        |
| ✅     | Public test cases                                   | Yes                                | Yes                                                        |
| ✅     | Language variants                                   | Yes                                | Yes                                                        |
| ✅     | Problem metadata / solution-language info           | Yes                                | Yes (slimmer admin fields)                                 |
| ✅     | User status + submit                                | Yes                                | Yes                                                        |
| ✅     | Submissions list                                    | Yes                                | Yes (richer tooling)                                       |
| ✅     | Submission analysis + testcase diffs                | Yes                                | Yes (plus dedicated diff editor)                           |
| ✅     | Code metrics                                        | Yes                                | Yes                                                        |
| ✅     | Source code view/download                           | Yes                                | Yes (stronger editor UX)                                   |
| ✅     | Problem health warnings (deprecated, SE, unchecked) | On page                            | Done!                                                      |
|        | Inline PDF in statement                             | Yes                                | Done!                                                      |
| ✅     | Auto hints, CE/Valgrind/inspector panels            | Yes                                | Done!                                                      |
| ✅     | Scored-problem breakdown                            | Yes                                | Done!                                                      |
| ✅     | Awards on submission page                           | Yes                                | Done!                                                      |
| ⚠️     | Solutions / all testcases / distiller tabs          | On problem page (admin/instructor) | Not on `/problems/[key]` (instructor tooling is elsewhere) |
| ⚠️     | Admin YAML/correction debug panels                  | On page                            | Not on student problem pages                               |
| ✅     | Guest can read statement                            | Yes                                | Yes                                                        |

### Status legend

| Symbol | Meaning                                                                               |
| ------ | ------------------------------------------------------------------------------------- |
| ✅     | Implemented in the new code                                                           |
| ❌     | Not implemented; the API appears to expose what is needed                             |
| ⚠️     | Not implemented; the API does not appear to expose what is needed (or only partially) |

### API notes for ⚠️ rows

- **Problem health warnings** — `deprecation` and `checked` are on `Problem` / `AbstractProblem`, but aggregate setter-error counts (`se_count`) are only on `instructor.problems.getAlerts`, not on student-facing endpoints.
- **Auto hints / CE / Valgrind / inspector** — no API equivalents to correction-side hint generation or diagnostic file panels; only generic fields such as `veredict_info` exist.
- **Scored-problem breakdown** — `Submission` and `getAnalysis` do not expose per-part scores (unlike the old `correction.yml` scoring table).
- **Solutions / all testcases / distiller** — `problems.getSolutions` exists (instructor), but there is no API for all private testcases (with hints/ops) or distiller config/files.
- **Admin YAML/correction debug panels** — no API to read correction or problem YAML/plain files from the web layer (old site read them from disk).
