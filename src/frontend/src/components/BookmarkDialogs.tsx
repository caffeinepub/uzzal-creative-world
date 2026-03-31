import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { Bookmark, Category } from "../hooks/useBookmarks";

// ── Add / Edit Bookmark Dialog ─────────────────────────────────────────────

interface BookmarkDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Bookmark, "id" | "visitCount">) => void;
  categories: Category[];
  initial?: Bookmark | null;
}

export function BookmarkDialog({
  open,
  onClose,
  onSave,
  categories,
  initial,
}: BookmarkDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? "",
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on initial change
  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setUrl(initial.url);
      setDescription(initial.description);
      setCategoryId(initial.categoryId);
    } else {
      setName("");
      setUrl("");
      setDescription("");
      setCategoryId(categories[0]?.id ?? "");
    }
  }, [initial]);

  const handleSave = () => {
    if (!name.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = `https://${finalUrl}`;
    onSave({
      name: name.trim(),
      url: finalUrl,
      description: description.trim(),
      categoryId,
      pinned: initial?.pinned ?? false,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="bookmark.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="bm-name">Name</Label>
            <Input
              data-ocid="bookmark.input"
              id="bm-name"
              placeholder="e.g. ChatGPT"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bm-url">URL</Label>
            <Input
              data-ocid="bookmark.input"
              id="bm-url"
              placeholder="e.g. chat.openai.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bm-desc">Description</Label>
            <Textarea
              data-ocid="bookmark.textarea"
              id="bm-desc"
              placeholder="Short description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger data-ocid="bookmark.select" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="bookmark.cancel_button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button data-ocid="bookmark.submit_button" onClick={handleSave}>
            {initial ? "Save Changes" : "Add Bookmark"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Category Dialog ────────────────────────────────────────────────────

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function CategoryDialog({ open, onClose, onSave }: CategoryDialogProps) {
  const [name, setName] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when dialog opens
  useEffect(() => {
    if (open) setName("");
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="category.dialog" className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="cat-name">Category Name</Label>
          <Input
            data-ocid="category.input"
            id="cat-name"
            placeholder="e.g. Social Media"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="mt-1.5"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="category.cancel_button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button data-ocid="category.submit_button" onClick={handleSave}>
            Add Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
