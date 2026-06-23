import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Sparkles, Brain, PenLine, Search } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "AI Creativity & Productivity Tools | TheWordOf Tools",
  description:
    "Leverage AI models to generate high-performing meta details, write social captions, compile ATS-friendly resumes, and format structured prompts.",
});

const tools = [
  {
    title: "Product Description Generator",
    description:
      "Generate structured product titles, specifications, and highlighted benefits using AI.",
    href: "/tools/ai-tools/product-description",
    icon: FileText,
    pro: false,
  },
  {
    title: "AI Caption Gen",
    description:
      "Create platform-optimized captions for Instagram, LinkedIn, and X using Gemini models.",
    href: "/tools/ai-tools/caption-generator",
    icon: Sparkles,
    pro: true,
  },
  {
    title: "AI Prompt Gen",
    description:
      "Build high-quality instructions and expert-level prompts for ChatGPT, Claude, and Gemini.",
    href: "/tools/ai-tools/prompt-generator",
    icon: Brain,
    pro: true,
  },
  {
    title: "AI CV Builder",
    description:
      "Get professional, ATS-optimized executive summaries for your CV or LinkedIn profile.",
    href: "/tools/ai-tools/cv-builder",
    icon: PenLine,
    pro: true,
  },
  {
    title: "AI SEO Generator",
    description:
      "Generate highly optimized page meta titles and descriptions to boost search click-through rates.",
    href: "/tools/ai-tools/seo-generator",
    icon: Search,
    pro: true,
  },
  {
    title: "ATS Score Checker",
    description: "Check your resume against a job description to see your ATS match score.",
    href: "/tools/ai-tools/ats-score-checker",
    icon: Search,
    pro: true,
  },
  {
    title: "Resume Analyzer",
    description: "Get an AI-powered critique and score of your resume with improvement tips.",
    href: "/tools/ai-tools/resume-analyzer",
    icon: FileText,
    pro: true,
  },
];

export default function AiToolsPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          AI Content & SEO Tools
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Leverage LLM integrations to build professional metadata, write
          ATS-friendly summaries, and create engaging social media copy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block h-full"
            >
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    {tool.pro && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
