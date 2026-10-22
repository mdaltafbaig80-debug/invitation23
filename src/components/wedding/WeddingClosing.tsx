import { Reveal } from "./Reveal";

/**
 * Wedding closing section matching user reference screenshot:
 * Features "We look forward to celebrating this special day with you.",
 * pink calligraphy "Thank You", and "DESIGNED BY @PRASHANTARTS".
 */
export function WeddingClosing() {
  return (
    <footer className="relative z-10 px-4 pt-16 pb-24 text-center md:pt-20 md:pb-28">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center">
        <p className="font-heading text-lg text-wedding-brown/90 italic md:text-xl">
          We look forward to celebrating this special day with you.
        </p>

        <h2 className="mt-8 font-calligraphy text-6xl text-[#DF3A77] tracking-normal drop-shadow-xs md:text-7xl">
          Thank You
        </h2>

        <p className="mt-12 font-sans text-xs font-medium tracking-[0.26em] text-stone-500 uppercase sm:text-sm">
          DESIGNED BY @PRASHANTARTS
        </p>
      </Reveal>
    </footer>
  );
}
