import Link from "next/link";

import { Container } from "@/components/shared/Container";

type FooterLink = { label: string; href: string };

/* ────────────────────────────────────────────────────────
   Logo mark (same SVG as Navbar, but tinted to cyan)
──────────────────────────────────────────────────────── */
function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-7 shrink-0" aria-hidden="true">
        <svg
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            clipRule="evenodd"
            d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      </div>
      <span
        className="text-on-surface text-xl font-bold leading-tight tracking-[-0.015em]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Griple
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Social icon button
──────────────────────────────────────────────────────── */
function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex h-9 w-9 items-center justify-center rounded-full",
        "border border-white/[0.10] text-on-surface-variant",
        "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "hover:border-primary/50 hover:text-primary hover:scale-[1.08]",
        "hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </a>
  );
}

/* ────────────────────────────────────────────────────────
   Footer nav column
──────────────────────────────────────────────────────── */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <h3
        className={[
          "font-label-caps text-label-caps text-primary",
          "[text-shadow:0_0_10px_rgba(0,245,255,0.3)]",
        ].join(" ")}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              className={[
                "text-sm text-on-surface-variant",
                "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "hover:text-on-surface hover:translate-x-0.5",
                "inline-block",
              ].join(" ")}
              href={l.href}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Footer
──────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-dim border-t border-white/[0.06]">
      {/* Ambient bottom glow matching the dark theme mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(0,245,255,0.04) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 40% at 0% 80%, rgba(139,92,246,0.04) 0%, transparent 55%)",
        }}
      />

      <Container className="relative z-10 py-16">
        {/* Top section — brand + nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand block */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <FooterLogo />
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Premium athletic gear engineered for maximum performance and
              ultimate comfort. Minimalist design, uncompromising quality.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <SocialLink
                href="#"
                label="Instagram"
                icon="photo_camera"
              />
              <SocialLink
                href="#"
                label="Twitter / X"
                icon="tag"
              />
              <SocialLink
                href="#"
                label="YouTube"
                icon="play_circle"
              />
              <SocialLink
                href="#"
                label="Pinterest"
                icon="interests"
              />
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn
              title="Shop"
              links={[
                { label: "Men", href: "/men" },
                { label: "Women", href: "/women" },
                { label: "Collections", href: "/store" },
                { label: "New Arrivals", href: "/store" },
                { label: "Sale", href: "/store?badge=sale" },
              ]}
            />
            <FooterColumn
              title="Brand"
              links={[
                { label: "Our Story", href: "/" },
                { label: "Journal", href: "/" },
                { label: "Sustainability", href: "/" },
                { label: "Careers", href: "/" },
              ]}
            />
            <FooterColumn
              title="Support"
              links={[
                { label: "FAQ", href: "/" },
                { label: "Shipping & Returns", href: "/" },
                { label: "Size Guide", href: "/" },
                { label: "Contact Us", href: "/" },
              ]}
            />
          </div>
        </div>

        {/* Divider with cyan hairline */}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant/60">
            © {new Date().getFullYear()} Griple. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              className="text-xs text-on-surface-variant/60 hover:text-on-surface-variant transition-colors duration-300"
              href="/"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-xs text-on-surface-variant/60 hover:text-on-surface-variant transition-colors duration-300"
              href="/"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs text-on-surface-variant/60 hover:text-on-surface-variant transition-colors duration-300"
              href="/"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
