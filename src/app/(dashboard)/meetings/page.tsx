import { auth } from "@/lib/auth";
import { getQueryClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const queryClient = getQueryClient();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return <>Meetings Page</>;
};

export default Page;
