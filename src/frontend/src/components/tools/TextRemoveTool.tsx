import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, ImageIcon, RotateCcw, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCredits } from "../../hooks/useCredits";

const MAX_HISTORY = 5;

export default function TextRemoveTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [paintColor, setPaintColor] = useState("#ffffff");
  const [hasImage, setHasImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const { credits, spendCredit } = useCredits();

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      setHasImage(true);
      setHistory([]);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-MAX_HISTORY + 1), snap]);
  }, []);

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  };

  const getCanvasPos = (
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
  ) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const paint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = paintColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    saveHistory();
    setIsPainting(true);
    const pos = getCanvasPos(canvasRef.current!, e.clientX, e.clientY);
    paint(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || !hasImage) return;
    const pos = getCanvasPos(canvasRef.current!, e.clientX, e.clientY);
    paint(pos.x, pos.y);
  };

  const handleMouseUp = () => setIsPainting(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!hasImage) return;
    saveHistory();
    setIsPainting(true);
    const touch = e.touches[0];
    const pos = getCanvasPos(canvasRef.current!, touch.clientX, touch.clientY);
    paint(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isPainting || !hasImage) return;
    const touch = e.touches[0];
    const pos = getCanvasPos(canvasRef.current!, touch.clientX, touch.clientY);
    paint(pos.x, pos.y);
  };

  useEffect(() => {
    const up = () => setIsPainting(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const downloadJpg = () => {
    if (credits <= 0) {
      toast.error("No credits left today. Resets tomorrow!");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    spendCredit();
    const link = document.createElement("a");
    link.download = "text-removed.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          টেক্সট মুছুন / Text Remove
        </h2>
        <Badge
          variant={credits > 0 ? "secondary" : "destructive"}
          data-ocid="tools.credits.badge"
        >
          {credits > 0 ? `${credits} ক্রেডিট বাকি` : "আজকের ক্রেডিট শেষ"}
        </Badge>
      </div>

      {credits <= 0 && (
        <div
          className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
          data-ocid="tools.credits.error_state"
        >
          আজকের ক্রেডিট শেষ। আগামীকাল রিসেট হবে। / Today's credits exhausted.
          Resets tomorrow.
        </div>
      )}

      {!hasImage && (
        <button
          type="button"
          data-ocid="tools.text.dropzone"
          tabIndex={0}
          aria-label="Upload image"
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-card/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
          }}
          onClick={() => document.getElementById("text-file-input")?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              document.getElementById("text-file-input")?.click();
          }}
        >
          <Upload size={32} className="text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              ছবি আপলোড করুন / Upload Image
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop or click • Max 10MB
            </p>
          </div>
          <input
            id="text-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && loadImage(e.target.files[0])
            }
            data-ocid="tools.text.upload_button"
          />
        </button>
      )}

      {hasImage && (
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            data-ocid="tools.text.canvas_target"
            className="w-full max-h-[50vh] object-contain rounded-xl border border-border"
            style={{ cursor: "crosshair" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsPainting(false)}
          />

          <p className="text-xs text-muted-foreground text-center">
            🖌️ টেক্সটের উপর ব্রাশ দিয়ে আঁকুন / Paint over text to remove it
          </p>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                ব্রাশ সাইজ / Brush Size: {brushSize}px
              </p>
              <Slider
                data-ocid="tools.text.toggle"
                min={5}
                max={50}
                step={1}
                value={[brushSize]}
                onValueChange={([v]) => setBrushSize(v)}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">রঙ / Paint Color</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={paintColor}
                  onChange={(e) => setPaintColor(e.target.value)}
                  data-ocid="tools.text.input"
                  className="w-10 h-8 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="text-xs text-muted-foreground">
                  {paintColor}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={downloadJpg}
              data-ocid="tools.text.primary_button"
              className="gap-1.5 text-xs"
            >
              <Download size={13} /> ডাউনলোড JPG / Download JPG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={undo}
              disabled={history.length === 0}
              data-ocid="tools.text.secondary_button"
              className="gap-1.5 text-xs"
            >
              <RotateCcw size={13} /> Undo ({history.length})
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs"
              onClick={() =>
                document.getElementById("text-new-file-input")?.click()
              }
            >
              <ImageIcon size={13} /> New Image
            </Button>
            <input
              id="text-new-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && loadImage(e.target.files[0])
              }
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
