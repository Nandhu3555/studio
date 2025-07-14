
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const papers = [
  { id: 1, subject: "Data Structures & Algorithms", year: 2023, semester: "Mid-Term" },
  { id: 2, subject: "Computer Networks", year: 2023, semester: "Final" },
  { id: 3, subject: "Advanced Engineering Mathematics", year: 2022, semester: "Final" },
  { id: 4, subject: "Shigley's Mechanical Engineering Design", year: 2023, semester: "Mid-Term" },
  { id: 5, subject: "Structural Analysis", year: 2022, semester: "Final" },
  { id: 6, subject: "Microelectronic Circuits", year: 2023, semester: "Final" },
];

export default function ExamPapersPage() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Feature Not Available",
      description: "Downloading question papers is not yet implemented.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline text-primary">Exam Question Papers</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse previous year question papers to prepare for your exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {papers.map((paper) => (
          <Card key={paper.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-start gap-3">
                <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="flex-1">{paper.subject}</span>
              </CardTitle>
              <CardDescription>{paper.year} - {paper.semester} Exam</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Future content can go here, like difficulty or topics covered */}
            </CardContent>
            <div className="p-4 pt-0">
               <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
