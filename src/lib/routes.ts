import type { ComponentType, LazyExoticComponent } from "react";

export interface RouteDefinition {
  path: string;
  component: LazyExoticComponent<ComponentType>;
  /** If true, rendered inside HomeLayout (shared shell for /surah and /para) */
  nestedInHome?: boolean;
}
