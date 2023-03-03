import { darkColors, lightColors } from "../../theme/colors";
import { SpaceinvadersToggleTheme } from "./types";

export const light: SpaceinvadersToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: SpaceinvadersToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
