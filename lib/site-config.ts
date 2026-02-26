import type { Locale } from "next-intl";

export type { Locale };
export type AvailabilityStatus = "available" | "limited" | "booked";

export const siteConfig = {
  name: "zzoo.dev",
  url: "https://zzoo.dev",
  email: "zzoo.origin@gmail.com",
  availability: "available" as AvailabilityStatus,
  bookedUntil: undefined as string | undefined,
  social: {
    github: "https://github.com/zzoohub",
    linkedin: "https://linkedin.com/in/zzoo",
  },
} as const;
