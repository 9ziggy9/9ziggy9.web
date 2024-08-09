type cssAnim = { in: string, out: string, dt: number };

type UtilityFields = {
  [k: string]: ((this: HTMLDivElement, ev: MouseEvent) => any) | null;
}

interface UtilityMenu {
  title: string;
  fields: UtilityFields;
}

interface ViewScaleDims { width?: string; height?: string; }

interface ViewScalingTable {
  default?: ViewScaleDims;
  min?:     ViewScaleDims;
  max?:     ViewScaleDims;
}

interface ViewSpec {
  id: string;
  name: string;
  scales?: ViewScalingTable;
  utilities?: UtilityMenu[];
}

interface WindowView {
  id:   string;
  root: HTMLElement;
  spec: ViewSpec;
}

interface MasterView {
  fullscreenView:   HTMLElement | null,
  mainView:         HTMLElement | null,
  _windowTable:      { [string]: WindowView },

  toggleMain:       (id: string)     => void,
  toggleFullscreen: (id: string)     => void,
  windowFrom:       (spec: ViewSpec) => WindowView | null,
  getWindow:        (id: string)     => WindowView,
}
