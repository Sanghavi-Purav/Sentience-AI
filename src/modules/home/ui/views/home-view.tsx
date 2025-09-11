"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      this is the home view
    </div>
  );
};

export default HomeView;
