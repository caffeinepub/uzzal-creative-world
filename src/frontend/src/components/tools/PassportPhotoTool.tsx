import { Button } from "@/components/ui/button";
import { Download, Printer, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Bangladesh passport photo: 35mm x 45mm
// At 96dpi: 35mm = ~132px, 45mm = ~170px
// A4 at 96dpi: 210mm x 297mm = 794px x 1123px
// 10mm margin = 38px, 5mm gap = 19px
const PHOTO_W = 132;
const PHOTO_H = 170;
const A4_W = 794;
const A4_H = 1123;
const MARGIN = 38;
const GAP = 19;
const ASPECT = 35 / 45;

export default function PassportPhotoTool() {
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const a4CanvasRef = useRef<HTMLCanvasElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);
  const [a4DataUrl, setA4DataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const drawCropOverlay = useCallback(
    (
      box: { x: number; y: number; w: number; h: number },
      img: HTMLImageElement,
    ) => {
      const canvas = cropCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(box.x, box.y, box.w, box.h);
      ctx.drawImage(
        img,
        (box.x / canvas.width) * img.width,
        (box.y / canvas.height) * img.height,
        (box.w / canvas.width) * img.width,
        (box.h / canvas.height) * img.height,
        box.x,
        box.y,
        box.w,
        box.h,
      );
      ctx.strokeStyle = "#ff2222";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      const hs = 8;
      ctx.fillStyle = "#ff2222";
      const corners = [
        [box.x, box.y],
        [box.x + box.w - hs, box.y],
        [box.x, box.y + box.h - hs],
        [box.x + box.w - hs, box.y + box.h - hs],
      ];
      for (const [cx, cy] of corners) {
        ctx.fillRect(cx, cy, hs, hs);
      }
    },
    [],
  );

  const loadImage = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = cropCanvasRef.current;
        if (!canvas) return;
        const displayW = Math.min(500, img.width);
        const displayH = (img.height / img.width) * displayW;
        canvas.width = displayW;
        canvas.height = displayH;
        const bw = Math.min(displayW * 0.6, displayH * ASPECT);
        const bh = bw / ASPECT;
        const box = {
          x: (displayW - bw) / 2,
          y: (displayH - bh) / 2,
          w: bw,
          h: bh,
        };
        setCropBox(box);
        setImgEl(img);
        setHasImage(true);
        setA4DataUrl(null);
        setCroppedDataUrl(null);
        drawCropOverlay(box, img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [drawCropOverlay],
  );

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

  const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(cropCanvasRef.current!, e.clientX, e.clientY);
    setIsDraggingCrop(true);
    setDragStart({ x: pos.x - cropBox.x, y: pos.y - cropBox.y });
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingCrop || !imgEl) return;
    const canvas = cropCanvasRef.current!;
    const pos = getCanvasPos(canvas, e.clientX, e.clientY);
    const newX = Math.max(
      0,
      Math.min(canvas.width - cropBox.w, pos.x - dragStart.x),
    );
    const newY = Math.max(
      0,
      Math.min(canvas.height - cropBox.h, pos.y - dragStart.y),
    );
    const newBox = { ...cropBox, x: newX, y: newY };
    setCropBox(newBox);
    drawCropOverlay(newBox, imgEl);
  };

  const handleCropTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasPos(
      cropCanvasRef.current!,
      touch.clientX,
      touch.clientY,
    );
    setIsDraggingCrop(true);
    setDragStart({ x: pos.x - cropBox.x, y: pos.y - cropBox.y });
  };

  const handleCropTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDraggingCrop || !imgEl) return;
    const canvas = cropCanvasRef.current!;
    const touch = e.touches[0];
    const pos = getCanvasPos(canvas, touch.clientX, touch.clientY);
    const newX = Math.max(
      0,
      Math.min(canvas.width - cropBox.w, pos.x - dragStart.x),
    );
    const newY = Math.max(
      0,
      Math.min(canvas.height - cropBox.h, pos.y - dragStart.y),
    );
    const newBox = { ...cropBox, x: newX, y: newY };
    setCropBox(newBox);
    drawCropOverlay(newBox, imgEl);
  };

  useEffect(() => {
    const up = () => setIsDraggingCrop(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  const cropPhoto = () => {
    if (!imgEl) return;
    const canvas = cropCanvasRef.current!;
    const scaleX = imgEl.width / canvas.width;
    const scaleY = imgEl.height / canvas.height;
    const tmp = document.createElement("canvas");
    tmp.width = PHOTO_W;
    tmp.height = PHOTO_H;
    const ctx = tmp.getContext("2d")!;
    ctx.drawImage(
      imgEl,
      cropBox.x * scaleX,
      cropBox.y * scaleY,
      cropBox.w * scaleX,
      cropBox.h * scaleY,
      0,
      0,
      PHOTO_W,
      PHOTO_H,
    );
    setCroppedDataUrl(tmp.toDataURL("image/jpeg", 0.95));
    toast.success("ছবি ক্রপ হয়েছে / Photo cropped!");
  };

  const generateA4 = () => {
    if (!croppedDataUrl) return;
    const canvas = a4CanvasRef.current!;
    canvas.width = A4_W;
    canvas.height = A4_H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, A4_W, A4_H);

    const img = new Image();
    img.onload = () => {
      // Place exactly 3 photos: left-to-right, top-aligned
      const positions = [
        { x: MARGIN, y: MARGIN },
        { x: MARGIN + PHOTO_W + GAP, y: MARGIN },
        { x: MARGIN + 2 * (PHOTO_W + GAP), y: MARGIN },
      ];
      for (const { x, y } of positions) {
        ctx.drawImage(img, x, y, PHOTO_W, PHOTO_H);
        ctx.strokeStyle = "#aaaaaa";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, PHOTO_W, PHOTO_H);
      }
      setA4DataUrl(canvas.toDataURL("image/jpeg", 0.95));
      toast.success("A4 লেআউট তৈরি হয়েছে — ৩টি ছবি!");
    };
    img.src = croppedDataUrl;
  };

  const downloadA4 = () => {
    if (!a4DataUrl) return;
    const link = document.createElement("a");
    link.download = "passport-photo-a4.jpg";
    link.href = a4DataUrl;
    link.click();
  };

  const printA4 = () => {
    if (!a4DataUrl) return;
    const printDiv = document.getElementById("passport-print-area");
    if (printDiv) {
      printDiv.innerHTML = `<img src="${a4DataUrl}" style="width:100%;height:auto;" />`;
    }
    window.print();
  };

  const resetTool = () => {
    setHasImage(false);
    setCroppedDataUrl(null);
    setA4DataUrl(null);
  };

  return (
    <>
      <div id="passport-print-area" className="hidden print:block" />

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
          📋 বাংলাদেশ পাসপোর্ট স্পেসিফিকেশন: 35mm × 45mm • A4 পৃষ্ঠায় ৩টি ছবি /{" "}
          <span className="text-primary font-medium">
            BD Passport Spec: 35mm × 45mm • 3 photos on A4 page
          </span>
        </div>

        {/* Upload */}
        {!hasImage && (
          <button
            type="button"
            data-ocid="tools.passport.dropzone"
            tabIndex={0}
            aria-label="Upload photo"
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
            onClick={() =>
              document.getElementById("passport-file-input")?.click()
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                document.getElementById("passport-file-input")?.click();
            }}
          >
            <Upload size={32} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                ছবি আপলোড করুন / Upload Photo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                35:45 অনুপাতে ক্রপ করা হবে / Will be cropped to 35:45 ratio
              </p>
            </div>
            <input
              id="passport-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && loadImage(e.target.files[0])
              }
              data-ocid="tools.passport.upload_button"
            />
          </button>
        )}

        {/* Crop canvas */}
        {hasImage && !croppedDataUrl && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              🔲 লাল বক্সটি টেনে সঠিক জায়গায় রাখুন / Drag the red box to position your
              photo
            </p>
            <canvas
              ref={cropCanvasRef}
              data-ocid="tools.passport.canvas_target"
              className="w-full max-h-[50vh] object-contain rounded-xl border border-border cursor-move"
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={() => setIsDraggingCrop(false)}
              onTouchStart={handleCropTouchStart}
              onTouchMove={handleCropTouchMove}
              onTouchEnd={() => setIsDraggingCrop(false)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={cropPhoto}
                data-ocid="tools.passport.primary_button"
                className="gap-1.5 text-xs"
              >
                ✂️ ক্রপ করুন / Crop Photo
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs"
                onClick={() =>
                  document.getElementById("passport-new-file-input")?.click()
                }
              >
                <Upload size={13} /> New Image
              </Button>
              <input
                id="passport-new-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    resetTool();
                    loadImage(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Cropped preview + A4 */}
        {croppedDataUrl && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  ক্রপ করা ছবি / Cropped Photo
                </p>
                <img
                  src={croppedDataUrl}
                  alt="Cropped passport"
                  className="border-2 border-primary rounded-sm"
                  style={{
                    width: `${PHOTO_W}px`,
                    height: `${PHOTO_H}px`,
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="flex-1 space-y-2 pt-5">
                <Button
                  size="sm"
                  onClick={generateA4}
                  data-ocid="tools.passport.secondary_button"
                  className="gap-1.5 text-xs w-full"
                >
                  🖼️ A4 লেআউট তৈরি করুন / Generate A4 Layout
                </Button>
                <p className="text-[10px] text-muted-foreground">
                  A4 পৃষ্ঠায় ৩টি ছবি / 3 photos on A4 page
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-xs w-full"
                  onClick={() =>
                    document
                      .getElementById("passport-replace-file-input")
                      ?.click()
                  }
                >
                  <Upload size={13} /> নতুন ছবি / New Photo
                </Button>
                <input
                  id="passport-replace-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      resetTool();
                      loadImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* A4 Preview */}
            {a4DataUrl && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-foreground">
                  A4 প্রিভিউ / A4 Preview
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
                    onClick={downloadA4}
                    data-ocid="tools.passport.primary_button"
                    className="gap-1.5 text-xs"
                  >
                    <Download size={13} /> JPG ডাউনলোড / Download JPG
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={printA4}
                    data-ocid="tools.passport.secondary_button"
                    className="gap-1.5 text-xs"
                  >
                    <Printer size={13} /> PDF প্রিন্ট / Print as PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden A4 canvas */}
        <canvas ref={a4CanvasRef} className="hidden" />
      </motion.div>
    </>
  );
}
