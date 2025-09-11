"use client";

import { ChevronUp, CreditCardIcon, LogOutIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserProfile = () => {
  const { data } = authClient.useSession();
  const router = useRouter();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <SidebarMenuButton
            className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 border border-transparent hover:border-[#5D6B68]/10 cursor-pointer "
            size="lg"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={data?.user?.image ?? undefined}
                alt={data?.user?.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data?.user?.name}</span>
              <span className="truncate text-xs">{data?.user?.email}</span>
            </div>
            <ChevronUp className="ml-auto size-4" />
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data?.user?.name} </DrawerTitle>
            <DrawerDescription>{data?.user?.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button className="bg-white/80 text-accent-foreground border border-gray-400/30 ">
              <CreditCardIcon className="mr-2 size-4" /> Billing
            </Button>
            <Button
              className="bg-white/80 text-accent-foreground border border-gray-400/30"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/sign-in");
                    },
                  },
                });
              }}
            >
              <LogOutIcon className="mr-2 size-4" /> Sign Out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <SidebarMenu className="">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="p-4 gap-x-2 flex w-full h-14  items-center"
          >
            <SidebarMenuButton
              className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 border border-transparent hover:border-[#5D6B68]/10 cursor-pointer "
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={data?.user?.image ?? undefined}
                  alt={data?.user?.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data?.user?.name}</span>
                <span className="truncate text-xs">{data?.user?.email}</span>
              </div>
              <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-sidebar-accent/10"
            side="right"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data?.user?.image ?? undefined}
                    alt={data?.user?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data?.user?.name}
                  </span>
                  <span className="truncate text-xs">{data?.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User2Icon className="mr-2 size-4" />
                <span
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOutIcon className="mr-2 size-4" />
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/sign-in");
                        },
                      },
                    });
                  }}
                >
                  {" "}
                  Sign Out
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
