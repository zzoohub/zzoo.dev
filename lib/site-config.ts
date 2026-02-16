export type AvailabilityStatus = "available" | "limited" | "booked";
export type Locale = "en" | "ko";

export const siteConfig = {
  name: "zzoo.dev",
  url: "https://zzoo.dev",
  email: "hello@zzoo.dev",
  availability: "available" as AvailabilityStatus,
  bookedUntil: undefined as string | undefined,
  social: {
    github: "https://github.com/zzoo",
    linkedin: "https://linkedin.com/in/zzoo",
  },
  calLink: "https://cal.com/zzoo",
} as const;
