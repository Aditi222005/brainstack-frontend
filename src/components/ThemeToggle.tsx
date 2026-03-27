import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full
                 text-muted-foreground text-sm
                 hover:bg-accent/10 
                 hover:text-accent
                 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon size={18} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
}
