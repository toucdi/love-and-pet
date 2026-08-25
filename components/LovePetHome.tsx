"use client";

/* The four artworks are hosted on an external CDN, so they are rendered with
   plain <img> instead of next/image (no remotePatterns config required). */
/* eslint-disable @next/next/no-img-element */

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* ========================================================================== */
/*  Dati reali                                                                */
/* ========================================================================== */

const BUSINESS = {
  name: "Love&Pet",
  tagline: "Allevamento Barboncini Toy · Toelettatura & Spa · Addestramento",
  owner: "Manuela Senzani",
  street: "Viale Anchise 49",
  area: "Colli di Enea",
  city: "Roma",
  phones: [
    { label: "06 93377569", href: "tel:+390693377569" },
    { label: "340 3114143", href: "tel:+393403114143" },
  ],
  whatsapp: "https://wa.me/393403114143",
  email: "senzani.manuela@gmail.com",
  instagram: "https://www.instagram.com/manuelasenzani_official",
  facebook: "https://www.facebook.com/manuela.barbocinitoy",
  maps: "https://www.google.com/maps/search/?api=1&query=Viale+Anchise+49%2C+00134+Roma",
} as const;

const IMG = {
  hero: "https://v3b.fal.media/files/b/0aa7c496/r3wEt_6WzBulUW9vHNWG1_jrUrNRjT.png",
  duo: "https://v3b.fal.media/files/b/0aa7c4ad/l65SEI5HMvlOdcsOl8OCZ_PiYXSw0k.png",
  spa: "https://v3b.fal.media/files/b/0aa7c58a/IArDSCLA_-TQAwqTpsTMH_GHYlL74u.png",
  mesh: "https://v3b.fal.media/files/b/0aa7c49b/jYXftxwdoSSnHhBk-ON-S_knxavIgo.png",
  manuela: "/images/manuela.jpg",
} as const;

const COAT_IMAGES = {
  Albicocca: "https://v3b.fal.media/files/b/0aa7c575/ZW_WxhZ8rrXsPlfazwhKc_1M698UKt.png",
  Rosso: "https://v3b.fal.media/files/b/0aa7c58c/stmS6GyI3izhJ34EdQ4cg_zcyU4ZW0.png",
  Nero: "https://v3b.fal.media/files/b/0aa7c579/HEpCdIU427CZUd_c-Zaza_InlfMTni.png",
  Bianco: "https://v3b.fal.media/files/b/0aa7c57b/WXZW7DEjDw6aZ2f0RDN8p_8ey3W0vD.png",
  Champagne: "https://v3b.fal.media/files/b/0aa7c586/3BGEFr13aTUxiNA_4C-Xs_AHq9QRJo.png",
} as const;

const NAV = [
  { label: "I nostri cuccioli", href: "#cuccioli" },
  { label: "Servizi", href: "#servizi" },
  { label: "Spa", href: "#spa" },
  { label: "Testimonianze", href: "#testimonianze" },
  { label: "Contatti", href: "#contatti" },
];

const HERO_WORDS = [
  "Barboncini",
  "Toy",
  "cresciuti",
  "con",
  "amore,",
  "a",
  "Roma",
];
const HERO_ACCENT_INDEX = 4;

const STATS = [
  { count: 10000, display: "10.000", suffix: "+", label: "amici a quattro zampe passati da noi" },
  { count: 20, display: "20", suffix: "+", label: "anni di passione e di selezione" },
  { count: 4, display: "4", suffix: "", label: "servizi per il tuo cane, sotto lo stesso tetto" },
  { count: 100, display: "100", suffix: "%", label: "cuccioli socializzati in casa" },
];

const COATS = [
  {
    name: "Albicocca",
    note: "Il mantello più richiesto: caldo, dorato, con riflessi che si schiariscono d'estate.",
    swatch: "linear-gradient(140deg, #F2C79A 0%, #E0A263 52%, #C07F3F 100%)",
  },
  {
    name: "Rosso",
    note: "Intenso e vellutato. Il colore più difficile da fissare, il nostro piccolo vanto.",
    swatch: "linear-gradient(140deg, #C9714A 0%, #A44B28 55%, #7A3318 100%)",
  },
  {
    name: "Nero",
    note: "Lucido come la seta. Elegante in ogni stagione, chiede spazzola e costanza.",
    swatch: "linear-gradient(140deg, #4A403B 0%, #241D1A 55%, #0F0B0A 100%)",
  },
  {
    name: "Bianco",
    note: "Candido e luminoso. Il preferito di chi ama un cane sempre impeccabile.",
    swatch: "linear-gradient(140deg, #FFFFFF 0%, #F6F0E6 52%, #E2D6C4 100%)",
  },
  {
    name: "Champagne",
    note: "Un beige chiarissimo, quasi perlato. Delicatissimo e raro da trovare.",
    swatch: "linear-gradient(140deg, #F7EAD2 0%, #E5CFA6 52%, #CBAF80 100%)",
  },
];

const SERVICES = [
  {
    id: "allevamento",
    title: "Allevamento",
    text: "Cuccioli Toy e Nano selezionati con cura, nati e cresciuti in casa e consegnati con pedigree, microchip e vaccinazioni in regola.",
    chips: ["Pedigree ENC/FCI", "Microchip", "Prima vaccinazione"],
    icon: "paw",
  },
  {
    id: "toelettatura",
    title: "Toelettatura & Spa",
    text: "Un trattamento completo pensato per il pelo riccio: bagno, taglio a forbice, asciugatura e un'ora di coccole. Su appuntamento.",
    chips: ["Bagno & taglio", "Prodotti delicati", "Su misura"],
    icon: "spa",
  },
  {
    id: "addestramento",
    title: "Addestramento & Agility",
    text: "Educazione di base e percorsi di agility per costruire un cane sicuro, equilibrato e felice di collaborare con te.",
    chips: ["Educazione base", "Agility", "Rinforzo positivo"],
    icon: "agility",
  },
  {
    id: "dogsitting",
    title: "Dog Sitting & Educazione",
    text: "Quando sei via, il tuo cane resta con noi: stessa routine, stesse attenzioni, stesso divano di casa sua.",
    chips: ["Soggiorni brevi", "Passeggiate", "Aggiornamenti quotidiani"],
    icon: "home",
  },
] as const;

const MARQUEE = [
  "Barboncini Toy",
  "Toelettatura & Spa",
  "Addestramento",
  "Dog Sitting",
  "Colli di Enea — Roma",
];

const TREATMENTS = [
  { title: "Bagno", note: "Prodotti delicati, scelti in base al mantello e alla pelle." },
  { title: "Spuntatura e taglio", note: "Forbice e tosatrice, nello stile che preferisci." },
  { title: "Asciugatura", note: "Asciugatura e messa in piega per un riccio definito." },
  { title: "Cura delle unghie", note: "Taglio e limatura, con calma e senza stress." },
  { title: "Pulizia delle orecchie", note: "Controllo e pulizia: fondamentali nel barboncino." },
];

const STEPS = [
  {
    title: "Vieni a conoscerci",
    text: "Ci trovi a Viale Anchise 49, ai Colli di Enea. Fissiamo un appuntamento e ci prendiamo tutto il tempo per parlare: della tua casa, delle tue giornate, del cane giusto per te.",
  },
  {
    title: "Conosci i genitori",
    text: "Ti presentiamo mamma e papà del cucciolo. Vedere gli adulti è il modo più onesto per capire come sarà da grande: taglia, mantello, carattere.",
  },
  {
    title: "Prenota il tuo cucciolo",
    text: "Scegli il mantello e prenoti con un piccolo acconto. Da lì ti arrivano foto e aggiornamenti, settimana dopo settimana, fino al momento giusto per il distacco.",
  },
  {
    title: "Portalo a casa",
    text: "A due mesi parte con te: vaccinato, microchippato, sverminato e con pedigree. E con il nostro numero in tasca, per qualsiasi dubbio, per sempre.",
  },
];

const QUOTES = [
  {
    text: "Nina è arrivata a casa serena e già socializzata: non ha pianto neanche la prima notte. Si vede che i cuccioli crescono in famiglia, non in un box.",
    name: "Giulia R.",
    city: "Roma",
    initials: "GR",
    photo: "https://v3b.fal.media/files/b/0aa7c58c/mcGCr6khStSC3DWLuD6t__mCPYCTxx.png",
  },
  {
    text: "Manuela ci ha seguiti passo passo, prima e dopo l'adozione. Una professionalità rara, e una disponibilità che oggi non trovi quasi più.",
    name: "Marco T.",
    city: "Ciampino",
    initials: "MT",
    photo: "https://v3b.fal.media/files/b/0aa7c58f/rrebKS7bTnnq0OXN_vTzy_0kY74tgr.png",
  },
  {
    text: "Porto Otto in toelettatura ogni mese. Esce profumato, pettinato e felice — e credo che questo dica tutto sul posto in cui l'ho lasciato.",
    name: "Federica P.",
    city: "Pomezia",
    initials: "FP",
    photo: "https://v3b.fal.media/files/b/0aa7c591/sm2TzsggdRqstl6IJ1S5g_Jprd8c7x.png",
  },
];

/* ========================================================================== */
/*  Icone                                                                     */
/* ========================================================================== */

type IconProps = { className?: string };

function PawIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <ellipse cx="7.2" cy="10" rx="2.2" ry="2.9" transform="rotate(-20 7.2 10)" />
      <ellipse cx="11.3" cy="7.1" rx="2.1" ry="2.8" />
      <ellipse cx="15.8" cy="7.8" rx="2.1" ry="2.8" transform="rotate(18 15.8 7.8)" />
      <ellipse cx="19" cy="11.8" rx="1.9" ry="2.5" transform="rotate(36 19 11.8)" />
      <path d="M13 13.2c2.8 0 5.4 1.9 5.9 4.2.5 2.1-1 3.8-3.2 3.8-1.1 0-1.9-.4-2.7-.4s-1.6.4-2.7.4c-2.2 0-3.7-1.7-3.2-3.8.5-2.3 3.1-4.2 5.9-4.2Z" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M20.2 15.6v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.5 4.2a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9L7.8 9.2a14 14 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.9Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 2.6a6.9 6.9 0 0 0-6.9 6.9c0 5 6.2 11.4 6.5 11.7.1.1.3.2.4.2s.3-.1.4-.2c.3-.3 6.5-6.7 6.5-11.7A6.9 6.9 0 0 0 12 2.6Zm0 9.7a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M20 4.8H4A1.8 1.8 0 0 0 2.2 6.6v10.8A1.8 1.8 0 0 0 4 19.2h16a1.8 1.8 0 0 0 1.8-1.8V6.6A1.8 1.8 0 0 0 20 4.8Zm-.6 2.2L12 12.2 4.6 7h14.8ZM4 17.2V8.5l7.4 5.2c.36.25.84.25 1.2 0L20 8.5v8.7H4Z" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm.9 9.1 3.3 2a1 1 0 1 1-1 1.7l-3.7-2.2a1 1 0 0 1-.5-.9V6.9a1 1 0 0 1 2 0v4.7Z" />
    </svg>
  );
}

function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m12 2.9 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.3l6.1-.9L12 2.9Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.63.07 4.81s-.01 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.63.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.56 2.2 15.18 2.2 12s.01-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.21 8.82 2.2 12 2.2Zm0 1.8c-3.13 0-3.5.01-4.73.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.23-.07 1.6-.07 4.15s.01 2.92.07 4.15c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.23.06 1.6.07 4.73.07s3.5-.01 4.73-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.23.07-1.6.07-4.15s-.01-2.92-.07-4.15c-.04-.9-.19-1.39-.32-1.71a2.9 2.9 0 0 0-.69-1.06 2.9 2.9 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.5 4.01 15.13 4 12 4Zm0 3.03a4.97 4.97 0 1 1 0 9.94 4.97 4.97 0 0 1 0-9.94Zm0 8.2a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46Zm6.34-8.4a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M8.6 7H17v8.4" />
    </svg>
  );
}

/** Line-art icone servizi: i tratti vengono "disegnati" da GSAP allo scroll. */
function ServiceIcon({ name }: { name: (typeof SERVICES)[number]["icon"] }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, focusable: "false" as const };

  if (name === "paw") {
    return (
      <svg {...common} data-draw>
        <ellipse cx="6.6" cy="9.8" rx="2.1" ry="2.7" />
        <ellipse cx="10.7" cy="6.8" rx="2" ry="2.7" />
        <ellipse cx="15.2" cy="7.4" rx="2" ry="2.7" />
        <ellipse cx="18.6" cy="11.2" rx="1.9" ry="2.4" />
        <path d="M12.4 12.8c2.7 0 5.2 1.9 5.7 4.1.5 2.1-.9 3.8-3 3.8-1.1 0-1.9-.4-2.7-.4s-1.6.4-2.7.4c-2.1 0-3.5-1.7-3-3.8.5-2.2 3-4.1 5.7-4.1Z" />
      </svg>
    );
  }

  if (name === "spa") {
    return (
      <svg {...common} data-draw>
        <path d="M12 3.4c3.2 3.6 5.2 6.3 5.2 8.8A5.2 5.2 0 0 1 12 17.4a5.2 5.2 0 0 1-5.2-5.2c0-2.5 2-5.2 5.2-8.8Z" />
        <circle cx="5.8" cy="17.6" r="2" />
        <circle cx="18.4" cy="18.2" r="1.5" />
        <circle cx="10" cy="21" r="1" />
      </svg>
    );
  }

  if (name === "agility") {
    return (
      <svg {...common} data-draw>
        <path d="M3 18.6h18" />
        <path d="M4.8 18.6C4.8 12 8 8 12 8s7.2 4 7.2 10.6" />
        <circle cx="12" cy="4.6" r="2.4" />
      </svg>
    );
  }

  return (
    <svg {...common} data-draw>
      <path d="M4 10.6 12 4.2l8 6.4V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19v-8.4Z" />
      <path d="M12 17.6c-1.9-1.3-3.3-2.4-3.3-3.9a1.8 1.8 0 0 1 3.3-.9 1.8 1.8 0 0 1 3.3.9c0 1.5-1.4 2.6-3.3 3.9Z" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="lp-quote__stars" role="img" aria-label="Valutazione: 5 stelle su 5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <>
      <span className="lp-logo__mark" aria-hidden="true">
        <PawIcon />
      </span>
      <span>
        Love<span className="lp-logo__amp">&amp;</span>Pet
      </span>
    </>
  );
}

/* ========================================================================== */
/*  Componente principale                                                     */
/* ========================================================================== */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function LovePetHome() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  const [solidHeader, setSolidHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionKey, setMotionKey] = useState(0);

  const fmReduced = useReducedMotion() ?? false;

  // Il browser scarica l'immagine hero il prima possibile (LCP).
  ReactDOM.preload(IMG.hero, { as: "image", fetchPriority: "high" });

  /* ---------------------------------------------------------- reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setMotionKey((k) => k + 1);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ------------------------------------------------- Lenis + GSAP ScrollTrigger */
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let ctx: ReturnType<typeof gsap.context> | null = null;

    const refresh = () => ScrollTrigger.refresh();

    try {
      gsap.registerPlugin(ScrollTrigger);
      root.dataset.anim = reduced ? "reduced" : "motion";

      /* --- 1. smooth scroll: lerp 0.1, RAF guidato dal ticker GSAP, off con
             prefers-reduced-motion --- */
      if (!reduced) {
        lenis = new Lenis({ lerp: 0.1, autoRaf: false, smoothWheel: true });
        lenisRef.current = lenis;
        lenis.on("scroll", () => ScrollTrigger.update());
        ticker = (time: number) => lenisRef.current?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      ctx = gsap.context(() => {
        const ease = "power3.out";

        /* --- hero: reveal parola per parola --- */
        const words = gsap.utils.toArray<HTMLElement>(".lp-word__i");
        if (words.length) {
          gsap.fromTo(
            words,
            { y: 0, yPercent: reduced ? 0 : 112, opacity: 0 },
            {
              y: 0,
              yPercent: 0,
              opacity: 1,
              duration: reduced ? 0.5 : 1.15,
              ease: reduced ? "none" : "expo.out",
              stagger: reduced ? 0.02 : 0.075,
              delay: reduced ? 0 : 0.12,
            },
          );
        }

        /* --- hero: badge, testo, CTA, foto --- */
        const heroBits = gsap.utils.toArray<HTMLElement>('[data-reveal="hero"]');
        if (heroBits.length) {
          gsap.fromTo(
            heroBits,
            { opacity: 0, y: reduced ? 0 : 28 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.5 : 1,
              ease,
              stagger: reduced ? 0.02 : 0.1,
              delay: reduced ? 0.05 : 0.42,
            },
          );
        }

        /* --- reveal allo scroll, in gruppi con stagger --- */
        const handled = new WeakSet<Element>();
        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          const items = gsap.utils.toArray<HTMLElement>(
            group.querySelectorAll('[data-reveal="up"]'),
          );
          if (!items.length) return;
          items.forEach((el) => handled.add(el));
          gsap.fromTo(
            items,
            { opacity: 0, y: reduced ? 0 : 36 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.5 : 1.05,
              ease,
              stagger: reduced ? 0.02 : 0.09,
              scrollTrigger: { trigger: group, start: "top 84%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
          if (handled.has(el)) return;
          gsap.fromTo(
            el,
            { opacity: 0, y: reduced ? 0 : 36 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.5 : 1.05,
              ease,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });

        /* --- parallax cinematografico (solo a movimento pieno) --- */
        if (!reduced) {
          const hero = root.querySelector<HTMLElement>(".lp-hero");
          if (hero) {
            const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
            gsap.to('[data-parallax="bg"]', { yPercent: 12, ease: "none", scrollTrigger: scrub });
            gsap.to('[data-parallax="media"]', { yPercent: -8, ease: "none", scrollTrigger: scrub });
            gsap.to('[data-parallax="copy"]', {
              yPercent: -5,
              opacity: 0.3,
              ease: "none",
              scrollTrigger: scrub,
            });
          }
        }

        /* --- contatori animati --- */
        if (!reduced) {
          const nf = new Intl.NumberFormat("it-IT");
          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            const target = Number(el.dataset.count);
            if (!Number.isFinite(target)) return;
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: target,
              duration: 2.2,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
              onUpdate: () => {
                el.textContent = nf.format(Math.round(proxy.v));
              },
            });
          });
        }

        /* --- icone servizi: line-art che si disegna --- */
        if (!reduced) {
          gsap.utils.toArray<SVGSVGElement>("[data-draw]").forEach((svg) => {
            const shapes = Array.from(
              svg.querySelectorAll<SVGGeometryElement>("path, circle, ellipse, line"),
            );
            shapes.forEach((shape, i) => {
              const len = typeof shape.getTotalLength === "function" ? shape.getTotalLength() : 0;
              if (!len) return;
              gsap.fromTo(
                shape,
                { strokeDasharray: len, strokeDashoffset: len },
                {
                  strokeDashoffset: 0,
                  duration: 1.1,
                  delay: i * 0.08,
                  ease: "power2.out",
                  scrollTrigger: { trigger: svg, start: "top 92%", once: true },
                  onComplete: () => gsap.set(shape, { clearProps: "strokeDasharray,strokeDashoffset" }),
                },
              );
            });
          });
        }

        /* --- timeline adozione: la linea si riempie, gli step si accendono --- */
        const track = root.querySelector<HTMLElement>(".lp-steps__track");
        const fill = root.querySelector<HTMLElement>(".lp-steps__fill");
        const steps = gsap.utils.toArray<HTMLElement>(".lp-step");

        if (reduced) {
          if (fill) fill.style.transform = "none";
          steps.forEach((s) => s.setAttribute("data-active", "true"));
        } else {
          if (track && fill) {
            ScrollTrigger.create({
              trigger: track,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.5,
              onUpdate: (self) => {
                const horizontal = window.matchMedia("(min-width: 940px)").matches;
                const p = self.progress;
                fill.style.transform = horizontal ? `scaleX(${p})` : `scaleY(${p})`;
              },
            });
          }
          steps.forEach((step) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top 76%",
              once: true,
              onEnter: () => step.setAttribute("data-active", "true"),
            });
          });
        }
      }, root);

      /* Font e immagini remote arrivano dopo il primo layout: ricalcola. */
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh).catch(() => {});
    } catch {
      // Se qualcosa va storto, il contenuto resta comunque visibile.
      root.dataset.anim = "off";
    }

    return () => {
      window.removeEventListener("load", refresh);
      if (ticker) gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [motionKey]);

  /* ------------------------------------------------------------- header solido */
  useEffect(() => {
    const onScroll = () => setSolidHeader(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------------------------------- ancore con smooth scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const dest = document.querySelector<HTMLElement>(hash);
      if (!dest) return;

      event.preventDefault();
      setMenuOpen(false);

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(dest, { offset: -76, duration: 1.2 });
      } else {
        dest.scrollIntoView({ behavior: "auto", block: "start" });
      }
      if (dest.hasAttribute("tabindex")) dest.focus({ preventScroll: true });
      window.history.replaceState(null, "", hash);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  /* ------------------------------------------- menu mobile: scroll lock + esc */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* --------------------------------------------------- spotlight caldo su card */
  const onSpotMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  const menuEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="lp" ref={rootRef}>
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".lp [data-reveal]{opacity:1!important}.lp .lp-word__i{opacity:1!important;transform:none!important}.lp .lp-steps__fill{transform:none!important}",
          }}
        />
      </noscript>

      <a className="lp-skip" href="#lp-main">
        Salta al contenuto
      </a>
      <div className="lp-noise" aria-hidden="true" />

      {/* ============================================================ HEADER == */}
      <header className="lp-header" data-solid={solidHeader || menuOpen}>
        <div className="lp-shell lp-header__inner">
          <a className="lp-logo" href="#top" aria-label="Love&Pet — torna all'inizio">
            <Wordmark />
          </a>

          <nav className="lp-nav" aria-label="Navigazione principale">
            {NAV.map((item) => (
              <a key={item.href} className="lp-navlink" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lp-header__actions">
            <a
              className="lp-btn lp-btn--gold lp-btn--sm lp-header__cta"
              href={BUSINESS.phones[0].href}
            >
              <PhoneIcon />
              Prenota
            </a>
            <button
              ref={burgerRef}
              type="button"
              className="lp-burger"
              aria-expanded={menuOpen}
              aria-controls="lp-menu"
              aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="lp-burger__box" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="lp-menu"
            className="lp-menu"
            initial={{ opacity: 0, y: fmReduced ? 0 : -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: fmReduced ? 0 : -14 }}
            transition={{ duration: fmReduced ? 0.15 : 0.4, ease: menuEase }}
          >
            <div className="lp-shell lp-menu__inner">
              <nav aria-label="Navigazione mobile">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    className="lp-menu__link"
                    href={item.href}
                    initial={{ opacity: 0, y: fmReduced ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: fmReduced ? 0.15 : 0.5,
                      delay: fmReduced ? 0 : 0.06 + i * 0.05,
                      ease: menuEase,
                    }}
                  >
                    {item.label}
                    <ArrowIcon />
                  </motion.a>
                ))}
              </nav>

              <div className="lp-menu__meta">
                <a className="lp-btn lp-btn--gold" href={BUSINESS.phones[0].href}>
                  <PhoneIcon />
                  Chiama {BUSINESS.phones[0].label}
                </a>
                <a
                  className="lp-btn lp-btn--outline"
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Scrivici su WhatsApp
                </a>
                <p className="lp-small">
                  {BUSINESS.street}, {BUSINESS.area} — {BUSINESS.city}
                  <br />
                  Lun — Sab 9:00 — 19:00, su appuntamento
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="lp-main" tabIndex={-1}>
        {/* ========================================================== HERO == */}
        <section className="lp-hero" id="top" aria-labelledby="lp-hero-title">
          <div className="lp-hero__bg" data-parallax="bg">
            <img src={IMG.mesh} alt="" aria-hidden="true" fetchPriority="low" decoding="async" />
          </div>
          <div className="lp-hero__veil" aria-hidden="true" />

          <div
            className="lp-orb"
            aria-hidden="true"
            style={{
              inset: "8% auto auto -6%",
              width: "22rem",
              height: "22rem",
              background: "rgb(232 196 184 / 0.55)",
            }}
          />
          <PawIcon className="lp-paw-deco lp-paw-deco--a" />

          <div className="lp-shell lp-hero__grid">
            <div className="lp-hero__copy" data-parallax="copy">
              <span className="lp-pill" data-reveal="hero">
                <PawIcon />
                Allevamento amatoriale · ENC/FCI
              </span>

              <h1 className="lp-display lp-h1 lp-title" id="lp-hero-title" aria-label="Barboncini Toy cresciuti con amore, a Roma">
                {HERO_WORDS.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <span className="lp-word" aria-hidden="true">
                      <span
                        className={`lp-word__i${i === HERO_ACCENT_INDEX ? " lp-accent" : ""}`}
                      >
                        {word}
                      </span>
                    </span>
                    {/* Lo spazio sta fuori dal box con overflow:hidden, altrimenti
                        viene mangiato e le parole si attaccano. */}
                    {i < HERO_WORDS.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h1>

              <p className="lp-lead" data-reveal="hero">
                Allevamento amatoriale di Barboncini Toy e Nano ai Colli di Enea. I nostri cuccioli
                nascono e crescono in casa, socializzati fin dai primi giorni e consegnati con
                pedigree, microchip e vaccinazioni.
              </p>

              <div className="lp-btn-row" data-reveal="hero">
                <a className="lp-btn lp-btn--gold" href={BUSINESS.phones[0].href}>
                  <PhoneIcon />
                  Prenota una visita
                </a>
                <a
                  className="lp-btn lp-btn--outline"
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Scrivici su WhatsApp
                </a>
              </div>

              <div className="lp-hero__meta lp-small" data-reveal="hero">
                <span>
                  <a href={BUSINESS.maps} target="_blank" rel="noopener noreferrer">
                    {BUSINESS.street}, {BUSINESS.area} — {BUSINESS.city}
                  </a>
                </span>
                <span>Lun — Sab 9:00 — 19:00, su appuntamento</span>
              </div>
            </div>

            <div className="lp-hero__media" data-parallax="media" data-reveal="hero">
              <div className="lp-frame lp-frame--hero">
                <img
                  src={IMG.hero}
                  alt="Cucciolo di Barboncino Toy albicocca seduto su una coperta morbida color crema"
                  width={2048}
                  height={1152}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              <span className="lp-hero__seal" aria-hidden="true">
                Pedigree
                <br />
                ENC/FCI
              </span>

              <div className="lp-hero__card lp-glass">
                <span className="lp-hero__card-photo" aria-hidden="true">
                  <img
                    src={IMG.manuela}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>
                  <b>{BUSINESS.owner}</b>
                  <span>Allevatrice · da oltre 20 anni</span>
                </span>
              </div>
            </div>
          </div>

          <a className="lp-cue" href="#cuccioli" aria-label="Scorri alla sezione I nostri barboncini">
            <span>Scopri</span>
            <span className="lp-cue__line" aria-hidden="true">
              <i />
            </span>
          </a>
        </section>

        {/* ========================================================= STATS == */}
        <section className="lp-stats" aria-label="Love&Pet in numeri">
          <div className="lp-shell">
            <div className="lp-stats__grid lp-glass" data-reveal-group>
              {STATS.map((stat) => (
                <div className="lp-stat" key={stat.label} data-reveal="up">
                  <span className="lp-stat__num">
                    <span data-count={stat.count}>{stat.display}</span>
                    {stat.suffix ? <em>{stat.suffix}</em> : null}
                  </span>
                  <span className="lp-stat__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= COATS == */}
        <section className="lp-section lp-coats" id="cuccioli" aria-labelledby="lp-coats-title">
          <div className="lp-shell">
            <div className="lp-coats__intro" data-reveal-group>
              <div className="lp-coats__media" data-reveal="up">
                <div className="lp-frame-ring" aria-hidden="true" />
                <div className="lp-frame lp-frame--arch">
                  <img
                    src={IMG.duo}
                    alt="Due Barboncini Toy adulti seduti vicini: uno con mantello nero lucido, uno con mantello bianco"
                    width={1152}
                    height={2048}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="lp-coats__badge">
                  <b>ENC/FCI</b>
                  <span>Pedigree incluso</span>
                </span>
              </div>

              <div className="lp-coats__text">
                <span className="lp-eyebrow" data-reveal="up">
                  <PawIcon />I nostri barboncini
                </span>
                <h2 className="lp-display lp-h2" id="lp-coats-title" data-reveal="up">
                  Cinque mantelli, la stessa <span className="lp-accent">dolcezza</span>.
                </h2>
                <p className="lp-lead" data-reveal="up">
                  Selezioniamo Barboncini Toy e Nano curando struttura, salute e — soprattutto — il
                  temperamento. I cuccioli nascono in casa, tra le persone, e imparano il mondo
                  prima ancora di partire.
                </p>
                <ul className="lp-checklist" data-reveal="up">
                  {[
                    "Nati e cresciuti in casa, mai in box",
                    "Genitori sempre visitabili, prima di scegliere",
                    "Pedigree ENC/FCI, microchip e vaccinazioni alla consegna",
                    "Assistenza e consigli anche dopo l'adozione",
                  ].map((item) => (
                    <li key={item}>
                      <PawIcon />
                      {item}
                    </li>
                  ))}
                </ul>
                <div data-reveal="up">
                  <a className="lp-btn lp-btn--dark" href="#adozione">
                    Come funziona l&apos;adozione
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>

            <ul className="lp-coats__grid" data-reveal-group role="tablist" aria-label="Mantelli disponibili">
              {COATS.map((coat) => (
                <li
                  className="lp-coat lp-spot"
                  key={coat.name}
                  data-reveal="up"
                  onPointerMove={onSpotMove}
                >
                  <button
                    type="button"
                    className="lp-coat__btn"
                    data-coat={coat.name}
                    aria-label={`Mostra il mantello ${coat.name}`}
                  >
                    <span className="lp-coat__photo" aria-hidden="true">
                      <img
                        src={COAT_IMAGES[coat.name as keyof typeof COAT_IMAGES]}
                        alt=""
                        width={176}
                        height={176}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span
                      className="lp-coat__swatch"
                      aria-hidden="true"
                      style={{ background: coat.swatch }}
                    />
                    <span className="lp-coat__name">{coat.name}</span>
                    <span className="lp-coat__note">{coat.note}</span>
                    <span className="lp-coat__tag">Toy · Nano</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ====================================================== SERVIZI == */}
        <section
          className="lp-section lp-dark lp-services"
          id="servizi"
          aria-labelledby="lp-services-title"
        >
          <div className="lp-services__mesh" aria-hidden="true">
            <img src={IMG.mesh} alt="" loading="lazy" decoding="async" />
          </div>

          <div className="lp-shell">
            <div className="lp-section-head" data-reveal-group>
              <span className="lp-eyebrow" data-reveal="up">
                <PawIcon />
                Cosa facciamo
              </span>
              <h2 className="lp-display lp-h2" id="lp-services-title" data-reveal="up">
                Quattro modi per prenderci cura di lui.
              </h2>
              <p className="lp-lead" data-reveal="up">
                Dalla nascita alla toelettatura mensile, dall&apos;educazione di base ai giorni in cui
                non ci sei: Love&amp;Pet segue il tuo cane in ogni fase della sua vita.
              </p>
            </div>

            <ul className="lp-services__grid" data-reveal-group>
              {SERVICES.map((service) => (
                <li
                  className="lp-service lp-glass-dark lp-spot"
                  key={service.id}
                  data-reveal="up"
                  onPointerMove={onSpotMove}
                >
                  <span className="lp-service__icon">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h3 className="lp-service__title">{service.title}</h3>
                  <p className="lp-body">{service.text}</p>
                  <span className="lp-service__chips">
                    {service.chips.map((chip) => (
                      <span className="lp-chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===================================================== MARQUEE == */}
        <div className="lp-marquee" aria-hidden="true">
          <div className="lp-marquee__track">
            {[0, 1].map((copy) => (
              <div className="lp-marquee__group" key={copy}>
                {MARQUEE.map((item) => (
                  <span className="lp-marquee__item" key={`${copy}-${item}`}>
                    {item}
                    <PawIcon />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================== SPA == */}
        <section className="lp-section lp-spa" id="spa" aria-labelledby="lp-spa-title">
          <div className="lp-shell">
            <div className="lp-spa__grid" data-reveal-group>
              <div className="lp-spa__media" data-reveal="up">
                <div className="lp-frame-ring" aria-hidden="true" />
                <div className="lp-frame lp-frame--spa">
                  <img
                    src={IMG.spa}
                    alt="Toelettatrice che spazzola un Barboncino Toy albicocca su un asciugamano, in una spa dalla luce calda"
                    width={2048}
                    height={1152}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="lp-spa__float lp-glass">
                  <b>Su appuntamento</b>
                  <span>Lun — Sab</span>
                </span>
              </div>

              <div className="lp-spa__text">
                <span className="lp-eyebrow" data-reveal="up">
                  <PawIcon />
                  Toelettatura &amp; Spa
                </span>
                <h2 className="lp-display lp-h2" id="lp-spa-title" data-reveal="up">
                  Esce profumato, pettinato e <span className="lp-accent">felice</span>.
                </h2>
                <p className="lp-lead" data-reveal="up">
                  Il pelo del barboncino non si perde: cresce. Per questo va curato con costanza, da
                  mani che lo conoscono. Ogni trattamento è calibrato sul mantello e sul carattere
                  del cane.
                </p>

                <ul className="lp-spa__list">
                  {TREATMENTS.map((treatment, i) => (
                    <li className="lp-treat" key={treatment.title} data-reveal="up">
                      <span className="lp-treat__n" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="lp-treat__body">
                        <b>{treatment.title}</b>
                        <span>{treatment.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div data-reveal="up">
                  <a
                    className="lp-btn lp-btn--gold"
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                    Prenota la toelettatura
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== STEPS == */}
        <section className="lp-section lp-steps" id="adozione" aria-labelledby="lp-steps-title">
          <div className="lp-shell">
            <div className="lp-section-head lp-section-head--center" data-reveal-group>
              <span className="lp-eyebrow" data-reveal="up">
                <PawIcon />
                Come funziona
              </span>
              <h2 className="lp-display lp-h2" id="lp-steps-title" data-reveal="up">
                Come adotti il tuo cucciolo.
              </h2>
              <p className="lp-lead" data-reveal="up">
                Nessuna fretta e nessuna sorpresa. Quattro passaggi, e tutto il tempo che serve per
                essere sicuri — da entrambe le parti.
              </p>
            </div>

            <div className="lp-steps__track">
              <div className="lp-steps__rail" aria-hidden="true">
                <div className="lp-steps__fill" />
              </div>

              <ol className="lp-steps__grid" data-reveal-group>
                {STEPS.map((step, i) => (
                  <li className="lp-step" key={step.title} data-reveal="up">
                    <span className="lp-step__dot" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="lp-step__body">
                      <h3 className="lp-step__title">{step.title}</h3>
                      <span className="lp-step__text">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ================================================= TESTIMONIANZE == */}
        <section
          className="lp-section lp-quotes"
          id="testimonianze"
          aria-labelledby="lp-quotes-title"
        >
          <div className="lp-shell">
            <div className="lp-section-head lp-section-head--center" data-reveal-group>
              <span className="lp-eyebrow" data-reveal="up">
                <PawIcon />
                Testimonianze
              </span>
              <h2 className="lp-display lp-h2" id="lp-quotes-title" data-reveal="up">
                Le parole di chi è tornato a casa con noi.
              </h2>
            </div>

            <ul className="lp-quotes__grid" data-reveal-group>
              {QUOTES.map((quote) => (
                <li className="lp-quote" key={quote.name} data-reveal="up">
                  <span className="lp-quote__mark" aria-hidden="true">
                    &rdquo;
                  </span>
                  <Stars />
                  <blockquote className="lp-quote__text">{quote.text}</blockquote>
                  <div className="lp-quote__who">
                    <span className="lp-quote__avatar" aria-hidden="true">
                      <img
                        src={quote.photo}
                        alt=""
                        width={88}
                        height={88}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span>
                      <b>{quote.name}</b>
                      <span>{quote.city}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================================================== CTA == */}
        <section className="lp-section lp-cta" id="contatti" aria-labelledby="lp-cta-title">
          <div className="lp-cta__mesh" aria-hidden="true">
            <img src={IMG.mesh} alt="" loading="lazy" decoding="async" />
          </div>

          <div className="lp-shell">
            <div className="lp-cta__inner" data-reveal-group>
              <span className="lp-eyebrow" data-reveal="up">
                <PawIcon />
                Vieni a trovarci
              </span>
              <h2 className="lp-display lp-h2 lp-cta__title" id="lp-cta-title" data-reveal="up">
                Vieni a conoscere i nostri cuccioli.
              </h2>
              <p className="lp-lead" data-reveal="up">
                Su appuntamento, dal lunedì al sabato. Chiama, scrivici su WhatsApp o passa a
                trovarci ai Colli di Enea: ti aspettiamo noi e tutta la cucciolata.
              </p>

              <div className="lp-btn-row lp-cta__row" data-reveal="up">
                <a className="lp-btn lp-btn--dark" href={BUSINESS.phones[0].href}>
                  <PhoneIcon />
                  {BUSINESS.phones[0].label}
                </a>
                <a
                  className="lp-btn lp-btn--outline"
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
                <a
                  className="lp-btn lp-btn--outline"
                  href={BUSINESS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PinIcon />
                  Come arrivare
                </a>
              </div>

              <span className="lp-cta__addr" data-reveal="up">
                <PinIcon />
                {BUSINESS.street}, {BUSINESS.area} — {BUSINESS.city}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================== FOOTER == */}
      <footer className="lp-dark lp-footer">
        <div className="lp-shell">
          <div className="lp-footer__grid">
            <div className="lp-footer__brand">
              <span className="lp-logo">
                <Wordmark />
              </span>
              <p className="lp-body">
                Allevamento amatoriale di Barboncini Toy e Nano, toelettatura, addestramento e dog
                sitting. Ai Colli di Enea, a Roma, da oltre vent&apos;anni.
              </p>
              <div className="lp-socials">
                <a
                  className="lp-social"
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Love&Pet su Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  className="lp-social"
                  href={BUSINESS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Love&Pet su Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  className="lp-social"
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Scrivici su WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            <nav className="lp-footer__col" aria-label="Contatti">
              <h2 className="lp-footer__h">Contatti</h2>
              <ul>
                <li>
                  <a
                    className="lp-footer__link"
                    href={BUSINESS.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PinIcon />
                    {BUSINESS.street}, {BUSINESS.area} — {BUSINESS.city}
                  </a>
                </li>
                {BUSINESS.phones.map((phone) => (
                  <li key={phone.href}>
                    <a className="lp-footer__link" href={phone.href}>
                      <PhoneIcon />
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a className="lp-footer__link" href={`mailto:${BUSINESS.email}`}>
                    <MailIcon />
                    {BUSINESS.email}
                  </a>
                </li>
              </ul>
            </nav>

            <div className="lp-footer__col">
              <h2 className="lp-footer__h">Orari</h2>
              <ul>
                <li>
                  <span className="lp-footer__link" style={{ pointerEvents: "none" }}>
                    <ClockIcon />
                    Lun — Sab: 9:00 — 19:00
                  </span>
                </li>
                <li>Solo su appuntamento</li>
                <li>Domenica: chiuso</li>
              </ul>
            </div>

            <nav className="lp-footer__col" aria-label="Sezioni del sito">
              <h2 className="lp-footer__h">Naviga</h2>
              <ul>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a className="lp-footer__link" href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a className="lp-footer__link" href="#adozione">
                    Come adottare
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="lp-footer__bottom">
            <span>
              Love&amp;Pet di {BUSINESS.owner} — P. IVA 00000000000
            </span>
            <span>© 2026 Love&amp;Pet. Tutti i diritti riservati.</span>
            <span>Design &amp; sviluppo — Studio Volt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
