import { useCallback, useEffect, useState } from "react";

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryId: string;
  pinned: boolean;
  visitCount: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

const BOOKMARKS_KEY = "ucw_bookmarks";
const CATEGORIES_KEY = "ucw_categories";
const BOOKMARKS_VERSION_KEY = "ucw_bookmarks_version";
const CURRENT_VERSION = "v3";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "ai", name: "AI Tools", order: 0 },
  { id: "photo", name: "Photo Tools", order: 1 },
  { id: "news", name: "News", order: 2 },
  { id: "education", name: "Education", order: 3 },
  { id: "entertainment", name: "Entertainment", order: 4 },
  { id: "productivity", name: "Productivity", order: 5 },
  { id: "voice", name: "Voice & Audio", order: 6 },
];

const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: "bm1",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    description: "AI chatbot by OpenAI",
    categoryId: "ai",
    pinned: true,
    visitCount: 0,
  },
  {
    id: "bm2",
    name: "Gemini",
    url: "https://gemini.google.com",
    description: "Google's AI assistant",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm2b",
    name: "Gemini Pro 3",
    url: "https://gemini.google.com",
    description: "Google Gemini Pro 3 advanced model",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm3",
    name: "Midjourney",
    url: "https://midjourney.com",
    description: "AI image generation",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm4",
    name: "Claude",
    url: "https://claude.ai",
    description: "AI assistant by Anthropic",
    categoryId: "ai",
    pinned: true,
    visitCount: 0,
  },
  {
    id: "bm5",
    name: "Perplexity",
    url: "https://perplexity.ai",
    description: "AI-powered search engine",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_notebooklm",
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    description: "AI-powered research notebook by Google",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_copilot",
    name: "Copilot",
    url: "https://copilot.microsoft.com",
    description: "Microsoft AI assistant powered by GPT-4",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_lmarena",
    name: "LM Arena",
    url: "https://lmarena.ai",
    description: "Compare AI models head-to-head",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_sora",
    name: "Sora",
    url: "https://sora.com",
    description: "AI video generation by OpenAI",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_manus",
    name: "Manus AI",
    url: "https://manus.im",
    description: "Autonomous AI agent platform",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_loveart",
    name: "LoveArt",
    url: "https://loveart.ai",
    description: "AI art generation platform",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_glm",
    name: "GLM (ChatGLM)",
    url: "https://chatglm.cn",
    description: "Powerful Chinese AI language model",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_aistudio",
    name: "Google AI Studio",
    url: "https://aistudio.google.com",
    description: "Build with Gemini models in AI Studio",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_loveable",
    name: "Loveable",
    url: "https://lovable.dev",
    description: "Build full-stack apps with AI",
    categoryId: "ai",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm6",
    name: "Canva",
    url: "https://canva.com",
    description: "Online graphic design platform",
    categoryId: "photo",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm7",
    name: "Adobe Express",
    url: "https://express.adobe.com",
    description: "Quick creative tools by Adobe",
    categoryId: "photo",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm8",
    name: "Remove.bg",
    url: "https://remove.bg",
    description: "Remove image backgrounds instantly",
    categoryId: "photo",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm9",
    name: "Photopea",
    url: "https://photopea.com",
    description: "Free online photo editor",
    categoryId: "photo",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm10",
    name: "BBC News",
    url: "https://bbc.com",
    description: "British Broadcasting Corporation",
    categoryId: "news",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm11",
    name: "CNN",
    url: "https://cnn.com",
    description: "Cable News Network",
    categoryId: "news",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm12",
    name: "Al Jazeera",
    url: "https://aljazeera.com",
    description: "International news network",
    categoryId: "news",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm13",
    name: "Prothom Alo",
    url: "https://prothomalo.com",
    description: "Leading Bangladeshi newspaper",
    categoryId: "news",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm14",
    name: "Khan Academy",
    url: "https://khanacademy.org",
    description: "Free online learning for everyone",
    categoryId: "education",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm15",
    name: "Coursera",
    url: "https://coursera.org",
    description: "Online courses from top universities",
    categoryId: "education",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm16",
    name: "YouTube",
    url: "https://youtube.com",
    description: "Video sharing platform by Google",
    categoryId: "education",
    pinned: true,
    visitCount: 0,
  },
  {
    id: "bm17",
    name: "Wikipedia",
    url: "https://wikipedia.org",
    description: "Free online encyclopedia",
    categoryId: "education",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm18",
    name: "Netflix",
    url: "https://netflix.com",
    description: "Streaming movies and TV shows",
    categoryId: "entertainment",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm19",
    name: "YouTube Music",
    url: "https://music.youtube.com",
    description: "Music streaming by Google",
    categoryId: "entertainment",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm20",
    name: "Spotify",
    url: "https://spotify.com",
    description: "Music & podcast streaming",
    categoryId: "entertainment",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm21",
    name: "Reddit",
    url: "https://reddit.com",
    description: "Community discussion platform",
    categoryId: "entertainment",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_evernote",
    name: "Evernote",
    url: "https://evernote.com",
    description: "Note-taking and organization app",
    categoryId: "productivity",
    pinned: false,
    visitCount: 0,
  },
  {
    id: "bm_elevenlabs",
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    description: "AI Voice Generator — বাংলাসহ যেকোনো ভাষায় ভয়েস তৈরি করুন",
    categoryId: "voice",
    pinned: false,
    visitCount: 0,
  },
];

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const version = localStorage.getItem(BOOKMARKS_VERSION_KEY);
      if (version !== CURRENT_VERSION) {
        // Reset to new defaults when version changes
        localStorage.removeItem(BOOKMARKS_KEY);
        localStorage.setItem(BOOKMARKS_VERSION_KEY, CURRENT_VERSION);
        return DEFAULT_BOOKMARKS;
      }
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const version = localStorage.getItem(BOOKMARKS_VERSION_KEY);
      if (version !== CURRENT_VERSION) {
        localStorage.removeItem(CATEGORIES_KEY);
        return DEFAULT_CATEGORIES;
      }
      const stored = localStorage.getItem(CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const addBookmark = useCallback((bm: Omit<Bookmark, "id" | "visitCount">) => {
    const newBm: Bookmark = { ...bm, id: `bm_${Date.now()}`, visitCount: 0 };
    setBookmarks((prev) => [...prev, newBm]);
  }, []);

  const updateBookmark = useCallback(
    (id: string, updates: Partial<Bookmark>) => {
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      );
    },
    [],
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b)),
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name,
      order: Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setBookmarks((prev) => prev.filter((b) => b.categoryId !== id));
  }, []);

  return {
    bookmarks,
    categories,
    addBookmark,
    updateBookmark,
    removeBookmark,
    togglePin,
    addCategory,
    removeCategory,
  };
}
