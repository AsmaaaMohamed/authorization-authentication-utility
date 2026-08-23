# Auth & Authorization Utility

A standalone Express + TypeScript utility app: authentication, role-based authorization, file/image upload via Multer + Cloudinary, and a full OTP-based password reset flow via Nodemailer.

This is the first in a series of small backend practice utilities. Goal: each teammate ships a clean, isolated, well-documented module that could be dropped into a bigger project later.

---

## 1. Tech Stack & Purpose of Each Package

| Category | Package | Why it's here |
|---|---|---|
| Language / Runtime | `typescript`, `ts-node-dev` | Type safety, dev auto-reload |
| Framework | `express` | HTTP server, routing, middleware pipeline |
| Auth | `jsonwebtoken` | Issue & verify access/refresh tokens |
| Auth | `bcrypt` | Hash & compare passwords |
| Authorization | (custom middleware) | Role/permission-based route guards (RBAC) |
| File Upload | `multer` | Parse `multipart/form-data`, handle incoming files in memory/disk before forwarding to Cloudinary |
| Image Hosting/Edit | `cloudinary` | Store uploaded images; apply transformations (resize/crop/format) on upload or on the fly via URL params |
| Email | `nodemailer` | Send OTP codes and reset-confirmation emails via SMTP |
| Validation | `zod` or `joi` | Validate request bodies (register, login, reset flows) |
| Env Config | `dotenv` | Centralize secrets/config |
| DB / Cache | `mongodb`/`mongoose` or `postgresql` + `redis` | Persist users; Redis stores OTPs with a TTL and can blacklist revoked refresh tokens |
| Security | `helmet`, `cors`, `express-rate-limit` | Harden headers, control cross-origin access, throttle sensitive routes (login, OTP request) |
| Logging | `morgan` | Request logging in dev |

**Multer limits** — configure per-route: `fileSize` (e.g. 5MB), `files` count, and a `fileFilter` restricting mimetypes to `image/*`. Reject early before anything reaches Cloudinary.

**Cloudinary edits** — on upload, apply a transformation pipeline (e.g. resize to a max width/height, auto-format, auto-quality, face-crop for avatars). Store only the returned `secure_url` + `public_id` in the DB so the image can be replaced/deleted later.

### Cloudinary Functionality Checklist

| Feature | Where it's used |
|---|---|
| **Signed/authenticated uploads** | Backend signs upload requests (API key/secret via env) — never expose the secret to the client |
| **Stream upload from Multer buffer** | `cloudinary.uploader.upload_stream()` fed by the in-memory buffer Multer parses, avoiding writing temp files to disk |
| **Eager/on-upload transformations** | Resize avatar to a fixed max width/height (e.g. 500x500), `crop: 'fill'` |
| **Gravity / face-detection crop** | `gravity: 'face'` (or `'faces'`) so avatar crops center on the face rather than an arbitrary square |
| **Auto format & quality** | `fetch_format: 'auto'`, `quality: 'auto'` — serves WebP/AVIF where supported, smallest file without visible loss |
| **Folder organization** | Upload into a structured path, e.g. `app-name/avatars/{userId}` for easy management and cleanup |
| **Unique/deterministic public_id** | Use the user's ID (or a UUID) as `public_id` so re-uploads overwrite predictably instead of orphaning old files |
| **Overwrite on replace** | `overwrite: true` when a user updates their avatar, OR explicit destroy of the old `public_id` before uploading the new one |
| **Asset deletion** | `cloudinary.uploader.destroy(public_id)` — called when a user removes their avatar or deletes their account |
| **Allowed formats restriction** | `allowed_formats: ['jpg','png','webp']` at the Cloudinary config level, as a second layer behind Multer's `fileFilter` |
| **File size / upload limits** | Cloudinary account-level limits as a backstop behind Multer's `fileSize` limit |
| **Responsive/derived URLs** | Generate a couple of sized variants (thumbnail vs full) via URL-based transformations for different UI contexts (list avatar vs profile page) |
| **Moderation (optional/stretch)** | Cloudinary's add-on moderation (or a manual flag) if the app ever accepts user-uploaded content beyond avatars |
| **Webhooks (optional/stretch)** | Notification URL for async upload/transformation status if processing gets heavy |

For this app the *required* set is: signed stream upload, resize + face-crop + auto format/quality, folder-scoped deterministic `public_id`, and destroy-on-replace/delete. Responsive variants and moderation/webhooks are marked optional — nice practice extensions if time allows.

**OTP flow** — generate a short numeric code (e.g. 6 digits), store it hashed in Redis (or DB) with a short TTL (5–10 min) and a max-attempts counter, email it via Nodemailer, verify on submit, then allow a one-time password reset before invalidating the OTP.

---

## 2. Task Breakdown

### Task 1 — Project Setup
- Init TypeScript + Express skeleton (`tsconfig.json`, folder structure: `src/{routes,controllers,services,middlewares,models,utils,config}`)
- Configure `dotenv`, `morgan`, `helmet`, `cors`, error-handling middleware
- Connect to DB (Mongo/Postgres) and Redis
- Set up `nodemon`/`ts-node-dev` dev script

### Task 2 — Core Authentication
- User model (email, hashed password, role, isVerified, avatar fields)
- Register endpoint (validate → hash password → create user)
- Login endpoint (verify password → issue access + refresh JWT)
- Refresh-token endpoint + logout (invalidate refresh token, e.g. via Redis blacklist)
- Auth middleware: verify access token, attach `req.user`

### Task 3 — Authorization (RBAC)
- Define roles (e.g. `user`, `admin`) and a permissions map
- `authorize(...roles)` middleware to guard routes
- Example protected admin-only route to prove it works

### Task 4 — File Upload (Multer + Cloudinary)
- Multer middleware config: storage strategy, `fileSize`/`files` limits, `fileFilter` for image mimetypes
- Cloudinary config (env-based) + upload service (stream buffer → Cloudinary)
- Apply transformations (resize/crop/format) at upload time
- Endpoint: upload/replace profile avatar; delete old Cloudinary asset on replace
- Error handling for oversized/invalid files (clear 4xx responses, not crashes)

#### Cloudinary Practice Features
- Upload images using Multer + Cloudinary.
- Upload images using stream upload from Multer buffer.
- Apply image transformations:
  - Resize
  - Crop
  - fit, fill, thumb
  - Face detection / face-based cropping
  - Rotation
  - Quality optimization
  - Automatic format conversion
- Generate different image sizes:
  - Thumbnail
  - Medium
  - Full-size
- Generate transformed images dynamically using Cloudinary URLs.
- Replace an existing image while keeping a deterministic public_id.
- Delete images from Cloudinary.
- Organize assets using folders.
- Restrict allowed image formats.
- Handle upload size limits.
- Generate optimized URLs using automatic format and quality.
- Practice responsive images by generating multiple sizes.
- Practice image effects, such as:
  - Blur
  - Grayscale
  - Background removal if supported/configured
  - Rounded/circular avatars
- Practice secure/signed uploads from the backend.
- Store secure_url and public_id in the database.
- Retrieve image metadata from Cloudinary.
- Practice generating transformed URLs without creating a new physical asset.
- Optional: Cloudinary moderation.
- Optional: Cloudinary webhooks for asynchronous processing.

### Task 5 — Password Reset (OTP + Nodemailer)
- Nodemailer transporter config (SMTP creds via env)
- `POST /auth/forgot-password` — generate OTP, store hashed w/ TTL in Redis, email it
- `POST /auth/verify-otp` — check OTP validity, attempt count, expiry
- `POST /auth/reset-password` — accept new password only after a valid verified OTP, hash + update, invalidate OTP and existing sessions

### Task 6 — Security & Rate Limiting
- Rate-limit login, forgot-password, and verify-otp routes
- Input validation (zod/joi) on every endpoint
- Centralized error handler with consistent error shape

### Task 7 — Documentation & Handoff
- API reference (routes, request/response shapes, status codes) — Postman collection or `.http` file
- `.env.example`
- This README kept up to date as source of truth

---

## Suggested Task Assignment
With 4 backend devs, a natural split:
- Dev A: Task 1 + Task 2
- Dev B: Task 3 + Task 6
- Dev C: Task 4
- Dev D: Task 5

Task 7 is shared/rotating as each part lands.
