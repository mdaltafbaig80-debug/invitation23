import { COUPLE, INVITATIONS } from "./wedding-data";
import { GoldDivider, ToranCorner } from "./Ornaments";
import { Reveal } from "./Reveal";

type WeddingHeroProps = {
  /** Opens the full-screen viewer on the given invitation index. */
  onOpenInvitation: (index: number) => void;
};

/** Full-screen opening section with the couple's names and the announcement card. */
export function WeddingHero({ onOpenInvitation }: WeddingHeroProps) {
  const heroCard = INVITATIONS[0];

  const scrollToInvitations = () => {
    document.getElementById("invitations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-24 text-center">
      <ToranCorner className="absolute top-0 left-0 w-32 opacity-95 sm:w-44 md:w-56" />
      <ToranCorner mirrored className="absolute top-0 right-0 w-32 opacity-95 sm:w-44 md:w-56" />

      <Reveal className="relative mx-auto max-w-2xl">
        <p className="font-heading text-xs font-semibold tracking-[0.4em] text-wedding-olive uppercase sm:text-sm">
          Together, a beautiful beginning
        </p>
        <h1 className="mt-6">
          <span className="block font-calligraphy text-6xl leading-[1.15] text-wedding-red sm:text-7xl md:text-8xl">
            {COUPLE.bride}
          </span>
          <span className="my-1 block font-heading text-3xl text-wedding-gold italic md:text-4xl">
            &amp;
          </span>
          <span className="block font-calligraphy text-6xl leading-[1.15] text-wedding-red sm:text-7xl md:text-8xl">
            {COUPLE.groom}
          </span>
        </h1>
        <p className="mt-5 font-heading text-sm font-semibold tracking-[0.4em] text-wedding-olive uppercase sm:text-base">
          Are getting married
        </p>
        <GoldDivider className="mx-auto mt-7" />
      </Reveal>

      {heroCard ? (
        <Reveal delay={150} className="relative mt-12">
          <div className="group relative inline-block">
            <button
              type="button"
              onClick={() => onOpenInvitation(1)}
              aria-label="Open the wedding invitation"
              className="wedding-frame relative cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:ring-offset-2 focus-visible:ring-offset-wedding-ivory focus-visible:outline-none"
            >
              <img
                src={heroCard.src}
                alt={heroCard.alt}
                width={heroCard.width}
                height={heroCard.height}
                loading="eager"
                decoding="async"
                className="h-auto w-[min(62vw,15rem)] sm:w-60 md:w-72"
              />
              <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                <span className="animate-tap-pulse flex items-center gap-1.5 rounded-full border border-wedding-gold bg-wedding-red px-4 py-1.5 text-xs font-bold tracking-widest text-wedding-cream uppercase shadow-lg">
                  ✨ Tap to Open
                </span>
              </div>
            </button>
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={280}>
        <button
          type="button"
          onClick={() => onOpenInvitation(1)}
          className="mt-12 rounded-full border border-wedding-gold bg-wedding-cream/90 px-8 py-3 font-heading text-sm font-semibold tracking-[0.22em] text-wedding-red uppercase shadow-[0_18px_40px_-24px_rgba(173,56,47,0.5)] transition-colors hover:bg-wedding-peach focus-visible:ring-2 focus-visible:ring-wedding-gold focus-visible:ring-offset-2 focus-visible:ring-offset-wedding-ivory focus-visible:outline-none sm:text-base"
        >
          View Wedding Invitation
        </button>
      </Reveal>
    </section>
  );
}
