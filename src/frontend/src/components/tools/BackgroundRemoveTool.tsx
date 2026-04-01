import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, ImageIcon, RefreshCw, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export default function BackgroundRemoveTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tolerance, setTolerance] = useState(30);
  const [hasImage, setHasImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
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
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadImage(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
  };

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const idx = (x: number, y: number) => (y * width + x) * 4;
    const startIdx = idx(startX, startY);
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    const colorDist = (i: number) => {
      const dr = data[i] - startR;
      const dg = data[i + 1] - startG;
      const db = data[i + 2] - startB;
      return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    const threshold = (tolerance / 100) * 441.67;
    const visited = new Uint8Array(width * height);
    const stack: [number, number][] = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const vi = y * width + x;
      if (visited[vi]) continue;
      visited[vi] = 1;
      const i = idx(x, y);
      if (data[i + 3] === 0) continue;
      if (colorDist(i) > threshold) continue;
      data[i + 3] = 0;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    floodFill(x, y);
    toast.success("Background removed!");
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!hasImage) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((touch.clientX - rect.left) * scaleX);
    const y = Math.floor((touch.clientY - rect.top) * scaleY);
    floodFill(x, y);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "background-removed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tmp = document.createElement("canvas");
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const ctx = tmp.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tmp.width, tmp.height);
    ctx.drawImage(canvas, 0, 0);
    const link = document.createElement("a");
    link.download = "background-removed.jpg";
    link.href = tmp.toDataURL("image/jpeg", 0.92);
    link.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasImage(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-base font-bold text-foreground">
        ব্যাকগ্রাউন্ড মুছুন / Background Remove
      </h2>

      {/* Upload zone */}
      {!hasImage && (
        <button
          type="button"
          data-ocid="tools.bg.dropzone"
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
          onDrop={handleDrop}
          onClick={() => document.getElementById("bg-file-input")?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              document.getElementById("bg-file-input")?.click();
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
            id="bg-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
            data-ocid="tools.bg.upload_button"
          />
        </button>
      )}

      {/* Canvas */}
      {hasImage && (
        <div className="space-y-3">
          <div className="bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' width='10' height='10' fill='%23eee'/%3E%3Crect y='10' width='10' height='10' fill='%23eee'/%3E%3C/svg%3E')] rounded-xl overflow-hidden border border-border">
            <canvas
              ref={canvasRef}
              data-ocid="tools.bg.canvas_target"
              className="w-full max-h-[50vh] object-contain cursor-crosshair"
              onClick={handleCanvasClick}
              onKeyDown={() => {}}
              onTouchStart={handleCanvasTouch}
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            👆 ব্যাকগ্রাউন্ডের উপর ক্লিক করুন / Click on background to remove
          </p>

          {/* Tolerance */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              সহনশীলতা / Tolerance: {tolerance}
            </p>
            <Slider
              data-ocid="tools.bg.toggle"
              min={0}
              max={100}
              step={1}
              value={[tolerance]}
              onValueChange={([v]) => setTolerance(v)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={downloadPng}
              data-ocid="tools.bg.primary_button"
              className="gap-1.5 text-xs"
            >
              <Download size={13} /> PNG (Transparent)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadJpg}
              data-ocid="tools.bg.secondary_button"
              className="gap-1.5 text-xs"
            >
              <Download size={13} /> JPG (White BG)
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearCanvas}
              data-ocid="tools.bg.delete_button"
              className="gap-1.5 text-xs"
            >
              <RefreshCw size={13} /> Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() =>
                document.getElementById("bg-new-file-input")?.click()
              }
            >
              <ImageIcon size={13} /> New Image
            </Button>
            <input
              id="bg-new-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
