import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faEarthAfrica,
  faEarthAmericas,
  faEarthAsia,
  faEarthEurope,
  faEarthOceania,
} from "@fortawesome/pro-solid-svg-icons";
import { useEffect, useState } from "react";

export function useFaGlobe() {
  const [icon, setIcon] = useState<IconDefinition>(faEarthOceania);

  useEffect(() => {
    // random out of this list
    const icons = [
      faEarthOceania,
      faEarthAsia,
      faEarthAfrica,
      faEarthAmericas,
      faEarthEurope,
    ];

    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    setIcon(randomIcon);
  }, []);

  return icon;
}
