interface MasterView {
  fullscreenView: HTMLElement | null,
  mainView:       HTMLElement | null,
  toggleMain:       (id: string) => void,
  toggleFullscreen: (id: string) => void,
  winWrap:          (id: string) => void,
}
