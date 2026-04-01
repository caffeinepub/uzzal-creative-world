import { Button } from "@/components/ui/button";
import { Download, Printer, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// Bangladesh passport: 35mm x 45mm @ 96dpi
const PHOTO_W = 132; // ~35mm
const PHOTO_H = 170; // ~45mm
const A4_W = 794; // 210mm
const A4_H = 1123; // 297mm
const MARGIN_LEFT = 30;
const MARGIN_TOP = 30;
const GAP = 15;

export default function PassportPhotoTool() {
  const a4CanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [a4DataUrl, setA4DataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি ফাইল আপলোড করুন");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setA4DataUrl(null);
    toast.success("ছবি আপলোড হয়েছে!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const generateA4 = () => {
    if (!previewUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = a4CanvasRef.current!;
      canvas.width = A4_W;
      canvas.height = A4_H;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, A4_W, A4_H);

      for (let i = 0; i < 3; i++) {
        const x = MARGIN_LEFT + i * (PHOTO_W + GAP);
        const y = MARGIN_TOP;

        const srcAspect = img.width / img.height;
        const dstAspect = PHOTO_W / PHOTO_H;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (srcAspect > dstAspect) {
          sw = img.height * dstAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / dstAspect;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, PHOTO_W, PHOTO_H);

        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, PHOTO_W, PHOTO_H);
      }

      setA4DataUrl(canvas.toDataURL("image/jpeg", 0.96));
      toast.success("A4 লেআউট তৈরি হয়েছে — ৩টি ছবি!");
    };
    img.src = previewUrl;
  };

  const downloadJpg = () => {
    if (!a4DataUrl) return;
    const link = document.createElement("a");
    link.download = "passport-photo-a4.jpg";
    link.href = a4DataUrl;
    link.click();
  };

  const printA4 = () => {
    if (!a4DataUrl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Passport Photo</title>
      <style>@page{size:A4;margin:0}body{margin:0}img{width:210mm;height:297mm}</style>
      </head><body><img src="${a4DataUrl}" /></body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const reset = () => {
    setPreviewUrl(null);
    setA4DataUrl(null);
  };

  return (
    <>
      <canvas ref={a4CanvasRef} className="hidden" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-base font-bold text-foreground">
          পাসপোর্ট ছবি / Passport Photo
        </h2>

        <div className="text-xs text-muted-foreground bg-card/50 border border-border rounded-lg px-3 py-2">
          📋 BD Passport: 35mm × 45mm • A4-এ ৩টি ছবি পাশাপাশি, উপর-বাম থেকে শুরু
        </div>

        {!previewUrl && (
          <label
            htmlFor="passport-file-input"
            data-ocid="tools.passport.dropzone"
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all select-none ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-card/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload size={32} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                ছবি আপলোড করুন / Upload Photo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ক্লিক করুন বা ড্র্যাগ করুন / Click or drag &amp; drop
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="passport-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="tools.passport.upload_button"
            />
          </label>
        )}

        {previewUrl && !a4DataUrl && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden bg-black/5">
              <img
                src={previewUrl}
                alt="আপলোড করা ছবি"
                className="w-full max-h-64 object-contain"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={generateA4}
                data-ocid="tools.passport.primary_button"
                className="gap-1.5 text-sm px-5"
              >
                🖼️ Generate A4 Layout (৩টি ছবি)
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={reset}
                className="gap-1.5 text-xs"
              >
                <Upload size={13} /> নতুন ছবি
              </Button>
            </div>
          </div>
        )}

        {a4DataUrl && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-foreground">
              A4 প্রিভিউ — ৩টি পাসপোর্ট ছবি
            </p>
            <img
              src={a4DataUrl}
              alt="A4 layout"
              className="w-full rounded-xl border border-border shadow"
              data-ocid="tools.passport.card"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={downloadJpg}
                data-ocid="tools.passport.primary_button"
                className="gap-1.5 text-xs"
              >
                <Download size={13} /> JPG ডাউনলোড
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={printA4}
                data-ocid="tools.passport.secondary_button"
                className="gap-1.5 text-xs"
              >
                <Printer size={13} /> PDF প্রিন্ট
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={reset}
                className="gap-1.5 text-xs"
              >
                <Upload size={13} /> নতুন জবি
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
