import { Reveal } from "./Reveal";
import { FloralDangle, GoldDivider } from "./Ornaments";

function EventCard({
  title,
  day,
  date,
  time,
  children,
}: {
  title: string;
  day: string;
  date: string;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="h-full">
      <article className="wedding-card flex h-full flex-col items-center px-6 py-10 text-center md:px-10">
        <h3 className="font-calligraphy text-4xl text-wedding-red md:text-5xl">{title}</h3>
        <GoldDivider className="mt-3 w-32" />
        <p className="mt-5 font-heading text-xl text-wedding-olive md:text-2xl">{day}</p>
        <p className="font-heading text-2xl font-semibold text-wedding-red md:text-3xl">{date}</p>
        <p className="mt-2 font-heading text-lg tracking-[0.2em] text-wedding-olive uppercase">
          {time}
        </p>
        <FloralDangle className="mt-5" />
        <div className="mt-4 font-heading text-lg leading-relaxed text-wedding-brown">
          {children}
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Princess%20Golf%2C%20Palace%20Grounds%2C%20Gate%20No.%209%2C%20Bengaluru%20560006"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 font-heading text-base font-semibold text-wedding-olive underline decoration-wedding-gold decoration-1 underline-offset-4 transition-colors hover:text-wedding-red"
        >
          Get Directions
        </a>
      </article>
    </Reveal>
  );
}

/** Reception and Muhurtham details, side by side on desktop. */
export function EventDetails() {
  return (
    <section id="events" className="relative z-10 scroll-mt-8 px-4 py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-calligraphy text-5xl text-wedding-red md:text-6xl">The Celebrations</h2>
        <GoldDivider className="mx-auto mt-4" />
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
        <EventCard title="Reception" day="Saturday" date="21 November 2026" time="6:30 PM onwards">
          <p className="font-semibold text-wedding-olive">Princess Golf</p>
          <p>Palace Grounds, Gate No. 9,</p>
          <p>Bengaluru - 560006.</p>
        </EventCard>
        <EventCard title="Muhurtham" day="Sunday" date="22 November 2026" time="9:00 AM onwards">
          <p className="font-semibold text-wedding-olive">Princess Golf</p>
          <p>Palace Grounds, Gate No. 9,</p>
          <p>Bengaluru - 560006.</p>
        </EventCard>
      </div>
    </section>
  );
}
