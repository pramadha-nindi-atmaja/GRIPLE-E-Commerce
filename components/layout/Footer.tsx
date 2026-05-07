import Link from "next/link";

import { Container } from "@/components/shared/Container";

type FooterLink = { label: string; href: string };

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-label-caps text-label-caps text-inverse-on-surface">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              className="font-body-md text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
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

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="text-inverse-on-surface text-xl font-bold leading-tight tracking-[-0.015em]">
              Griple
            </div>
            <p className="font-body-md text-inverse-on-surface/70 text-sm max-w-xs">
              Premium athletic gear engineered for maximum performance and
              ultimate comfort. Minimalist design, uncompromising quality.
            </p>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              { label: "Men", href: "/men" },
              { label: "Women", href: "/women" },
              { label: "Collections", href: "/store" },
              { label: "New Arrivals", href: "/store" },
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

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-md text-xs text-inverse-on-surface/60">
            © {new Date().getFullYear()} Griple. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              className="font-body-md text-xs text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
              href="/"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-body-md text-xs text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
              href="/"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
