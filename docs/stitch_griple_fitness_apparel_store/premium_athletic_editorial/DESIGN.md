---
name: Premium Athletic Editorial
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e2e3e1'
  on-secondary-container: '#636563'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e3e1'
  secondary-fixed-dim: '#c6c7c5'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#454746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-edge: 48px
  section-gap: 120px
---

## Brand & Style

The design system is anchored in a high-end editorial aesthetic that balances the raw energy of performance athletics with the refined sensibilities of luxury fashion. It prioritizes "confidence-driven" minimalism, utilizing negative space to create a sense of scale and importance around the product photography.

The style is strictly **Minimalist**, characterized by sharp structural lines, a limited monochromatic palette, and a rejection of decorative effects like gradients or shadows. By utilizing a warm cream foundation instead of a sterile white, the design system evokes a "lifestyle-first" premium feel that distinguishes the brand from more technical, cold competitors.

## Colors

The color strategy centers on high-contrast legibility and tonal warmth. 

- **Primary & CTA:** The deep charcoal (`#1A1A1A`) is used for all critical actions and primary text, ensuring a bold, authoritative presence.
- **Background:** A bespoke warm neutral (`#FAFAF8`) serves as the canvas, providing a sophisticated alternative to pure white and softening the high-contrast black elements.
- **Surface:** Pure white (`#FFFFFF`) is reserved for product cards and high-priority containers to create subtle "lift" against the cream background without using shadows.
- **Muted & Border:** Secondary information uses a balanced grey (`#6B6B6B`), while structural divisions are defined by light, crisp strokes (`#E5E5E5`).

## Typography

This design system utilizes **Inter** exclusively to maintain a utilitarian yet modern feel across all touchpoints.

The typographic hierarchy is built on contrast:
- **Headlines** are aggressive and heavy (700-900 weight) with negative letter-spacing to create a "locked" and powerful appearance, similar to luxury fitness periodicals.
- **Body text** prioritizes readability with a generous 1.6 line-height, allowing the content to breathe.
- **Labels** use uppercase styling and wide tracking to act as sophisticated navigational markers or "stamps" on the page.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy to maintain editorial control over content alignment. A 12-column grid is used for desktop views, while vertical spacing is driven by a strict 8px base unit.

Generous whitespace is a core functional element, not a secondary consideration. Large section gaps (120px+) are used to separate different product stories or editorial features, ensuring the user is never overwhelmed by information density. Margins are intentionally wide to draw the eye inward toward the center of the experience.

## Elevation & Depth

This design system avoids all traditional elevation cues such as drop shadows or blurs. Instead, it utilizes **Tonal Layering** and **Low-contrast Outlines**.

Depth is communicated through:
1.  **Color Hierarchy:** Pure white surfaces (`#FFFFFF`) are placed on top of the cream background (`#FAFAF8`) to indicate active or interactive modules.
2.  **Structural Borders:** 1px solid borders in `#E5E5E5` define boundaries between elements. 
3.  **Scale:** Size and negative space—rather than Z-axis height—dictate the importance of an element.

## Shapes

The shape language is strictly **Sharp**. All interactive elements, containers, images, and buttons feature 0px border-radius. This geometric rigidity reinforces the "premium" and "architectural" feel of the brand, moving away from the soft, friendly curves common in mass-market apps toward a more disciplined, athletic aesthetic.

## Components

### Buttons
Primary CTAs are solid `#1A1A1A` with `#FFFFFF` text. They must be perfectly rectangular with no rounding. Hover states involve a slight shift to a dark grey or a subtle interior border. Secondary buttons utilize a 1px border with no fill.

### Input Fields
Inputs are defined by a 1px bottom border only or a full thin-stroke rectangle. Placeholders use the Muted Text color. Labels are always positioned above the input in the `label-caps` style.

### Chips & Tags
Used for sizes or categories, these are square boxes with 1px borders. Selected states flip the color to solid black with white text.

### Product Cards
Cards feature no shadows. They use a white background to differentiate from the cream page background. Product imagery should be shot on neutral, clean backgrounds to maintain the "editorial" flow.

### Navigation
The header should be minimal and slim, utilizing high-density labels (`label-caps`) for menu items to maintain an airy, luxury-boutique feel.