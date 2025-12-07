"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Wand2, MessageCircle, CalendarHeart, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getDateNightIdeaAction, getRomanticMessageAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  restaurantPreference: z.string().min(2, "Please enter a preference."),
  cuisinePreference: z.string().min(2, "Please enter a preference."),
  activityPreference: z.string().min(2, "Please enter a preference."),
});

type FormData = z.infer<typeof formSchema>;

export default function AIToolsPage() {
  const { toast } = useToast();
  const [ideaResult, setIdeaResult] = useState<string | null>(null);
  const [messageResult, setMessageResult] = useState<string | null>(null);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantPreference: "",
      cuisinePreference: "",
      activityPreference: "",
    },
  });

  const handleGenerateIdea = async (values: FormData) => {
    setIsGeneratingIdea(true);
    setIdeaResult(null);
    const result = await getDateNightIdeaAction(values);
    if (result.success && result.data) {
      setIdeaResult(result.data.dateNightIdea);
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      });
    }
    setIsGeneratingIdea(false);
  };

  const handleGenerateMessage = async (values: FormData) => {
    setIsGeneratingMessage(true);
    setMessageResult(null);
    const result = await getRomanticMessageAction(values);
    if (result.success && result.data) {
      setMessageResult(result.data.romanticMessage);
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      });
    }
    setIsGeneratingMessage(false);
  };

  return (
    <div className="flex h-screen flex-col p-4 md:p-6">
      <header className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold">Inspiration Corner</h1>
        <p className="text-muted-foreground">
          A little help from our AI friend to spark some romance.
        </p>
      </header>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tell us what you're feeling</CardTitle>
            <CardDescription>
              Enter some preferences and let the magic happen.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form className="grid grid-cols-1 gap-6 p-6 pt-0 md:grid-cols-3">
              <FormField
                control={form.control}
                name="restaurantPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Vibe</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fancy, Casual, Cozy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisinePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Craving</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Italian, Sushi, Tacos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Mood</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Stargazing, Movie, Dancing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <CardFooter className="flex flex-col gap-4 md:flex-row">
            <Button
              onClick={form.handleSubmit(handleGenerateIdea)}
              disabled={isGeneratingIdea}
              className="w-full md:w-auto"
            >
              {isGeneratingIdea ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CalendarHeart className="mr-2 h-4 w-4" />
              )}
              Generate Date Night Idea
            </Button>
            <Button
              onClick={form.handleSubmit(handleGenerateMessage)}
              disabled={isGeneratingMessage}
              variant="secondary"
              className="w-full md:w-auto"
            >
              {isGeneratingMessage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="mr-2 h-4 w-4" />
              )}
              Generate Romantic Message
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {(isGeneratingIdea || ideaResult) && (
          <Card>
            <CardHeader>
              <CardTitle>Your Date Night Idea</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[100px]">
              {isGeneratingIdea && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </div>
              )}
              {ideaResult && (
                <p className="text-lg italic">"{ideaResult}"</p>
              )}
            </CardContent>
          </Card>
        )}
        {(isGeneratingMessage || messageResult) && (
          <Card>
            <CardHeader>
              <CardTitle>Your Romantic Message</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[100px]">
              {isGeneratingMessage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </div>
              )}
              {messageResult && (
                <p className="text-lg italic">"{messageResult}"</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
