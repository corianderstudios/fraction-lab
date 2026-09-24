import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";
import { PROGRESS_KEY } from "./context/ProgressContext.jsx";
import { goTo, setHash } from "./test/helpers.js";

const mainNav = () => screen.getByRole("navigation", { name: "Main" });

describe("App", () => {
  it("starts on the home page in light mode", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /fractions, one piece at a time/i,
      }),
    ).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("switches between light and dark mode", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: /switch to dark mode/i }),
    );
    expect(document.documentElement).toHaveClass("dark");
    await user.click(
      screen.getByRole("button", { name: /switch to light mode/i }),
    );
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("shows a breadcrumb with the current page", () => {
    setHash("/learn/multiply");
    render(<App />);
    const crumbs = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "#/",
    );
    expect(within(crumbs).getByText("Multiplying Fractions")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark a section as in progress just by opening it", () => {
    setHash("/learn/add");
    render(<App />);
    const link = within(mainNav()).getByRole("link", { name: "Adding" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).not.toHaveClass("bg-progress/50");
  });

  it("moves the active highlight to whichever section is clicked", async () => {
    const user = userEvent.setup();
    setHash("/learn/add");
    render(<App />);
    await user.click(
      within(mainNav()).getByRole("link", { name: "Subtracting" }),
    );
    goTo("/learn/subtract"); // jsdom doesn't follow hash links, so apply the navigation
    const adding = within(mainNav()).getByRole("link", { name: "Adding" });
    const subtracting = within(mainNav()).getByRole("link", {
      name: "Subtracting",
    });
    expect(adding).not.toHaveAttribute("aria-current");
    expect(adding).not.toHaveClass("ring-2");
    expect(subtracting).toHaveAttribute("aria-current", "page");
    expect(subtracting).toHaveClass("ring-2");
    expect(subtracting).not.toHaveClass("bg-progress/50");
  });

  it("marks a section in progress only with the in-progress button", async () => {
    const user = userEvent.setup();
    setHash("/learn/add");
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /mark as in progress/i }),
    );
    const link = within(mainNav()).getByRole("link", {
      name: /adding \(in progress\)/i,
    });
    expect(link).toHaveClass("bg-progress/50");

    // The highlight stays on Adding after moving to another section.
    goTo("/learn/subtract");
    expect(
      within(mainNav()).getByRole("link", { name: /adding \(in progress\)/i }),
    ).toHaveClass("bg-progress/50");
    expect(
      within(mainNav()).getByRole("link", { name: "Subtracting" }),
    ).not.toHaveClass("bg-progress/50");

    // Selecting the button again clears it.
    goTo("/learn/add");
    await user.click(
      screen.getByRole("button", { name: /in progress \(select to clear\)/i }),
    );
    expect(
      within(mainNav()).getByRole("link", { name: "Adding" }),
    ).not.toHaveClass("bg-progress/50");
  });

  it("lets you complete a section, which replaces in progress", async () => {
    const user = userEvent.setup();
    setHash("/learn/add");
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /mark as in progress/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /mark section complete/i }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /completed:\s*adding fractions/i,
      }),
    ).toBeInTheDocument();
    const doneLink = within(mainNav()).getByRole("link", {
      name: /adding \(completed\)/i,
    });
    expect(doneLink).not.toHaveClass("bg-progress/50");
    expect(
      screen.queryByRole("button", { name: /in progress/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /section complete/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /next: subtracting fractions/i }),
    ).toHaveAttribute("href", "#/learn/subtract");

    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY));
    expect(saved.completed.add).toBe(true);
    expect(saved.inProgress.add).toBeUndefined();
  });

  it("moves focus to the new page heading when navigating", () => {
    render(<App />);
    goTo("/learn/divide");
    expect(
      screen.getByRole("heading", { level: 1, name: /dividing fractions/i }),
    ).toHaveFocus();
  });

  it("solves problems in the playground from the keyboard", async () => {
    const user = userEvent.setup();
    setHash("/learn/add");
    render(<App />);
    const playground = screen.getByRole("region", { name: "Playground" });
    const num1 = within(playground).getByLabelText("First fraction numerator");
    await user.clear(num1);
    await user.type(num1, "1");
    const den1 = within(playground).getByLabelText(
      "First fraction denominator",
    );
    await user.clear(den1);
    await user.type(den1, "4");
    const num2 = within(playground).getByLabelText("Second fraction numerator");
    await user.clear(num2);
    await user.type(num2, "<script>1");
    expect(num2).toHaveValue("1");
    const den2 = within(playground).getByLabelText(
      "Second fraction denominator",
    );
    await user.clear(den2);
    await user.type(den2, "4{Enter}");
    expect(within(playground).getByText(/^Answer: 1\/2/)).toBeInTheDocument();
  });

  it("shows completed sections with a check in the navigation", () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        inProgress: { add: true },
        completed: { basics: true },
        bestScores: {},
      }),
    );
    render(<App />);
    expect(
      within(mainNav()).getByRole("link", { name: /basics \(completed\)/i }),
    ).toBeInTheDocument();
    expect(
      within(mainNav()).getByRole("link", { name: /adding \(in progress\)/i }),
    ).toHaveClass("bg-progress/50");
    expect(screen.getByText("1 of 6 sections complete")).toBeInTheDocument();
  });

  it("ignores tampered progress data", () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: { "<script>": true, add: "yes" } }),
    );
    render(<App />);
    expect(screen.getByText("0 of 6 sections complete")).toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("shows a not-found page for unknown routes", () => {
    setHash("/learn/<script>");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it("lists the games with keyboard-friendly links", () => {
    setHash("/games");
    render(<App />);
    expect(screen.getByRole("link", { name: /play adding/i })).toHaveAttribute(
      "href",
      "#/games/add",
    );
    expect(
      screen.getByRole("link", { name: /next: glossary/i }),
    ).toHaveAttribute("href", "#/glossary");
  });
});
