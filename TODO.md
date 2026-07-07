# TODO

- [ ] Fix admin/client layout left overflow by shifting main content when sidebar is fixed
- [x] Update `client/src/components/admin/AdminLayout.jsx.js` to add `lg:ml-64` (or padding equivalent) to main wrapper so main doesn’t go under sidebar

- [x] Update `client/src/components/Layout.js` to add desktop left offset (`md:ml-64` / `md:pl-64`) for the main wrapper

- [x] Ensure no horizontal scrolling: keep `overflow-x-hidden` on relevant wrappers (already present)

- [ ] Run frontend build/lint (if available) and verify admin + client panels
