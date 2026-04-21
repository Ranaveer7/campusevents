# Design Brief

## Direction
Neon Glassmorphism Campus Platform — Premium dark-themed event management system with futuristic glass cards and vibrant gradient accents.

## Tone
Maximalist neon energy with minimalist restraint: bold cyan/magenta/purple gradients on ultra-refined glassmorphic surfaces create confident, high-tech campus event platform.

## Differentiation
Neon gradient borders + semi-transparent glass cards with backdrop blur and inset glow create an unforgettable "premium tech campus" aesthetic that stands apart from generic event platforms.

## Color Palette

| Token          | OKLCH            | Role                         |
| -------------- | ---------------- | ---------------------------- |
| background     | 0.12 0.01 260    | Deep charcoal base           |
| foreground     | 0.93 0.01 260    | Off-white text               |
| card           | 0.18 0.015 260   | Glass card base              |
| primary        | 0.68 0.24 300    | Vivid neon cyan/blue         |
| accent         | 0.7 0.23 320     | Neon magenta/pink            |
| secondary      | 0.22 0.02 260    | Dark secondary               |
| muted          | 0.22 0.02 260    | Muted interactive states     |
| destructive    | 0.65 0.19 22     | Red alert/delete             |
| chart-1–5      | Neon gradients   | Dashboard chart colors       |

## Typography
- Display: Space Grotesk — geometric, modern, tech-forward headings and hero text
- Body: DM Sans — clean, readable sans-serif for paragraphs and UI labels
- Mono: Geist Mono — code and data labels
- Scale: Hero `text-5xl md:text-7xl font-bold`, Section `text-3xl md:text-5xl`, Label `text-xs font-semibold uppercase`, Body `text-base`

## Elevation & Depth
Glass cards (0.18 L background with 50–80% opacity) layered over background via `backdrop-blur-md`, with subtle inset white glow and layered box shadows creating depth; neon borders glow on hover.

## Structural Zones

| Zone       | Background           | Border                      | Notes                                    |
| ---------- | -------------------- | --------------------------- | ---------------------------------------- |
| Header     | glass-card/80        | border-white/10             | Sticky, glassmorphic with subtle blur    |
| Sidebar    | glass-card/50        | border-white/15             | Collapsible left nav, dark glass overlay |
| Content    | bg-background        | —                           | Dark charcoal with staggered glass cards |
| Cards      | glass-card/80        | neon gradient borders       | Scale +5% on hover, glow effect on border|
| Footer     | glass-card/70        | border-white/10             | Glassmorphic with neon accent accent     |

## Spacing & Rhythm
16px base grid with 8px microspacing; generous gaps between sections (2rem+) for breathing room; cards group content in dense 12px internal padding; neon glow effects add perceived depth without heavy shadows.

## Component Patterns
- Buttons: gradient fills (cyan/magenta/purple), 200–300ms smooth transitions, scale hover effect, active scale down
- Cards: 8–12px rounded corners, glass-card class (backdrop-blur), neon borders with glow, staggered entrance animation
- Badges: small neon pills with 50% background opacity, gradient text accent

## Motion
- Entrance: Staggered fade-in with 0.4s timing (40ms delay between items)
- Hover: 250–300ms smooth transitions on card (scale +5%, glow intensify), button color shift
- Sidebar toggle: 300ms slide-in/slide-out animation

## Constraints
- Never use raw hex colors; all colors via CSS variables and Tailwind OKLCH theme
- Neon accents used sparingly on interactive elements only; background remains restrained
- All interactive elements include 250–300ms smooth transitions
- Sidebar collapsible, not always visible on mobile
- Accessibility: minimum 4.5:1 contrast ratio on all text (ensure against glass overlays)

## Signature Detail
Neon gradient borders on glass cards with hover glow effect — category: interactive detail. Creates the signature "premium tech campus" aesthetic by combining high-chroma neon accents with refined glassmorphic restraint.
