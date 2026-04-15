# Sogni di Carta: Design Standards

## 1. Tailwind v4 & Theme Configuration

All design tokens are defined in `app/globals.css` using the `@theme inline` block.

### Colors
- `surface`: `#faf9f6` (Main background)
- `primary`: `#755850` (Text/Main actions)
- `secondary`: `#d1d9cf` (Sage/Functional background)
- `surface-container-*`: Tonal layering from `lowest` (#ffffff) to `highest`.
- `primary-container`: `#eec7be` (Blush/Gradients)

### Custom Utilities
- `.glass`: 70% opacity with 24px backdrop blur.
- `.signature-texture`: Radial gradient for hero sections.
- `.whisper-shadow`: Soft, primary-colored shadows.
- `.tracking-archival`: 0.05rem letter-spacing + uppercase for labels.
- `.ghost-border`: 20% opacity outline for subtle containment.

## 2. Best Practices

- **Mobile-First:** Always start with base classes and add breakpoints (`md:`, `lg:`) for larger screens.
- **No Rigid Borders:** Use tonal shifts (`surface-container-low`) or negative space instead of `border-solid`.
- **Typography:** 
  - Serif (`font-serif`): Noto Serif for headlines and emotional moments.
  - Sans (`font-sans`): Plus Jakarta Sans for body and labels.
- **Composition:** Use the `cn()` utility from `@/lib/utils` for conditional classes.
- **Spacing:** Use `flex` with `gap-*` instead of `space-x/y`.

## 3. Backend & Data Standards

### Persistence (Prisma + PostgreSQL)
- **Database:** PostgreSQL (`sogno-db`).
- **ORM:** Prisma Client.
- **Instance:** Always import `prisma` from `@/lib/prisma`.

### User Model
- **Core Fields:** `name`, `email` (unique), `password` (hashed), `cpf` (unique).
- **Address Structure:** Separate model (`Address`) for detailed fields:
  - `zipCode`: CEP (required for order flow).
  - `street`, `number`, `complement`, `neighborhood`, `city`, `state`.
- **Validation:** Use `zod` for server-side validation and form handling.

### Security
- **Passwords:** Never store plain-text. Use `bcryptjs` or `argon2`.
- **API Keys:** Use `.env` (never commit).
- **Sensitive Data:** CPF and Email are sensitive; always use HTTPS in production.
