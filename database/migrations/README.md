# Database Migrations

Add future production database changes here as `.sql` files.

Use timestamp-prefixed names so they run in order:

```text
202606161530_add_event_slug.sql
202606171000_add_user_profile_fields.sql
```

Run pending migrations from the backend directory:

```bash
npm run migrate
```

Fresh database setup still uses `database/schema.sql` through:

```bash
npm run init:db
```
