export const SECTIONS = [
  {
    id: "basics",
    title: "Fraction Basics",
    navLabel: "Basics",
    path: "/learn/basics",
    blurb: "Numerators, denominators, equivalent fractions and simplest form.",
  },
  {
    id: "add",
    title: "Adding Fractions",
    navLabel: "Adding",
    path: "/learn/add",
    blurb: "Match the denominators, then add the tops.",
  },
  {
    id: "subtract",
    title: "Subtracting Fractions",
    navLabel: "Subtracting",
    path: "/learn/subtract",
    blurb: "Same idea as adding, but taking pieces away.",
  },
  {
    id: "multiply",
    title: "Multiplying Fractions",
    navLabel: "Multiplying",
    path: "/learn/multiply",
    blurb: "Top times top, bottom times bottom.",
  },
  {
    id: "divide",
    title: "Dividing Fractions",
    navLabel: "Dividing",
    path: "/learn/divide",
    blurb: "Keep the first, change the sign, flip the second.",
  },
  {
    id: "games",
    title: "Practice Games",
    navLabel: "Games",
    path: "/games",
    blurb:
      "Ten adaptive questions per skill. Questions get harder as you get them right.",
  },
  {
    id: "glossary",
    title: "Glossary",
    navLabel: "Glossary",
    path: "/glossary",
    blurb: "Plain definitions of fraction words.",
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
export const getSection = (id) => SECTIONS.find((s) => s.id === id) ?? null;
export function getNextSection(id) {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return i >= 0 ? (SECTIONS[i + 1] ?? null) : null;
}
