"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { books, categories, type Book } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books
    .filter((book) => activeCategory === "All" || book.category === activeCategory)
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tighter">
          Explore Our Digital Library
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the books you need for your B.Tech studies. Browse by category or search for a specific title.
        </p>
      </header>

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
      
      <div className="flex flex-wrap justify-center gap-2 mb-10">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {filteredBooks.length === 0 && (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-headline font-semibold">No Books Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or category filter.</p>
          </div>
      )}
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
        <Link href={`/book/${book.id}`} className="block">
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
        <p className="text-sm text-muted-foreground">by {book.author}</p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => setLikes(l => l + 1)}>
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => setDislikes(d => d + 1)}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span>{dislikes}</span>
          </div>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/book/${book.id}`}>
            Read <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
