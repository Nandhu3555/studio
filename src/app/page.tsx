
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Book } from "@/lib/mock-data";
import { useBooks } from "@/context/BookContext";
import { useCategories } from "@/context/CategoryContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const studyYears = [
  "All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All Years");
  const [searchTerm, setSearchTerm] = useState("");
  const { books } = useBooks();
  const { categories } = useCategories();

  const filteredBooks = books
    .filter((book) => activeCategory === "All" || book.category === activeCategory)
    .filter((book) => activeYear === "All Years" || book.studyYear === parseInt(activeYear))
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative text-center md:text-left py-16 md:py-24 rounded-lg overflow-hidden mb-12">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tight">
                      Your Digital Library
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                      Discover a world of knowledge. Find textbooks, references, and more for your B.Tech studies, all in one place.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button size="lg" asChild>
                      <Link href="#browse">
                        Explore Books <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/learn-more">Learn More</Link>
                    </Button>
                  </div>
              </div>
              <div className="hidden md:block">
                  <Image
                      src="https://placehold.co/600x400/3F51B5/E8EAF6"
                      alt="A stack of colorful books."
                      width={600}
                      height={400}
                      className="rounded-lg"
                      priority
                      data-ai-hint="colorful books"
                  />
              </div>
          </div>
      </section>

      <section id="browse" className="scroll-mt-20">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by title or author..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
            <Separator className="w-1/2 mx-auto my-2" />
             <div className="flex flex-wrap justify-center gap-2">
              {studyYears.map((year) => (
                <Button
                  key={year}
                  variant={activeYear === year ? "secondary" : "outline"}
                  onClick={() => setActiveYear(year)}
                  className="rounded-full transition-all duration-300"
                >
                  {year}
                </Button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        {filteredBooks.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-headline font-semibold">No Books Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
            </div>
        )}
      </section>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const [likes, setLikes] = useState(book.likes);
  const [dislikes, setDislikes] = useState(book.dislikes);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="p-0 relative">
        <Badge variant="secondary" className="absolute top-2 right-2 z-10">{book.category}</Badge>
        <Link href={`/book/${book.id}`} className="block overflow-hidden">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            width={400}
            height={600}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={book.data_ai_hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg leading-tight mb-1">
          <Link href={`/book/${book.id}`} className="hover:text-primary transition-colors">
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">by {book.author} ({book.year})</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-like hover:bg-like/10" onClick={() => setLikes(l => l + 1)}>
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground">{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-dislike hover:bg-dislike/10" onClick={() => setDislikes(d => d + 1)}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground">{dislikes}</span>
          </div>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/book/${book.id}`}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
