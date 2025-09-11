"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DashboardUserProfile } from "./dashboard-user-profile";

const firstSection = [
  { icon: VideoIcon, title: "Meetings", href: "/meetings" },
  { icon: BotIcon, title: "Agents", href: "/agents" },
];

const secondSection = [{ icon: StarIcon, title: "Upgrade", href: "/upgrade" }];
export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image
            src="/logo.svg"
            alt="Sentience AI Logo"
            height={36}
            width={36}
          />
          <span className="text-xl text-white font-bold ">Sentience AI</span>
        </Link>
      </SidebarHeader>
      <div className="py-2 px-4">
        <Separator className="opacity-10" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.title} className="">
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 cursor-pointer ",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10 to-sidebar-accent to-50 via-sidebar-accent/70 from-sidebar-accent from-5%"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="flex items-center gap-2 ">
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div>
          <Separator className="opacity-10 my-2 mx-4" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.title} className="">
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 cursor-pointer ",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10 to-sidebar-accent to-50 via-sidebar-accent/70 from-sidebar-accent from-5%"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="flex items-center gap-2 ">
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};
