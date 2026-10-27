import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

export function themeColours() {
  const styles = getComputedStyle(document.documentElement);
  function read(name) {
    return styles.getPropertyValue(name).trim();
  }
  return {
    gold: read("--gold"),
    lightGold: read("--light-gold"),
    grey: read("--grey-text"),
    white: read("--white-text"),
    line: read("--line-on-dark"),
    darkWall: read("--dark-wall"),
    textFont: read("--text-font")
  };
}
