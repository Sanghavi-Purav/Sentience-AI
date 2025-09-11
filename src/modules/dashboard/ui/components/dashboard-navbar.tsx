"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  PanelLeftIcon,
  PanelLeftClose,
  PanelRightClose,
  SearchIcon,
} from "lucide-react";

import { CommandMenu } from "./navbar-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const { toggleSidebar, open, isMobile } = useSidebar();
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((openCommand) => !openCommand);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandMenu openCommand={openCommand} setOpenCommand={setOpenCommand} />
      <nav className="flex items-center gap-x-2 bg-background px-4 py-3 border-b">
        <Button
          className="bg-white hover:bg-gray-400/20 border border-gray-300/50"
          onClick={toggleSidebar}
        >
          {open && !isMobile ? (
            <PanelLeftClose className="text-black" />
          ) : (
            <PanelRightClose className="text-black" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          onClick={() => setOpenCommand((openCommand) => !openCommand)}
        >
          <SearchIcon />
          Search
          <kbd className="ml-auto font-mono text-xs items-center inline-flex gap-2 rounded bg-muted px-1.5 text-[10px] text-muted-foreground">
            <span className="text-xs">⌘</span>+
            <span className="text-xs">K</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
};
