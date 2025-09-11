"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Dispatch } from "react";

interface CommandMenuProps {
  openCommand: boolean;
  setOpenCommand: Dispatch<React.SetStateAction<boolean>>;
}

export const CommandMenu = ({
  openCommand,
  setOpenCommand,
}: CommandMenuProps) => {
  return (
    <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
      <CommandInput placeholder="find a meeting or an agent" />
      <CommandList>
        <CommandGroup>
          <CommandItem>Test</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
