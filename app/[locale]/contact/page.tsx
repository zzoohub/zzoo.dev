import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CopyButton } from "@/components/copy-button";
import { Mail, Github, Linkedin, ArrowRight, Send } from "lucide-react";

const externalLinks = [
  {
    href: siteConfig.social.github,
    label: "GitHub",
    description: "Check out my code",
    icon: Github,
  },
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    description: "Professional network",
    icon: Linkedin,
  },
];

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <AvailabilityBadge size="md" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Email card */}
        <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("email_label")}
          </p>
          <p className="mt-2 font-mono text-xl md:text-2xl">
            {siteConfig.email}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("response_time")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              {t("send_email")}
            </a>
            <CopyButton text={siteConfig.email} />
          </div>
        </div>

        {/* External links */}
        <div className="mt-10">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("connect")}
          </p>
          <div className="mt-4 space-y-3">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors duration-150 hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{link.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
