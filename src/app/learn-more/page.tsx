
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowUpRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LearnMorePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="max-w-2xl w-full">
        <Card className="text-center shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
              <BrainCircuit className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-headline">Explore with AI</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Have questions about a topic? Need a concept explained differently? Use the power of AI to deepen your understanding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80">
              Our library encourages leveraging powerful AI tools like ChatGPT to supplement your learning. Ask complex questions, get detailed explanations, and explore subjects beyond your textbooks.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
                Go to ChatGPT <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
            </Button>
        </div>
      </div>
    </div>
  );
}
