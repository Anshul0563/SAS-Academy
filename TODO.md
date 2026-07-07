# TODO - Admin Results filter (all/week/month)

- [x] Update backend: `GET /results` support query param `range=all|week|month` and filter by `createdAt`.
- [x] Update frontend: `AdminResults.jsx.js` to refetch results when `dateFilter` changes using `range` param.
- [x] Ensure loading state updates correctly during refetch.
- [ ] Quick manual test: switch dropdown values and verify table rows change.

# TODO - Admin Results delete (row delete)

- [x] Backend: add `DELETE /results/:id` (admin only).
- [x] Frontend: add delete button in AdminResults rows + confirm + refetch.
- [ ] Manual test: delete a row from All Time and verify it disappears.



