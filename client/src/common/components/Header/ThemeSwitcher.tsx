import React from "react";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../../icon/SunIcon";
import { MoonIcon } from "../../icon/MoonIcon";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ThemeSwitcher({ isDarkMode, toggleTheme }: ThemeSwitcherProps) {
  return (
    <Switch
      defaultSelected
      checked={isDarkMode}
      onChange={toggleTheme}
      size="lg"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} style={{ fontSize: "30px" }} />
        ) : (
          <MoonIcon className={className} style={{ fontSize: "30px" }} />
        )
      }
    />
  );
}
