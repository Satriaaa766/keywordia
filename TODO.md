# Project TODOs

## Immediate Tasks
- [ ] **Data Validation**: Implement strict schema validation (e.g., Zod) for the `MindMap.content` JSON blob to prevent data corruption.
- [ ] **Error Handling**: Add comprehensive error boundaries and toast notifications for failed API operations and network errors.
- [ ] **Editor Enhancements**:
    - [ ] Add keyboard shortcuts (Enter for sibling, Tab for child, Delete to remove).
    - [ ] Support drag-and-drop reordering of nodes.
    - [ ] Zoom and pan capabilities for larger maps.
    - [ ] Undo/Redo history stack.

## Future Improvements
- [ ] **Collaboration**: Real-time collaborative editing using WebSockets (e.g., Socket.io, PartyKit, or simple polling).
- [ ] **Export Options**: Export maps to PDF, PNG, or Markdown/Text outline.
- [ ] **Theming**: User-customizable themes for map nodes (colors, fonts).
- [ ] **Offline Support**: LocalStorage caching for offline editing and sync when online.
- [ ] **Testing**: Add end-to-end tests with Playwright to verify critical flows (Login, Create Map, Edit Node).
