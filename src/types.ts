export interface RSVP {
  id?: string;
  name: string;
  email?: string;
  adults: number;
  children: number;
  attendingCeremony: boolean;
  attendingLunch: boolean;
  attendingDinner: boolean;
  sleepingOnSite: boolean;
  dietaryRequirements?: string;
  message?: string;
  createdAt: number;
}
