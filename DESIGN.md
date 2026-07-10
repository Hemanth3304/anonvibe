---
name: Serene Habitat
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#454841'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#767870'
  outline-variant: '#c6c7be'
  surface-tint: '#58614f'
  primary: '#424b3a'
  on-primary: '#ffffff'
  primary-container: '#5a6351'
  on-primary-container: '#d5dfc8'
  inverse-primary: '#c0cab4'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#494845'
  on-tertiary: '#ffffff'
  tertiary-container: '#61605c'
  on-tertiary-container: '#dddbd6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce6cf'
  primary-fixed-dim: '#c0cab4'
  on-primary-fixed: '#161e10'
  on-primary-fixed-variant: '#414939'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is rooted in the Japandi aesthetic—a fusion of Japanese minimalism and Scandinavian functionality. It targets a high-end residential audience, evoking an emotional response of tranquility, warmth, and curated intentionality. The UI should feel like a sanctuary: breathable, tactile, and quiet.

The style prioritizes **Minimalism** with a heavy emphasis on whitespace and natural textures. Visual weight is carried through high-quality typography and a sophisticated color story rather than decorative elements. Every interaction should feel deliberate and soft, mimicking the physical sensation of linen and light-grained wood.

## Colors

The palette is derived from earthy, organic materials to ground the digital experience in the physical world.

*   **Primary (Sage Green):** Used for key actions and active states, providing a calm, botanical focal point.
*   **Secondary (Brushed Gold):** Applied sparingly for highlights, icons, or premium indicators to suggest craftsmanship.
*   **Tertiary (Oatmeal/Sand):** The foundation of the UI. This off-white/beige tone replaces pure white to reduce eye strain and add warmth.
*   **Neutral (Charcoal):** Used for typography and deep structural elements to provide necessary grounding and legibility.

## Typography

This design system employs a classic serif for headlines to communicate luxury and heritage, paired with a modern geometric sans-serif for functional clarity.

- **Headlines:** Use *Libre Caslon Text*. It brings a literary, authoritative, and elegant feel to the product. Keep tracking tight on larger sizes to maintain a premium "editorial" look.
- **Body & Labels:** Use *DM Sans*. Its low-contrast, understated geometric shapes provide a clean counterpoint to the serif, ensuring high readability across all devices.
- **Hierarchy:** Use the `label-caps` style for small metadata or overlines to add a touch of architectural structure to the layout.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to create a centered, gallery-like viewing experience, transitioning to a fluid model on mobile devices.

- **Grid:** A 12-column grid with generous gutters (24px) allows the content to "breathe." 
- **Rhythm:** Use an 8px base unit. For high-end aesthetics, lean towards larger padding values (e.g., 48px, 64px) between sections to avoid visual clutter.
- **Responsive:** On mobile, margins reduce to 20px, and typography shifts to the mobile-specific tokens. Elements should stack vertically, maintaining the same vertical rhythm as desktop.

## Elevation & Depth

To maintain the Japandi influence, depth is achieved through **Tonal Layers** rather than heavy shadows. 

- **Surface Tiers:** Use subtle shifts in the neutral palette (e.g., a slightly darker "Sand" background for a container) to indicate elevation.
- **Soft Ambient Shadows:** If elevation is required for floating elements (like modals), use extremely diffused, low-opacity shadows (Opacity: 4-6%) with a slight warm tint (#2C2C2C) to mimic natural light hitting a matte surface.
- **Outlines:** Use thin (1px), low-contrast borders in a "Soft Charcoal" or "Muted Gold" for cards and input fields instead of drop shadows.

## Shapes

The shape language is **Soft** and architectural. While the overall vibe is minimalist, sharp edges are avoided to ensure the UI feels "inviting" rather than "cold."

- **Corners:** Standard buttons and cards use a 0.25rem (4px) radius. Larger containers or feature images may use up to 0.75rem (12px) to soften the visual impact.
- **Media:** Photography of interiors should always be the hero. Use the same "Soft" radius for image containers to maintain consistency with the UI components.

## Components

- **Buttons:** Primary buttons use a solid Sage Green background with white or oatmeal text. Secondary buttons should use a Brushed Gold outline or a simple text-link style with a custom gold underline.
- **Cards:** Cards should have a flat "Sand" background with a 1px "Muted Gold" border. No heavy shadows. Typography inside cards should be centered for an editorial feel.
- **Inputs:** Text fields use a minimal bottom-border only (1px Charcoal) or a very light "Sand" fill. Focus states are indicated by the border thickening slightly or changing to Sage Green.
- **Lists:** Use generous vertical padding (16px+) between items. Separators should be subtle, using a low-opacity charcoal or sand line.
- **Chips/Tags:** Small, pill-shaped tags with a light Sage Green wash and dark Sage Green text for categories like "Living Room" or "Sustainable."
- **Additional Elements:** Incorporate "Texture Overlays"—subtle, low-opacity grain or linen patterns on large background areas—to reinforce the tactile theme.
