import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { BackgroundMusic } from "@/components/wedding/BackgroundMusic";
import { FallingPetals } from "@/components/wedding/FallingPetals";
import { MuhurthamCountdown } from "@/components/wedding/MuhurthamCountdown";
import { InvitationGallery } from "@/components/wedding/InvitationGallery";
import { WeddingClosing } from "@/components/wedding/WeddingClosing";
import { WeddingCoverPage } from "@/components/wedding/WeddingCoverPage";
import { ScratchCard } from "@/components/wedding/ScratchCard";
import { BestComplimentsVideo } from "@/components/wedding/BestComplimentsVideo";

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

type WeddingStage = "cover" | "scratch" | "revealed";

function WeddingPage() {
  const [canScroll, setCanScroll] = useState(false);
  const [hasCoverEnded, setHasCoverEnded] = useState(false);
  const [hasTappedOpen, setHasTappedOpen] = useState(false);
  const [stage, setStage] = useState<WeddingStage>("cover");

  // Lock scrolling until 1-vid and Scratch Card have completed
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

      {/* Flower petals fall once 1-vid finishes and scratch card begins */}
      {hasCoverEnded && <FallingPetals />}

      {/* 1. Cover Section (1-vid: starts on tap, on completion blurs out and transitions to Scratch Card) */}
      {stage === "cover" && (
        <WeddingCoverPage
          onTapOpen={() => setHasTappedOpen(true)}
          onComplete={() => {
            setHasCoverEnded(true);
            setStage("scratch");
          }}
        />
      )}

      {/* 2. Scratch Card (Interactive scratch-off revealing the heartfelt message, then blurs out in 5s) */}
      {stage === "scratch" && (
        <ScratchCard
          onComplete={() => {
            setStage("revealed");
            setCanScroll(true);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      )}

      {/* 3. Main Invitation Experience:
          - footimg appears first
          - as user scrolls down from footimg, 3-vid (Reception) and 4-vid (Muhurtham) appear and play
          - Muhurtham countdown
          - Wedding closing
      */}
      {(stage === "scratch" || stage === "revealed") && (
        <div
          className={`transition-all duration-1000 ${
            stage === "revealed" ? "opacity-100 filter blur-0" : "opacity-0 pointer-events-none"
          }`}
        >
          <InvitationGallery />
          <MuhurthamCountdown />
          {/* 5-vid: Best Compliments & Family Blessings right before Thank You closing */}
          <BestComplimentsVideo />
          <WeddingClosing />
        </div>
      )}
    </main>
  );
}
