import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronRight,
  Eraser,
  Github,
  Mail,
  MessageCircle,
  Scissors,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCredits } from "../../hooks/useCredits";
import BackgroundRemoveTool from "./BackgroundRemoveTool";
import PassportPhotoTool from "./PassportPhotoTool";
import TextRemoveTool from "./TextRemoveTool";

type ToolId = "bg-remove" | "text-remove" | "passport";

interface Tool {
  id: ToolId;
  icon: React.ReactNode;
  namebn: string;
  nameen: string;
  descbn: string;
  color: string;
}

const TOOLS: Tool[] = [
  {
    id: "bg-remove",
    icon: <Wand2 size={24} />,
    namebn: "ব্যাকগ্রাউন্ড মুছুন",
    nameen: "Background Remove",
    descbn: "ছবির ব্যাকগ্রাউন্ড সরিয়ে ট্রান্সপারেন্ট বা সাদা করুন",
    color: "text-purple-400",
  },
  {
    id: "text-remove",
    icon: <Eraser size={24} />,
    namebn: "টেক্সট মুছুন",
    nameen: "Text Remove from Image",
    descbn: "ছবির মধ্যে থাকা লেখা ব্রাশ দিয়ে মুছে ফেলুন",
    color: "text-orange-400",
  },
  {
    id: "passport",
    icon: <Scissors size={24} />,
    namebn: "পাসপোর্ট সাইজ ছবি",
    nameen: "Passport Size Photo",
    descbn: "বাংলাদেশের আইন অনুযায়ী A4 পৃষ্ঠায় ১৫টি পাসপোর্ট ছবি তৈরি করুন",
    color: "text-green-400",
  },
];

const FAQS = [
  {
    id: "faq-credits",
    q: "প্রতিদিন কতটি ক্রেডিট পাব? / How many credits per day?",
    a: "প্রতিদিন ১০টি বিনামূল্যে ক্রেডিট পাবেন যা মধ্যরাতে রিসেট হয়। / You get 10 free credits per day that reset at midnight.",
  },
  {
    id: "faq-formats",
    q: "কোন ফরম্যাটে ছবি আপলোড করা যাবে? / What image formats are supported?",
    a: "JPG, PNG, WebP, GIF সহ সকল সাধারণ ইমেজ ফরম্যাট সাপোর্ট করে। সর্বোচ্চ ১০MB। / All common formats: JPG, PNG, WebP, GIF. Max 10MB.",
  },
  {
    id: "faq-size",
    q: "পাসপোর্ট ছবির সাইজ কত? / What is the passport photo size?",
    a: "বাংলাদেশের পাসপোর্টের জন্য 35mm × 45mm সাইজ প্রযোজ্য। A4 পৃষ্ঠায় ১৫টি ছবি সাজানো হয়। / 35mm × 45mm as per Bangladesh passport regulations.",
  },
  {
    id: "faq-privacy",
    q: "ছবি কি সার্ভারে সেভ হয়? / Are images saved on the server?",
    a: "না, সমস্ত প্রসেসিং আপনার ব্রাউজারে হয়। কোনো ছবি সার্ভারে পাঠানো হয় না। / No, all processing is done in your browser.",
  },
  {
    id: "faq-quality",
    q: "ডাউনলোড করা ছবির মান কেমন? / What quality are downloaded images?",
    a: "JPG ছবি ৯২% মানে, PNG ছবি সম্পূর্ণ মান বজায় রেখে ডাউনলোড হয়। / JPG at 92% quality, PNG at full lossless quality.",
  },
];

const COMMUNITY_LINKS = [
  {
    icon: <MessageCircle size={18} />,
    name: "Telegram Community",
    desc: "Join our Bengali Telegram group",
    href: "https://t.me/",
    color: "text-blue-400",
    ocid: "tools.telegram.link",
  },
  {
    icon: <Github size={18} />,
    name: "GitHub",
    desc: "Report bugs or contribute",
    href: "https://github.com/",
    color: "text-foreground",
    ocid: "tools.github.link",
  },
  {
    icon: <Mail size={18} />,
    name: "Email Support",
    desc: "uzzalcreativeworld@gmail.com",
    href: "mailto:uzzalcreativeworld@gmail.com",
    color: "text-red-400",
    ocid: "tools.email.link",
  },
];

interface ToolsPageProps {
  onBack: () => void;
}

export default function ToolsPage({ onBack }: ToolsPageProps) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [feedback, setFeedback] = useState("");
  const { credits } = useCredits();

  const selectedTool = TOOLS.find((t) => t.id === activeTool);

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast.error("Please write your feedback first");
      return;
    }
    toast.success("ধন্যবাদ! আপনার মতামত পাঠানো হয়েছে / Thank you! Feedback sent.");
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{ background: "oklch(var(--card))" }}
      >
        {activeTool ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setActiveTool(null)}
            data-ocid="tools.back.button"
            className="gap-1.5 text-xs px-2"
          >
            <ArrowLeft size={14} /> ফিরুন / Back
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={onBack}
            data-ocid="tools.home.button"
            className="gap-1.5 text-xs px-2"
          >
            <ArrowLeft size={14} /> হোম / Home
          </Button>
        )}
        <span className="text-sm font-bold text-foreground flex-1">
          {activeTool ? selectedTool?.nameen : "🛠️ Tools"}
        </span>
        <Badge
          variant="outline"
          className="text-xs"
          data-ocid="tools.header.badge"
        >
          {credits}/10 ক্রেডিট
        </Badge>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div
              key="tool-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Tool Cards */}
              <section data-ocid="tools.list">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  ইমেজ টুলস / Image Tools
                </h2>
                <div className="space-y-3">
                  {TOOLS.map((tool, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.25 }}
                      data-ocid={`tools.item.${i + 1}`}
                    >
                      <Card
                        className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                        onClick={() => setActiveTool(tool.id)}
                        data-ocid={`tools.${tool.id}.card`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setActiveTool(tool.id);
                        }}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-card border border-border ${tool.color}`}
                          >
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground">
                              {tool.namebn}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tool.nameen}
                            </p>
                            <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate">
                              {tool.descbn}
                            </p>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-muted-foreground shrink-0"
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Community / Support */}
              <section data-ocid="tools.support.section">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  সাহায্য ও সম্প্রদায় / Help & Community
                </h2>
                <Tabs defaultValue="support" data-ocid="tools.support.tab">
                  <TabsList className="w-full">
                    <TabsTrigger value="support" className="flex-1 text-xs">
                      সাপোর্ট / Support
                    </TabsTrigger>
                    <TabsTrigger value="community" className="flex-1 text-xs">
                      সম্প্রদায় / Community
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="support" className="mt-3 space-y-3">
                    <Accordion
                      type="single"
                      collapsible
                      data-ocid="tools.faq.panel"
                    >
                      {FAQS.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-xs text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <div className="space-y-2" data-ocid="tools.feedback.panel">
                      <p className="text-xs font-medium text-foreground">
                        মতামত দিন / Send Feedback
                      </p>
                      <Textarea
                        placeholder="আপনার মতামত বা সমস্যা লিখুন... / Write your feedback or issue..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        data-ocid="tools.feedback.textarea"
                        className="text-xs min-h-[80px]"
                      />
                      <Button
                        size="sm"
                        onClick={handleFeedbackSubmit}
                        data-ocid="tools.feedback.submit_button"
                        className="gap-1.5 text-xs"
                      >
                        পাঠান / Submit
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="community" className="mt-3">
                    <div className="grid grid-cols-1 gap-3">
                      {COMMUNITY_LINKS.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid={item.ocid}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-card/70 transition-all"
                        >
                          <div className={`shrink-0 ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {item.desc}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            className="ml-auto text-muted-foreground shrink-0"
                          />
                        </a>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {activeTool === "bg-remove" && <BackgroundRemoveTool />}
              {activeTool === "text-remove" && <TextRemoveTool />}
              {activeTool === "passport" && <PassportPhotoTool />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
