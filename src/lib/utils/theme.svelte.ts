import { browser } from "$app/environment";

type Theme = "system" | "dark" | "light";

let theme: Theme = $state("system");

export function initialSetTheme() {
  setThemeInHTML(getTheme());
}

export function setThemeInHTML(newTheme: Theme) {
  const html = document.querySelector("html");
  if (html) {
    if (newTheme === "system") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      newTheme = isDarkMode ? "dark" : "light";
    }
    html.setAttribute("data-theme", newTheme);
  }
}

export function setTheme(newTheme: Theme) {
  if (!browser) return;
  localStorage.setItem("theme", newTheme);
  theme = newTheme;
  setThemeInHTML(newTheme);
}

export function updateTheme() {
  if (!browser) return;
  const storedTheme = localStorage.getItem("theme") as Theme | "undefined";
  if (storedTheme === "undefined") {
    localStorage.setItem("theme", "system");
    theme = "system";
  } else {
    theme = storedTheme;
  }
}

export function getTheme(): Theme {
  updateTheme();
  return theme;
}

export function toggleTheme() {
  const themes = ["system", "light", "dark"] as const;
  const currentTheme = getTheme();
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];
  setTheme(nextTheme);
}
