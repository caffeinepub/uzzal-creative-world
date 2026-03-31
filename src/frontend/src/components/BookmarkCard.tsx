import { Edit2, ExternalLink, Pin, PinOff, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Bookmark } from "../hooks/useBookmarks";

interface Props {
  bookmark: Bookmark;
  index: number;
  onOpen: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onTogglePin: () => void;
}

export default function BookmarkCard({
  bookmark,
  index,
  onOpen,
  onEdit,
  onRemove,
  onTogglePin,
}: Props) {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}&sz=32`;

  return (
    <motion.div
      data-ocid={`bookmark.item.${index}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      className="group relative bg-card border border-border rounded-lg p-2 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
      onClick={() => window.open(bookmark.url, "_blank", "noopener,noreferrer")}
    >
      {bookmark.pinned && (
        <div className="absolute top-1 right-1 text-primary/60">
          <Pin size={8} className="fill-primary/40" />
        </div>
      )}

      <div className="flex flex-col items-center gap-1 text-center">
        <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={faviconUrl}
            alt={bookmark.name}
            width={18}
            height={18}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="w-full">
          <p className="text-[10px] font-semibold text-foreground truncate leading-tight">
            {bookmark.name}
          </p>
          <p className="text-[9px] text-muted-foreground truncate mt-0.5 leading-tight">
            {bookmark.description}
          </p>
        </div>
      </div>

      {/* Hover action bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-0.5 px-1 py-1 bg-card/95 backdrop-blur-sm border-t border-border rounded-b-lg opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <button
          type="button"
          data-ocid={`bookmark.open_modal_button.${index}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="p-0.5 rounded hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors"
          title="Open"
        >
          <ExternalLink size={10} />
        </button>
        <button
          type="button"
          data-ocid={`bookmark.edit_button.${index}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Edit"
        >
          <Edit2 size={10} />
        </button>
        <button
          type="button"
          data-ocid={`bookmark.toggle.${index}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title={bookmark.pinned ? "Unpin" : "Pin"}
        >
          {bookmark.pinned ? <PinOff size={10} /> : <Pin size={10} />}
        </button>
        <button
          type="button"
          data-ocid={`bookmark.delete_button.${index}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
          title="Remove"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </motion.div>
  );
}
