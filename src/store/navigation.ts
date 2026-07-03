import { create } from "zustand";

export type PageKey = "home" | "work" | "services" | "about" | "contact" | "project";

interface NavigationState {
  currentPage: PageKey;
  previousPage: PageKey;
  selectedProjectId: string | null;
  scrollPosition: Record<string, number>;
  navigate: (page: PageKey) => void;
  openProject: (projectId: string) => void;
  closeProject: () => void;
  saveScrollPosition: (page: string, position: number) => void;
}

export const useNavigation = create<NavigationState>((set, get) => ({
  currentPage: "home",
  previousPage: "home",
  selectedProjectId: null,
  scrollPosition: {},

  navigate: (page: PageKey) => {
    const { currentPage, scrollPosition } = get();
    if (typeof window !== "undefined") {
      scrollPosition[currentPage] = window.scrollY;
    }
    set({
      previousPage: currentPage,
      currentPage: page,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },

  openProject: (projectId: string) => {
    const { scrollPosition, currentPage } = get();
    if (typeof window !== "undefined") {
      scrollPosition[currentPage] = window.scrollY;
    }
    set({ selectedProjectId: projectId, previousPage: get().currentPage, currentPage: "project" });
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  },

  closeProject: () => {
    const prev = get().previousPage;
    const saved = get().scrollPosition[prev] || 0;
    set({ selectedProjectId: null, currentPage: prev });
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
      window.scrollTo({ top: saved, behavior: "instant" });
    }
  },

  saveScrollPosition: (page: string, position: number) => {
    set((state) => ({
      scrollPosition: { ...state.scrollPosition, [page]: position },
    }));
  },
}));