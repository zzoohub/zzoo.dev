import {
  Camera,
  SearchX,
  User,
  Shield,
  Zap,
  Globe,
  Code,
  Lock,
  Layers,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  "search-x": SearchX,
  user: User,
  shield: Shield,
  zap: Zap,
  globe: Globe,
  code: Code,
  lock: Lock,
  layers: Layers,
};

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export function FeatureGrid({
  features,
  heading,
}: {
  features: Feature[];
  heading: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon ? iconMap[feature.icon] : null;
          return (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              {Icon && (
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
              )}
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
