import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CopyButton } from "@/components/copy-button";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const channels = [
  { href: siteConfig.social.github, label: "GitHub", icon: Github },
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: Linkedin },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactPageContent />;
}

function ContactPageContent() {
  const t = useTranslations("contact");

  return (
    <section className="px-4 py-12 sm:px-6 md:flex md:min-h-[calc(100svh-4rem)] md:items-center md:justify-center md:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-[32px] font-bold tracking-tight md:text-center">
          {t("title")}
        </h1>

        {/* Email */}
        <div className="mt-1 md:mt-12 md:text-center">
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-mono text-[28px] font-bold tracking-tighter transition-opacity duration-200 hover:opacity-70 sm:text-4xl md:text-[40px]"
          >
            {siteConfig.email}
          </a>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-12 md:justify-center">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            {t("send_email")}
          </a>
          <CopyButton
            text={siteConfig.email}
            className="h-12 rounded-full px-6"
          />
        </div>

        {/* Availability */}
        <div className="mt-8 md:mt-16 md:flex md:justify-center">
          <AvailabilityBadge size="md" />
        </div>

        {/* Social Links — Desktop: horizontal with dividers */}
        <div className="mt-10 hidden items-center justify-center gap-6 md:flex">
          {channels.map((channel, i) => (
            <Fragment key={channel.label}>
              {i > 0 && <div className="h-4 w-px bg-border" />}
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <channel.icon className="h-[18px] w-[18px]" />
                <span className="font-mono text-sm uppercase tracking-wider">
                  {channel.label}
                </span>
              </a>
            </Fragment>
          ))}
        </div>

        {/* Social Links — Mobile: stacked rows */}
        <div className="mt-10 flex flex-col md:hidden">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 items-center justify-between border-b border-border transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <channel.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-sm font-medium">{channel.label}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
