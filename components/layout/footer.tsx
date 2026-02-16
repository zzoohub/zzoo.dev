import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import { AvailabilityBadge } from "@/components/availability-badge";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/now", key: "now" },
  { href: "/contact", key: "contact" },
] as const;

const socialLinks = [
  { href: siteConfig.social.github, label: "GitHub", icon: Github },
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
  { href: "/rss.xml", label: "RSS", icon: Rss },
] as const;

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-mono text-base font-semibold text-foreground">
              zzoo.dev
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Solopreneur Developer
            </p>
            <div className="mt-4">
              <AvailabilityBadge size="sm" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("footer.navigation")}
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("footer.connect")}
            </p>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year} zzoo.dev</p>
        </div>
      </div>
    </footer>
  );
}
