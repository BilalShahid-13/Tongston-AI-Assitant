import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Label } from "./ui/label";

export default function SettingsSwitches() {
  const [darkMode, setDarkMode] = useState(false);
  const [tourEnabled, setTourEnabled] = useState(false);
  const { setTheme } = useTheme();

  // 🧠 Sync theme and tourEnabled with localStorage on mount
  useEffect(() => {
    const storedTour = localStorage.getItem("tourCompleted");
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      setTheme("dark");
      setDarkMode(true);
    } else {
      setTheme("light");
      setDarkMode(false);
    }

    setTourEnabled(storedTour === "false"); // "false" means tour is enabled
  }, []);

  return (
    <div className="space-y-6 p-6 border rounded-md w-full">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      {/* 🌙 Dark Mode */}
      <div className="flex items-center justify-between p-4 border rounded-md w-full">
        <div>
          <Label htmlFor="dark-mode" className="font-semibold cursor-pointer">Dark Mode</Label>
          <p className="text-sm text-muted-foreground">
            Enable dark theme for the application UI.
          </p>
        </div>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={(checked) => {
            setDarkMode(checked);
            const newTheme = checked ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
          }}
          aria-label="Toggle Dark Mode"
        />
      </div>

      {/* 🧭 Tour Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-md">
        <div>
          <Label htmlFor="tour" className="font-semibold cursor-pointer">Step by Step Walkthrough</Label>
          <p className="cursor-alias text-sm text-muted-foreground">
            Enable onboarding tour to guide new users.
          </p>
        </div>
        <Switch
          id="tour"
          checked={tourEnabled}
          onCheckedChange={(checked) => {
            localStorage.setItem("tourCompleted", checked ? "false" : "true");
            setTourEnabled(checked);
          }}
          aria-label="Toggle Tour"
        />
      </div>
    </div>
  );
}
