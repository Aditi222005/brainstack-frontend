import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-2 px-3 py-2 w-full border-2 border-foreground/30
                 hover:border-yellow hover:text-yellow text-muted-foreground
                 text-[11px] mono font-bold uppercase tracking-wider transition-colors duration-75"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={12} /> : <Sun size={12} />}
      {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
    </button>
  );
}
