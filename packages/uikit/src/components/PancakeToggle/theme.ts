import { darkColors, lightColors } from "../../theme/colors";
import { OffsideToggleTheme } from "./types";

export const light: OffsideToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: OffsideToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
