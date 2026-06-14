import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import envelopeImg from "@/assets/envelope.png";
import sceneMet from "@/assets/scene-met.jpg";
import sceneJourney from "@/assets/scene-journey.jpg";
import sceneProposal from "@/assets/scene-proposal.jpg";
import sceneCelebration from "@/assets/scene-celebration.jpg";
import sceneFuture from "@/assets/scene-future.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amelia & Julian — A Wedding Film" },
      { name: "description", content: "An invitation, in five chapters. Join Amelia & Julian on September 21, 2026 in Tuscany." },
      { property: "og:title", content: "Amelia & Julian — A Wedding Film" },
      { property: "og:description", content: "An invitation, in five chapters." },
      { property: "og:image", content: sceneCelebration },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Invitation,
});

// ---------- Scene 1: dark screen + opening line ----------
function OpeningLine({ onContinue }: { onContinue: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black film-grain">
      <p
        className={`font-serif italic text-xl md:text-3xl text-foreground/80 text-center px-8 transition-opacity duration-[2500ms] ${show ? "opacity-100" : "opacity-0"}`}
      >
        Every love story begins somewhere.
      </p>
      <button
        onClick={onContinue}
        className={`mt-16 chapter-number transition-opacity duration-1000 hover:text-foreground ${show ? "opacity-70" : "opacity-0"}`}
      >
        Press to begin
      </button>
    </div>
  );
}

// ---------- Scene 2: envelope with wax seal ----------
function EnvelopeScene({ onOpen }: { onOpen: () => void }) {
  const [breaking, setBreaking] = useState(false);
  const handleOpen = () => {
    setBreaking(true);
    setTimeout(onOpen, 1400);
  };
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black vignette film-grain">
      <div className="chapter-number mb-10 animate-fade-in-slow">An Invitation</div>
      <button
        onClick={handleOpen}
        aria-label="Open invitation"
        className="relative group"
        style={{ animation: breaking ? "envelope-open 1.4s cubic-bezier(0.7,0,0.3,1) forwards" : undefined }}
      >
        <img
          src={envelopeImg}
          alt="Wax-sealed wedding envelope"
          width={520}
          height={520}
          className={`w-[80vw] max-w-[520px] h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] animate-fade-up ${breaking ? "" : "group-hover:scale-[1.02]"} transition-transform duration-700`}
          style={{ filter: "brightness(1.05)" }}
        />
      </button>
      <p className="mt-12 font-serif italic text-sm md:text-base text-muted-foreground animate-fade-in-slow">
        {breaking ? "" : "Click to break the seal"}
      </p>
    </div>
  );
}

// ---------- Scene 3: film-style title reveal ----------
function TitleReveal({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 6000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black vignette film-grain letterbox">
      <div className="chapter-number mb-8 animate-fade-in-slow" style={{ animationDelay: "0.2s" }}>
        A Wedding Film, in Five Chapters
      </div>
      <h1 className="font-display text-foreground text-center text-5xl md:text-8xl leading-tight animate-fade-up">
        Amelia
        <span className="block font-script text-gold text-3xl md:text-5xl my-3 md:my-5 animate-fade-in-slow" style={{ animationDelay: "1.5s" }}>
          &amp;
        </span>
        Julian
      </h1>
      <div
        className="mt-10 animate-letter-spread"
        style={{ animationDelay: "2.5s" }}
      >
        <p className="font-sans text-xs md:text-sm text-foreground/70 tracking-[0.4em] uppercase">
          September · Twenty Six · Twenty Twenty Six
        </p>
      </div>
    </div>
  );
}

// ---------- Reusable chapter scene ----------
type Chapter = {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  align?: "left" | "right" | "center";
};

function ChapterScene({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const align = chapter.align ?? (index % 2 ? "right" : "left");
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right md:pr-[8vw]"
        : "items-start text-left md:pl-[8vw]";

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden vignette film-grain"
    >
      {/* Parallax background */}
      <div className="absolute inset-0">
        <img
          src={chapter.image}
          alt={chapter.title}
          loading="lazy"
          width={1920}
          height={1080}
          className={`w-full h-full object-cover ${visible ? "animate-ken-burns" : ""}`}
          style={{ filter: "brightness(0.55) saturate(0.9) contrast(1.05)" }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 h-full w-full flex flex-col justify-end pb-[14vh] px-8 md:px-20 ${alignClass}`}>
        <div className={`max-w-xl transition-all duration-[1600ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="chapter-number mb-4">{chapter.number}</div>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05] mb-5">
            {chapter.title}
          </h2>
          <p className="font-script text-gold text-2xl md:text-3xl mb-6">{chapter.subtitle}</p>
          <p className="font-serif italic text-foreground/85 text-base md:text-lg leading-relaxed max-w-md">
            {chapter.body}
          </p>
        </div>
      </div>

      {/* Scene number marker */}
      <div className="absolute top-8 right-8 z-20 chapter-number opacity-60">
        Scene · {String(index + 1).padStart(2, "0")}
      </div>
    </section>
  );
}

// ---------- Scene break (cinematic transition) ----------
function SceneBreak({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="relative h-[55vh] w-full flex items-center justify-center bg-black film-grain"
    >
      <p
        className={`font-serif italic text-center text-foreground/80 text-2xl md:text-4xl px-8 max-w-3xl transition-all duration-[2200ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        “{text}”
      </p>
    </div>
  );
}

// ---------- RSVP ----------
function RSVPScene() {
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-black vignette film-grain py-24 px-6">
      <div className="max-w-xl w-full text-center">
        <div className="chapter-number mb-4">Will you join us?</div>
        <h2 className="font-display text-5xl md:text-6xl mb-3">R.S.V.P.</h2>
        <p className="font-script text-gold text-2xl mb-10">By the first of August</p>

        {submitted ? (
          <div className="animate-fade-up py-10">
            <p className="font-serif italic text-xl md:text-2xl text-foreground/90">
              {attending === "yes"
                ? "We can hardly wait to share this scene with you."
                : "We'll miss you in the frame — thank you for telling us."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5 text-left"
          >
            <div>
              <label className="chapter-number block mb-2">Your Name</label>
              <input
                required
                className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 font-serif text-lg text-foreground placeholder:text-muted-foreground/60"
                placeholder="As it should appear on the place card"
              />
            </div>
            <div>
              <label className="chapter-number block mb-2">Email</label>
              <input
                required
                type="email"
                className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 font-serif text-lg text-foreground placeholder:text-muted-foreground/60"
                placeholder="you@somewhere.com"
              />
            </div>
            <div>
              <label className="chapter-number block mb-3">Attendance</label>
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAttending(v)}
                    className={`flex-1 py-3 border font-serif italic text-lg transition-all ${
                      attending === v
                        ? "border-gold text-gold bg-gold/5"
                        : "border-border text-foreground/70 hover:border-foreground/40"
                    }`}
                  >
                    {v === "yes" ? "Joyfully accepts" : "Regretfully declines"}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!attending}
              className="w-full mt-6 py-4 border border-gold text-gold font-sans tracking-[0.4em] text-xs uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send Response
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ---------- Closing ----------
function ThankYouScene() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black vignette film-grain letterbox">
      <div className="text-center px-6">
        <div className="chapter-number mb-6 animate-flicker">Fin.</div>
        <h2 className="font-display text-5xl md:text-7xl mb-6">Thank You</h2>
        <p className="font-script text-gold text-3xl md:text-4xl mb-10">— A &amp; J</p>
        <p className="font-serif italic text-muted-foreground max-w-md mx-auto">
          For being a chapter in our story. The reel is still rolling, and the best scenes are the ones with you in them.
        </p>
      </div>
    </section>
  );
}

// ---------- Main ----------
type Stage = "opening" | "envelope" | "title" | "story";

function Invitation() {
  const [stage, setStage] = useState<Stage>("opening");

  const chapters: Chapter[] = [
    {
      number: "Chapter One",
      title: "How We Met",
      subtitle: "a rainy tuesday, late october",
      body: "A spilled coffee, an apology that lasted four hours, and a walk through streets that suddenly felt newly drawn. Neither of us went home that night the same person.",
      image: sceneMet,
    },
    {
      number: "Chapter Two",
      title: "The Journey",
      subtitle: "two passports, one suitcase",
      body: "Across coastlines and time zones, through arguments about maps and quiet mornings in unfamiliar kitchens. We learned the shape of each other slowly, the way oceans shape stone.",
      image: sceneJourney,
    },
    {
      number: "Chapter Three",
      title: "The Proposal",
      subtitle: "a courtyard in lecce",
      body: "It rained. Of course it rained. A ring box, a question whispered between heartbeats, and a yes that arrived before the words did.",
      image: sceneProposal,
    },
    {
      number: "Chapter Four",
      title: "The Celebration",
      subtitle: "september the twenty-sixth, twenty twenty-six",
      body: "Beneath an olive grove in Val d'Orcia, with the people who wrote themselves into our story. A long table, a longer night, and you — we hope — somewhere in the frame.",
      image: sceneCelebration,
    },
    {
      number: "Chapter Five",
      title: "The Future",
      subtitle: "to be continued —",
      body: "Whatever the next reel holds, we'll watch it together. Mornings, mountains, ordinary tuesdays. The credits, we suspect, are very far away.",
      image: sceneFuture,
    },
  ];

  return (
    <main className="bg-background text-foreground">
      {stage === "opening" && <OpeningLine onContinue={() => setStage("envelope")} />}
      {stage === "envelope" && <EnvelopeScene onOpen={() => setStage("title")} />}
      {stage === "title" && <TitleReveal onDone={() => setStage("story")} />}

      {stage === "story" && (
        <div className="animate-fade-in-slow">
          {/* Story header */}
          <section className="relative h-[60vh] flex items-center justify-center bg-black film-grain">
            <div className="text-center px-6">
              <div className="chapter-number mb-6 animate-flicker">Now Showing</div>
              <h1 className="font-display text-6xl md:text-9xl leading-none">
                Amelia
                <span className="block font-script text-gold text-4xl md:text-6xl my-2">&amp;</span>
                Julian
              </h1>
              <p className="mt-8 font-serif italic text-muted-foreground tracking-[0.3em] text-xs uppercase">
                Tuscany · Italy · MMXXVI
              </p>
            </div>
          </section>

          {chapters.map((c, i) => (
            <div key={c.number}>
              <ChapterScene chapter={c} index={i} />
              {i < chapters.length - 1 && (
                <SceneBreak
                  text={
                    [
                      "And then, the world tilted slightly.",
                      "Time folded itself in half.",
                      "The next morning arrived in colour.",
                      "Some scenes you don't write — they write you.",
                    ][i]
                  }
                />
              )}
            </div>
          ))}

          {/* Details strip */}
          <section className="bg-black film-grain py-24 px-6">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 text-center">
              {[
                { label: "The Date", value: "26 . 09 . 2026", note: "Saturday, four in the afternoon" },
                { label: "The Place", value: "Podere San Vito", note: "Val d'Orcia, Tuscany" },
                { label: "The Dress", value: "Black Tie, Optional", note: "Garden formal — wear what makes you feel like the lead role" },
              ].map((d) => (
                <div key={d.label}>
                  <div className="chapter-number mb-3">{d.label}</div>
                  <p className="font-display text-2xl md:text-3xl text-foreground mb-2">{d.value}</p>
                  <p className="font-serif italic text-muted-foreground text-sm">{d.note}</p>
                </div>
              ))}
            </div>
          </section>

          <RSVPScene />
          <ThankYouScene />
        </div>
      )}
    </main>
  );
}
