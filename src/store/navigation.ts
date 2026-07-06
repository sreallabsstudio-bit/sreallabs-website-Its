import { create } from "zustand";

export type PageKey = "home" | "work" | "services" | "about" | "contact" | "project";

/* ═══════════════════════════════════════════════════════════════
   URL ↔ PAGE MAPPING
   ═══════════════════════════════════════════════════════════════ */

export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  work: "/work",
  services: "/services",
  about: "/about",
  contact: "/contact",
};

const PATH_TO_PAGE: Record<string, PageKey> = {
  "/": "home",
  "/work": "work",
  "/services": "services",
  "/about": "about",
  "/contact": "contact",
};

/** Extract the base page key from any URL path */
export function getPageFromPath(pathname: string): PageKey {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  if (PATH_TO_PAGE[trimmed]) return PATH_TO_PAGE[trimmed];
  for (const [path, page] of Object.entries(PATH_TO_PAGE)) {
    if (path !== "/" && pathname.startsWith(path)) return page;
  }
  return "home";
}

interface NavigationState {
  currentPage: PageKey;
  previousPage: PageKey;
  currentProjectSlug: string | null;
  scrollPosition: Record<string, number>;
  initialized: boolean;

  navigate: (page: PageKey) => void;
  /** Navigate to a project's dedicated page by slug */
  navigateToProject: (slug: string) => void;
  /** Initialize from the current browser URL (call once on mount) */
  initFromUrl: () => void;
  saveScrollPosition: (page: string, position: number) => void;
}

export const useNavigation = create<NavigationState>((set, get) => ({
  currentPage: "home",
  previousPage: "home",
  currentProjectSlug: null,
  scrollPosition: {},
  initialized: false,

  /**
   * Navigate to a static page — pushes history and updates URL.
   */
  navigate: (page: PageKey) => {
    const { currentPage, scrollPosition } = get();
    if (currentPage === page && !get().currentProjectSlug) return;

    if (typeof window !== "undefined") {
      scrollPosition[currentPage] = window.scrollY;
    }
    set({
      previousPage: currentPage,
      currentPage: page,
      currentProjectSlug: null,
    });
    if (typeof window !== "undefined") {
      const url = PAGE_PATHS[page] || "/";
      window.history.pushState({ page }, "", url);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },

  /**
   * Navigate to a project's dedicated page.
   * Pushes /work/{slug} into browser history.
   */
  navigateToProject: (slug: string) => {
    const { currentPage, scrollPosition } = get();
    if (typeof window !== "undefined") {
      scrollPosition[currentPage] = window.scrollY;
    }
    set({
      previousPage: currentPage,
      currentPage: "project",
      currentProjectSlug: slug,
    });
    if (typeof window !== "undefined") {
      const url = `/work/${slug}`;
      window.history.pushState({ page: "project", slug }, "", url);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },

  /**
   * Resolve the current browser URL into navigation state.
   * Call once on app mount to handle deep links and refresh.
   */
  initFromUrl: () => {
    if (get().initialized || typeof window === "undefined") return;

    const pathname = window.location.pathname;

    // Check for project deep link: /work/slug
    if (pathname.startsWith("/work/")) {
      const slug = pathname.replace("/work/", "").replace(/\/$/, "");
      if (slug) {
        set({
          currentPage: "project",
          previousPage: "work",
          currentProjectSlug: slug,
          initialized: true,
        });
        return;
      }
    }

    // Regular page deep link
    const page = getPageFromPath(pathname);
    set({
      currentPage: page,
      previousPage: page,
      initialized: true,
    });
  },

  saveScrollPosition: (page: string, position: number) => {
    set((state) => ({
      scrollPosition: { ...state.scrollPosition, [page]: position },
    }));
  },
}));