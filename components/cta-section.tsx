import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export function CTASection({
  title,
  subtitle,
  buttonText,
  mailtoSubject,
}: {
  title: string;
  subtitle?: string;
  buttonText: string;
  mailtoSubject?: string;
}) {
  const href = mailtoSubject
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent(mailtoSubject)}`
    : `/contact`;

  const isExternal = !!mailtoSubject;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        )}
        {isExternal ? (
          <a
            href={href}
            className="mt-8 inline-flex h-12 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            {buttonText}
          </a>
        ) : (
          <Link
            href={href}
            className="mt-8 inline-flex h-12 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
