type cssAnim = { in: string, out: string, dt: number };

type UtilityActions = {
  [k: string]: ((this: HTMLDivElement, ev: MouseEvent) => any) | null;
}

type ThemeState   = { css: string, active: boolean };
type ThemeLibrary = { [k: string]: ThemeState };
interface ThemeController {
  lib: ThemeLibrary;
  select:       (string) => void;
  cycleCurrent: (HTMLElement) => void;
}

interface UtilityMenu { title: string; actions: UtilityActions; }

interface ViewScaleDims { width?: string; height?: string; }

interface ViewScalingTable {
  default?: ViewScaleDims;
  min?:     ViewScaleDims;
  max?:     ViewScaleDims;
}

interface ViewSpec {
  id: string;
  name: string;
  template?: string;
  scales?: ViewScalingTable;
  utilities?: UtilityMenu[];
}

interface WindowView {
  id:   string;
  root: HTMLElement;
  spec: ViewSpec;
}

interface TargetContext {
  target:  WindowView;
  proceed: (fn: (WindowView) => void) => void;
}

interface MasterView {
  fullscreenView:   HTMLElement | null,
  mainView:         HTMLElement | null,
  _windowTable:     { [string]: WindowView },

  windowFrom:       (spec: ViewSpec) => WindowView | null,
  getWindow:        (id: string)     => WindowView,
  toggleMain:       (id: string)     => TargetContext,
  toggleFullscreen: (id: string)     => TargetContext,
}
