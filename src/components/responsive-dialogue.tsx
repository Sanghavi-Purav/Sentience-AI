import { Dispatch } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";

import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogueProps {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
}

export const ResponsiveDialogue = ({
  title,
  description,
  children,
  open,
  onOpenChange,
}: ResponsiveDialogueProps) => {
  const ismobile = useIsMobile();
  if (ismobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
