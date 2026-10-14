# Server / client boundary

- **Server:** public menu data, private order reads, session verification, metadata, sitemap, robots and all mutations.
- **Client:** cart localStorage, debounced search UI, SWR order polling and interactive quantity controls.
- **Never move secrets into client code:** `SESSION_SECRET`, user password data and ownership checks stay server-side.
