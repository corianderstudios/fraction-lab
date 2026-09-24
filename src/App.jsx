import { useEffect, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";
import { parseRoute, useHashRoute } from "./lib/router.js";
import { getSection } from "./data/sections.js";
import { OPS } from "./lib/fraction.js";
import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import GlossaryPage from "./pages/GlossaryPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppShell />
      </ProgressProvider>
    </ThemeProvider>
  );
}

function titleFor(route) {
  if (route.name === "home") return "FractionLab";
  if (route.name === "lesson")
    return `${getSection(route.id).title} | FractionLab`;
  if (route.name === "games") return "Practice Games | FractionLab";
  if (route.name === "game") return `${OPS[route.op].name} game | FractionLab`;
  if (route.name === "glossary") return `Glossary | FractionLab`;
  return "Page not found | FractionLab";
}

function AppShell() {
  const path = useHashRoute();
  const route = parseRoute(path);
  const isFirstRender = useRef(true);

  // On every navigation (but not first load): update the title, scroll up, and move
  // focus to the page heading so screen-reader users hear where they landed.
  useEffect(() => {
    document.title = titleFor(parseRoute(path));
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("page-title")?.focus();
  }, [path]);

  let page;
  switch (route.name) {
    case "home":
      page = <HomePage />;
      break;
    case "lesson":
      page = <LessonPage key={route.id} lessonId={route.id} />;
      break;
    case "games":
      page = <GamesPage />;
      break;
    case "game":
      page = <GamePage key={route.op} op={route.op} />;
      break;
    case "glossary":
      page = <GlossaryPage />;
      break;
    default:
      page = <NotFoundPage />;
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <button
        type="button"
        onClick={() => document.getElementById("main")?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to main content
      </button>
      <NavBar route={route} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {page}
      </main>
    </div>
  );
}
