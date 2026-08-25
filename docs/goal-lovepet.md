Sei un senior creative developer pluripremiato su Awwwards (SOTD ×10), specializzato in siti pet/animal premium.

Il tuo compito: creare il sito vetrina completo per "Love&Pet — Allevamento Barboncini Toy" a Roma. Design "Cinematic Warm" — la qualità deve far dire wow.

## STACK TECNICO (già installato)
- Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript
- gsap (ScrollTrigger), lenis, framer-motion
- Font: usa next/font/google (Inter per UI + un display font elegante a scelta tipo Fraunces o Playfair per i titoli)

## STRUTTURA FILE
1. `app/page.tsx` — route home (server component, importa il client component)
2. `components/LovePetHome.tsx` — componente principale ('use client')
3. `app/globals.css` — estendi il css esistente con le classi custom del design (scope sotto `.lp`)

## DATI REALI (usa ESATTAMENTE questi)
- Nome: Love&Pet
- Tagline: "Allevamento Barboncini Toy · Toelettatura & Spa · Addestramento"
- Indirizzo: Viale Anchise 49, Colli di Enea — Roma
- Telefono: 06 93377569 / 340 3114143 (link tel:)
- WhatsApp: https://wa.me/393403114143
- Email: senzani.manuela@gmail.com
- Instagram: https://www.instagram.com/manuelasenzani_official
- Facebook: https://www.facebook.com/manuela.barbocinitoy
- Proprietaria: Manuela Senzani

## IMMAGINI (URL diretti, usa <img> con eslint-disable per next/img)
- HERO (cucciolo albicocca): https://v3b.fal.media/files/b/0aa7c496/r3wEt_6WzBulUW9vHNWG1_jrUrNRjT.png
- DUE BARBONCINI (nero+biano): https://v3b.fal.media/files/b/0aa7c4ad/l65SEI5HMvlOdcsOl8OCZ_PiYXSw0k.png
- SPA/TOELETTATURA: https://v3b.fal.media/files/b/0aa7c49a/u9Ng4sfsv8aApAF4EXopG_w4uKIv4H.png
- BACKGROUND MESH (gradient caldo): https://v3b.fal.media/files/b/0aa7c49b/jYXftxwdoSSnHhBk-ON-S_knxavIgo.png

## DIREZIONE CREATIVA — "Cinematic Warm"
- Palette: warm cream (#FAF6EF), honey gold (#E8B84B / #D9A441), warm caramel (#B5833A), soft brown scuro (#3E2F23) per testo e sezioni dark, blush rose (#E8C4B8) accento
- Uno solo accento CTA: honey gold con testo scuro
- Toni caldi, coccolosi, premium — NON infantile, NON cartoon. Pet luxury.
- Motivo grafico ricorrente: impronta di zampa stilizzata / forme organiche morbide (blob)
- Tipografia: display serif caldo per h1/h2, sans per body. h1 clamp(2.5rem, 5vw, 4.5rem)

## LE 10 SEZIONI (schema Cinematic adattato)
1. **Lenis smooth scroll** — lerp 0.1, RAF guidato da GSAP ticker, DISABLED con prefers-reduced-motion
2. **Hero cinematografico** — background mesh gradient caldo + foto cucciolo albicocca in cornice organica (border-radius asimmetrici tipo blob), parallax, split-text reveal del titolo parola per parola ("Barboncini Toy cresciuti con amore, a Roma"), badge "Allevamento amatoriale · ENC/FCI", doppia CTA (Prenota una visita → tel, Scrivici su WhatsApp → wa.me), scroll indicator animato
3. **Stats band glassmorphism** — contatori animati GSAP: "10.000+ amici a quattro zampe", "20+ anni di passione", "4 servizi per il tuo cane", "100% cuccioli socializzati"
4. **Sezione "I nostri barboncini"** — card dei colori/mantelli: Albicocca, Rosso, Nero, Bianco, Champagne — card con hover lift e glow caldo, foto due barboncini presente
5. **Servizi (le 4 animhe del business)** — 4 card glassmorphism su fondo scuro (soft brown): 🐩 Allevamento (cuccioli toy e nano con pedigree), 🫧 Toelettatura & Spa (trattamenti completi), 🎾 Addestramento & Agility, 🐕 Dog Sitting & Educazione — icone SVG inline custom animate
6. **Sezione Spa** — split layout con foto spa + lista trattamenti (bagno, spuntatura, asciugaggio, cura unghie, pulizia orecchie) con reveal stagger
7. **Process timeline "Come adotti il tuo cucciolo"** — 4 step: 1. Vieni a conoscerci 2. Conosci i genitori 3. Prenota il tuo cucciolo 4. Portalo a casa (vaccinato, microchippato, con pedigree) — animazione progressiva su scroll
8. **Testimonianze** — 3 card con citazioni inventate plausibili (nomi italiani, "cucciolo sereno e socializzato", "professionalità rara") — carousel drag o grid
9. **CTA band finale** — gradient honey gold animato, mesh overlay, "Vieni a conoscere i nostri cuccioli" + telefono + WhatsApp + mappa (link Google Maps a Viale Anchise 49 Roma)
10. **Footer** — soft brown scuro, logo, contatti completi, orari (Lun-Sab 9:00-19:00 su appuntamento), social link, P.IVA placeholder, copyright 2026

**Header**: trasparente sopra hero → solido (cream bg + blur + shadow) dopo 100px scroll. Logo testuale "Love&Pet" con zampa SVG. Nav: I nostri cuccioli · Servizi · Spa · Testimonianze · Contatti. CTA pill "Prenota" gold. Mobile hamburger.

## VINCOLI NON NEGOZIABILI
- prefers-reduced-motion: reduce → Lenis OFF, tutte le animazioni ridotte a fade semplici
- WCAG AA contrasti (il testo scuro #3E2F23 su cream ha contrasto alto — ok; verificare testo su gold)
- Touch target ≥44px, focus ring visibile, skip-link, landmark semantici (header/main/section/footer/nav)
- Tutte le immagini con alt descrittivo, loading lazy tranne l'hero (priority)
- Nessuna external font dependency oltre next/font

## ESECUZIONE
- Crea i 3 file (page.tsx, LovePetHome.tsx, globals.css aggiornato)
- Verifica TypeScript senza errori
- Commit su main: "feat: Love&Pet cinematic warm site — GSAP+Lenis, split-text hero, animated stats, services, spa, adoption timeline, testimonials"
- NON pushare (ci pensa Olivia)

Lavora con cura maniacale. Questo sito deve vendere il servizio di Studio Volt a Manuela: lei lo vede e deve pensare "lo voglio SUBITO".
