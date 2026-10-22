import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { BackgroundMusic } from "@/components/wedding/BackgroundMusic";
import { FallingPetals } from "@/components/wedding/FallingPetals";
import { MuhurthamCountdown } from "@/components/wedding/MuhurthamCountdown";
import { InvitationGallery } from "@/components/wedding/InvitationGallery";
import { WeddingClosing } from "@/components/wedding/WeddingClosing";
import { WeddingCoverPage } from "@/components/wedding/WeddingCoverPage";

export const Route = createFileRoute("/")({
  component: WeddingPage,
  head: () => ({
    meta: [
      {
        title: "Niharika G S & Likith T G — Wedding Invitation",
      },
      {
        name: "description",
        content:
          "Together, a beautiful beginning — join us for the Reception on Saturday, 21 November 2026 and the Muhurtham on Sunday, 22 November 2026 at Princess Golf, Palace Grounds, Gate No. 9, Bengaluru.",
      },
      {
        property: "og:title",
        content: "Niharika G S & Likith T G — Wedding Invitation",
      },
      {
        property: "og:description",
        content:
          "Join us for the Reception on 21 November and the Muhurtham on 22 November 2026 at Princess Golf, Palace Grounds, Gate No. 9, Bengaluru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function WeddingPage() {
  const [canScroll, setCanScroll] = useState(false);
  const [hasCoverEnded, setHasCoverEnded] = useState(false);
  const [hasTappedOpen, setHasTappedOpen] = useState(false);

  // Lock scrolling until 1-vid has completed playing
  useEffect(() => {
    if (!canScroll) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [canScroll]);

  return (
    <main className="wedding-page-bg relative min-h-screen overflow-x-clip">
      {/* Background music (activates on Tap to Open if audio file is present) */}
      <BackgroundMusic autoPlayTrigger={hasTappedOpen} />

      {/* Flower petals fall ONLY after completion of 1-vid */}
      {hasCoverEnded && <FallingPetals />}

      {/* 1. Cover Section (1-vid: starts on tap, stops at last frame, unlocks scroll and flowers on completion) */}
      <WeddingCoverPage
        onTapOpen={() => setHasTappedOpen(true)}
        onComplete={() => {
          setHasCoverEnded(true);
          setCanScroll(true);
        }}
      />

      {/* 2. Invitation Videos: 3-vid (Reception) & 4-vid (Muhurtham) */}
      <InvitationGallery />

      {/* 3. Muhurtham Countdown */}
      <MuhurthamCountdown />

      {/* 4. Closing & Family Blessings */}
      <WeddingClosing />
    </main>
  );
}
