"use client";

import { useForm } from "react-hook-form";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long")
      .max(16, "Password should be at most 16 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [errorcontent, setErrorContent] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
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

  const socialSignOn = async (provider: "google" | "github") => {
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
                    Create an account
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your details to create your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl />
                        {""}
                        <Input
                          placeholder="John Doe"
                          {...field}
                          type="name"
                        />{" "}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <FormControl />{" "}
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />{" "}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl />{" "}
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />{" "}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert className="bg-destructive/10 border-none">
                    {" "}
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle className="text-destructive">Error </AlertTitle>
                  </Alert>
                )}
                <Button className="w-full" disabled={isSubmitting}>
                  {" "}
                  Sign Up{" "}
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
                      socialSignOn("google");
                    }}
                  >
                    <FaGoogle className="mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      socialSignOn("github");
                    }}
                  >
                    <FaGithub className="mr-2" />
                    GitHub
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Have an Account,{" "}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-sidebar/95  relative hidden md:flex flex-col gap-y-4 items-center justify-center">
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
