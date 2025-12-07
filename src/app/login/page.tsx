"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login } from "./actions";
import { useAuth, useUser } from "@/firebase";

const formSchema = z.object({
  petName: z.string().min(1, { message: "You must enter our secret name." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (auth && !user && !isUserLoading && !isSigningIn) {
      setIsSigningIn(true);
      signInAnonymously(auth).finally(() => setIsSigningIn(false));
    }
  }, [auth, user, isUserLoading, isSigningIn]);
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values);
    if (result.success) {
      localStorage.setItem("petName", values.petName.toLowerCase());
      toast({
        title: "Welcome!",
        description: "So happy to have you here.",
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Not quite!",
        description: result.error,
      });
      form.reset();
    }
  }
  
  const isLoading = form.formState.isSubmitting || isUserLoading || isSigningIn;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
          <CardDescription>Whisper the secret name to enter our world.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Our Secret Pet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="What do we call each other?" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entering...
                  </>
                ) : "Enter Our World"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
