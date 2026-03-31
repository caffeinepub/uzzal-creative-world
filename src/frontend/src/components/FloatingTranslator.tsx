import { ChevronDown, Languages, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "bn", label: "বাংলা" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "tr", label: "Türkçe" },
  { code: "ur", label: "اردو" },
  { code: "ms", label: "Melayu" },
  { code: "id", label: "Indonesia" },
  { code: "th", label: "ภาษาไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "pl", label: "Polski" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => undefined;
    google?: {
      translate?: {
        TranslateElement?: new (config: object, elementId: string) => undefined;
      };
    };
  }
}

export default function FloatingTranslator() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [_widgetReady, setWidgetReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      new window.google!.translate!.TranslateElement!(
        {
          pageLanguage: "auto",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          layout: 0,
          autoDisplay: false,
        },
        "google_translate_element",
      );
      setWidgetReady(true);
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const translateTo = (langCode: string) => {
    setSelected(langCode);

    // Use Google Translate cookie method
    const setCookie = (name: string, value: string) => {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    };

    if (langCode === "auto") {
      setCookie("googtrans", "/auto/en");
    } else {
      setCookie("googtrans", `/auto/${langCode}`);
      setCookie("googtrans", `/auto/${langCode}`);
    }

    // Trigger Google Translate widget
    const selectEl = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      // Fallback: reload with translation
      window.location.reload();
    }

    setOpen(false);
  };

  const resetTranslation = () => {
    setSelected(null);
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const frame = document.getElementById(
      ":1.container",
    ) as HTMLIFrameElement | null;
    if (frame) {
      const restoreBtn = frame.contentDocument?.getElementById(
        ":1.restore",
      ) as HTMLElement | null;
      restoreBtn?.click();
    } else {
      window.location.reload();
    }
    setOpen(false);
  };

  const selectedLabel = LANGUAGES.find((l) => l.code === selected)?.label;

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Floating Translator Widget */}
      <div
        id="google-translate-widget"
        className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-2"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl shadow-2xl p-4 w-72"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Languages size={16} className="text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    ভাষা অনুবাদ
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

              <p className="text-[11px] text-muted-foreground mb-3">
                Google Translate — যেকোনো ভাষায় পুরো পেজ অনুবাদ করুন
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {LANGUAGES.map((lang) => (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => translateTo(lang.code)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-all border ${
                      selected === lang.code
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/50 text-foreground border-border hover:bg-secondary hover:border-primary/40"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {selected && (
                <button
                  type="button"
                  onClick={resetTranslation}
                  className="w-full mt-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border"
                >
                  ↩ মূল ভাষায় ফিরে যান
                </button>
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
          className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold transition-all ${
            selected
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-card border border-border text-foreground hover:bg-secondary"
          }`}
        >
          <Languages size={15} />
          {selected ? selectedLabel : "Translate"}
          <ChevronDown
            size={11}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </motion.button>
      </div>
    </>
  );
}
