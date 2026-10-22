export const COUPLE = {
  bride: "Niharika G S",
  groom: "Likith T G",
} as const;

/** Muhurtham: Sunday, 22 November 2026, 9:00 AM IST (Asia/Kolkata). */
export const MUHURTHAM_ISO = "2026-11-22T09:00:00+05:30";

export const VENUE_NAME = "Princess Golf";
export const VENUE_LINES = ["Palace Grounds, Gate No. 9,", "Bengaluru - 560006."];

export type Invitation = {
  src: string; // Video file URL
  poster: string; // Fallback / initial frame image
  title: string;
  alt: string;
  width: number;
  height: number;
  mapUrl?: string;
  mapLabel?: string;
};

/**
 * Sequential wedding invitation videos:
 * 1 -> Cover Page (full screen initial image, runs on tap, stops at last frame)
 * 2 -> Reception (3-vid.mp4)
 * 3 -> Muhurtham (4-vid.mp4)
 * (2-vid has been removed)
 */
export const INVITATIONS: Invitation[] = [
  {
    src: "/invitations/1-vid.mp4",
    poster: "/invitations/1-initial.jpeg",
    title: "The Wedding Announcement",
    alt: "Wedding announcement video of Niharika G S and Likith T G",
    width: 1080,
    height: 1920,
  },
  {
    src: "/invitations/3-vid.mp4",
    poster: "",
    title: "Reception",
    alt: "Reception invitation video for Saturday, 21 November 2026",
    width: 1080,
    height: 1920,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Princess%20Golf%2C%20Palace%20Grounds%2C%20Gate%20No.%209%2C%20Bengaluru%20560006",
    mapLabel: "Reception Venue Map",
  },
  {
    src: "/invitations/4-vid.mp4",
    poster: "",
    title: "Muhurtham",
    alt: "Muhurtham invitation video for Sunday, 22 November 2026",
    width: 1080,
    height: 1920,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Princess%20Golf%2C%20Palace%20Grounds%2C%20Gate%20No.%209%2C%20Bengaluru%20560006",
    mapLabel: "Marriage Venue Map",
  },
];
