import { siteConfig } from "@/lib/site-config";
import { Github, Linkedin, Mail } from "lucide-react";
import { AvailabilityBadge } from "@/components/availability-badge";

const socialLinks = [
  { href: siteConfig.social.github, label: "GitHub", icon: Github },
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <p className="font-mono text-base font-semibold text-foreground">
              zzoo.dev
            </p>
            <AvailabilityBadge size="sm" />
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {year} zzoo.dev</p>
        </div>
      </div>
    </footer>
  );
}
