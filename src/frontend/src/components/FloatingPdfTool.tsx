import { Button } from "@/components/ui/button";
import { ChevronDown, FileDown, Globe, Printer, Type, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export default function FloatingPdfTool() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"page" | "text">("page");
  const [text, setText] = useState("");
  const _printRef = useRef<HTMLDivElement>(null);

  const exportCurrentPage = () => {
    const style = document.createElement("style");
    style.id = "pdf-print-style";
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 20mm;
        }
        body * { visibility: hidden !important; }
        #pdf-floating-btn, #google-translate-widget { display: none !important; }
        .bookmark-grid, [data-ocid="home.section"] { visibility: visible !important; }
        [data-ocid="home.section"] * { visibility: visible !important; }
        [data-ocid="home.section"] { position: relative !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.getElementById("pdf-print-style")?.remove();
    }, 500);
    setOpen(false);
  };

  const exportText = () => {
    if (!text.trim()) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>PDF Export - UZZAL CREATIVE WORLD</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.7;
            color: #1a1a1a;
            white-space: pre-wrap;
            word-break: break-word;
          }
          h1 {
            font-size: 10pt;
            color: #666;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6px;
            margin-bottom: 16px;
          }
        </style>
      </head>
      <body>
        <h1>Exported from UZZAL CREATIVE WORLD</h1>
        ${text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    setOpen(false);
  };

  const exportFullPage = () => {
    const style = document.createElement("style");
    style.id = "pdf-print-style-full";
    style.textContent = `
      @media print {
        @page { size: A4; margin: 15mm; }
        #pdf-floating-btn, #google-translate-widget, nav { display: none !important; }
        body { background: white !important; color: black !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.getElementById("pdf-print-style-full")?.remove();
    }, 500);
    setOpen(false);
  };

  return (
    <>
      {/* Print styles for A4 */}
      <style>{`
        @media print {
          #pdf-floating-btn, #google-translate-widget { display: none !important; }
        }
      `}</style>

      <div
        id="pdf-floating-btn"
        className="fixed left-4 bottom-24 z-50 flex flex-col items-start gap-2"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl shadow-2xl p-4 w-80"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileDown size={16} className="text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    PDF Export (A4)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-3 bg-secondary rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setTab("page")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tab === "page"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Printer size={11} className="inline mr-1" />
                  পেজ প্রিন্ট
                </button>
                <button
                  type="button"
                  onClick={() => setTab("text")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tab === "text"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Type size={11} className="inline mr-1" />
                  টেক্সট থেকে
                </button>
              </div>

              {tab === "page" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    বর্তমান পেজের কন্টেন্ট A4 সাইজে PDF হিসেবে সেভ করুন
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5"
                    onClick={exportFullPage}
                  >
                    <Printer size={13} />
                    পুরো পেজ PDF করুন
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1.5"
                    onClick={exportCurrentPage}
                  >
                    <Globe size={13} />
                    বুকমার্ক সেকশন PDF করুন
                  </Button>
                  <p className="text-[10px] text-muted-foreground/60 text-center mt-1">
                    💡 Chrome → Save as PDF → A4 সিলেক্ট করুন
                  </p>
                </div>
              )}

              {tab === "text" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    যেকোনো ওয়েবসাইট থেকে টেক্সট কপি করে এখানে পেস্ট করুন
                  </p>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="এখানে টেক্সট পেস্ট করুন..."
                    className="w-full h-28 text-xs p-2 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5"
                    onClick={exportText}
                    disabled={!text.trim()}
                  >
                    <FileDown size={13} />
                    A4 PDF সেভ করুন
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground shadow-lg text-xs font-semibold hover:bg-primary/90 transition-all"
        >
          <FileDown size={15} />
          PDF
          <ChevronDown
            size={11}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </motion.button>
      </div>
    </>
  );
}
