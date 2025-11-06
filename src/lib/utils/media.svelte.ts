import { readable } from "svelte/store";
import { browser } from "$app/environment";

function getMedia() {
  if (!browser) return {};
  return {
    isDesktopOrLaptop: window.matchMedia("(min-width: 1024px)").matches,
    isBiggerThanMobile: window.matchMedia("(min-width: 768px)").matches,
    isTabletOrMobile: window.matchMedia("(max-width: 768px)").matches,
  };
}

export const media = readable(getMedia(), function start(set) {
  function update() {
    set(getMedia());
  }
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
});
