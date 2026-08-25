import LovePetHome from "@/components/LovePetHome";

/** Dati strutturati per la scheda attività locale (Google / SEO). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PetStore",
  name: "Love&Pet",
  description:
    "Allevamento amatoriale di Barboncini Toy e Nano a Roma. Toelettatura & Spa, addestramento e dog sitting.",
  slogan: "Allevamento Barboncini Toy · Toelettatura & Spa · Addestramento",
  url: "https://www.lovepet.it",
  telephone: ["+390693377569", "+393403114143"],
  email: "senzani.manuela@gmail.com",
  founder: { "@type": "Person", name: "Manuela Senzani" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Viale Anchise 49",
    addressLocality: "Roma",
    addressRegion: "RM",
    addressCountry: "IT",
  },
  areaServed: "Roma",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/manuelasenzani_official",
    "https://www.facebook.com/manuela.barbocinitoy",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LovePetHome />
    </>
  );
}
