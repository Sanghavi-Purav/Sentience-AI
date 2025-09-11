"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OctagonAlertIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password is required"),
});

export const SignInView = () => {
  const [error, setError] = useState(false);
  const [errorcontent, setErrorContent] = useState<unknown>("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: `/`,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          setError(true);
          setErrorContent(error.error.message);
        },
      }
    );
  };

  const socialSignIn = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social(
      {
        provider,
        callbackURL: `/`,
      },
      {
        onSuccess: () => {
          setError(false);
        },
        onError: ({ error }) => {
          setError(true);
          setErrorContent(error.message);
        },
      }
    );
  };

  const { isSubmitting } = form.formState;
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-black text-2xl font-semibold">
                    Welcome Back!
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account to continue
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl />{" "}
                        <Input
                          type="email"
                          placeholder="john@gmail.com"
                          {...field}
                        />{" "}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl />
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert className="bg-destructive/10 border-none">
                    {" "}
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>Error </AlertTitle>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or Continue With
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      socialSignIn("google");
                    }}
                  >
                    <FaGoogle className="mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      socialSignIn("github");
                    }}
                  >
                    <FaGithub className="mr-2" />
                    GitHub
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Don't have an account,{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-sidebar/95 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Sentience AI</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
