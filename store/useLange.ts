import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Lang = "en" | "ja"

type LangState = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "en" ? "ja" : "en" }),
    }),
    { name: "site-lang" } // localStorage key
  )
)
