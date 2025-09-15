/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, ReactNode } from "react";

type Mode = "light" | "dark";

export const tokens = (mode: Mode) => ({
  background: mode === "dark" ? "bg-gray-900" : "bg-white",
  text: mode === "dark" ? "text-white" : "text-gray-900",
  border: mode === "dark" ? "border-gray-700" : "border-gray-300",
  card: mode === "dark" ? "bg-gray-800" : "bg-white",
  accent: mode === "dark" ? "text-green-400" : "text-green-600",
});

type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: Mode;
  colors: ReturnType<typeof tokens>;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "dark",
  colors: tokens("dark"),
});

export const useMode = (): [Mode, () => void, ReturnType<typeof tokens>] => {
  const [mode, setMode] = useState<Mode>("dark");

  const toggleColorMode = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  const colors = useMemo(() => tokens(mode), [mode]);

  return [mode, toggleColorMode, colors];
};

type ColorModeProviderProps = {
  children: ReactNode;
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, toggleColorMode, colors] = useMode();

  return (
    <ColorModeContext.Provider
      value={{ toggleColorMode, mode, colors }}
    >
      <div className={`${colors.background} min-h-screen transition-all`}>
        {children}
      </div>
    </ColorModeContext.Provider>
  );
};
