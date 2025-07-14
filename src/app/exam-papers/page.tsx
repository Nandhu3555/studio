
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useQuestionPapers } from "@/context/QuestionPaperContext";

const branches = ["All", "Computer Science", "Mechanical", "Electronics", "Civil"];
const studyYears = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function ExamPapersPage() {
  const { papers } = useQuestionPapers();
  const { toast } = useToast();
  const [activeBranch, setActiveBranch] = useState("All");
  const [activeYear, setActiveYear] = useState("All");

  const handleDownload = (paper: { documentUrl: string, subject: string }) => {
    if (!paper.documentUrl) {
      toast({
        variant: "destructive",
        title: "Download Not Available",
        description: "The document for this paper is missing.",
      });
      return;
    }
     const link = document.createElement('a');
      link.href = paper.documentUrl;
      link.download = `${paper.subject.replace(/ /g, '_')}_paper.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `Downloading ${paper.subject} paper.`,
    });
  };
  
  const filteredPapers = papers
    .filter(paper => activeBranch === "All" || paper.branch === activeBranch)
    .filter(paper => activeYear === "All" || paper.studyYear === activeYear);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline text-primary">Exam Question Papers</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse previous year question papers to prepare for your exams.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {branches.map((branch) => (
                <Button
                  key={branch}
                  variant={activeBranch === branch ? "default" : "outline"}
                  onClick={() => setActiveBranch(branch)}
                  className="rounded-full transition-all duration-300"
                >
                  {branch}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPapers.map((paper) => (
          <Card key={paper.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-start gap-3">
                <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="flex-1">{paper.subject}</span>
              </CardTitle>
              <CardDescription>{paper.year} - {paper.semester} Exam</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex gap-2">
                <span className="text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{paper.branch}</span>
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-1 rounded-full">{paper.studyYear}</span>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
               <Button className="w-full" onClick={() => handleDownload(paper)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
        {filteredPapers.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-headline font-semibold">No Papers Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filter criteria.</p>
            </div>
        )}
    </div>
  );
}
