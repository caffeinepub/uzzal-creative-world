import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FolderPlus, Pin, Plus, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Bookmark } from "../hooks/useBookmarks";
import { useBookmarks } from "../hooks/useBookmarks";
import BookmarkCard from "./BookmarkCard";
import { BookmarkDialog, CategoryDialog } from "./BookmarkDialogs";

interface HomePageProps {
  canInstall?: boolean;
  onInstall?: () => void;
}

export default function HomePage({ canInstall, onInstall }: HomePageProps) {
  const {
    bookmarks,
    categories,
    addBookmark,
    updateBookmark,
    removeBookmark,
    togglePin,
    addCategory,
  } = useBookmarks();
  const [query, setQuery] = useState("");
  const [showAddBm, setShowAddBm] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [editBm, setEditBm] = useState<Bookmark | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return bookmarks;
    const q = query.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q),
    );
  }, [bookmarks, query]);

  const pinned = filtered.filter((b) => b.pinned);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div
        className="relative py-10 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(var(--background)) 100%)",
          borderBottom: "1px solid oklch(var(--border))",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                U
              </div>
              <h1 className="text-xl font-bold tracking-wider text-foreground uppercase">
                Uzzal Creative World
              </h1>
              {canInstall && (
                <button
                  type="button"
                  data-ocid="home.header.install_button"
                  onClick={onInstall}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all ml-1"
                >
                  <Download size={11} />
                  Install
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Your smart bookmark manager
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onSubmit={handleSearch}
            className="relative"
          >
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              data-ocid="home.search_input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookmarks or press Enter to search Google..."
              className="pl-10 pr-10 h-11 bg-card border-border rounded-xl text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </motion.form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            data-ocid="home.primary_button"
            size="sm"
            onClick={() => setShowAddBm(true)}
            className="gap-1.5 text-xs"
          >
            <Plus size={13} /> Add Bookmark
          </Button>
          <Button
            data-ocid="home.secondary_button"
            size="sm"
            variant="outline"
            onClick={() => setShowAddCat(true)}
            className="gap-1.5 text-xs"
          >
            <FolderPlus size={13} /> New Category
          </Button>
          {query && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
              {query}"
            </Badge>
          )}
        </div>

        {/* Pinned Section */}
        <AnimatePresence>
          {pinned.length > 0 && (
            <motion.section
              key="pinned"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
              data-ocid="home.section"
            >
              <div className="flex items-center gap-2 mb-3">
                <Pin size={13} className="text-primary fill-primary/30" />
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Pinned
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <AnimatePresence>
                  {pinned.map((bm, i) => (
                    <BookmarkCard
                      key={bm.id}
                      bookmark={bm}
                      index={i + 1}
                      onOpen={() =>
                        window.open(bm.url, "_blank", "noopener,noreferrer")
                      }
                      onEdit={() => setEditBm(bm)}
                      onRemove={() => removeBookmark(bm.id)}
                      onTogglePin={() => togglePin(bm.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Category Grids */}
        {sortedCategories.map((cat) => {
          const catBookmarks = filtered.filter((b) => b.categoryId === cat.id);
          if (catBookmarks.length === 0) return null;
          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
              data-ocid="home.section"
            >
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-bold text-foreground">
                  {cat.name}
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  {catBookmarks.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <AnimatePresence>
                  {catBookmarks.map((bm, i) => (
                    <BookmarkCard
                      key={bm.id}
                      bookmark={bm}
                      index={i + 1}
                      onOpen={() =>
                        window.open(bm.url, "_blank", "noopener,noreferrer")
                      }
                      onEdit={() => setEditBm(bm)}
                      onRemove={() => removeBookmark(bm.id)}
                      onTogglePin={() => togglePin(bm.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          );
        })}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-ocid="home.empty_state"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted-foreground text-sm">
              No bookmarks found for "{query}"
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Press Enter to search on Google
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground py-6 border-t border-border mt-4">
        © {new Date().getFullYear()} UZZAL CREATIVE WORLD. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Dialogs */}
      <BookmarkDialog
        open={showAddBm}
        onClose={() => setShowAddBm(false)}
        onSave={addBookmark}
        categories={categories}
      />
      <BookmarkDialog
        open={!!editBm}
        onClose={() => setEditBm(null)}
        onSave={(data) => editBm && updateBookmark(editBm.id, data)}
        categories={categories}
        initial={editBm}
      />
      <CategoryDialog
        open={showAddCat}
        onClose={() => setShowAddCat(false)}
        onSave={addCategory}
      />
    </div>
  );
}
