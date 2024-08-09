type cssAnim = { in: string, out: string, dt: number };

type UtilityFields = {
  [k: string]: ((this: HTMLDivElement, ev: MouseEvent) => any) | null;
}

interface UtilityMenu {
  title: string;
  fields: UtilityFields;
}

interface MasterView {
  fullscreenView: HTMLElement | null,
  mainView:       HTMLElement | null,
  toggleMain:       (id: string) => void,
  toggleFullscreen: (id: string) => void,
  winWrap:          (id: string, uts?: UtilitySpec) => void,
}
