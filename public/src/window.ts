import * as common from "./common"

const WIN_TOOL_BAR_HTML = `
  <div class="winbar" id="chatbar">
    <div class="winbar-left"><p>chat</p></div>
    <div class="winbar-right">
      <div class="winbar-min-max">
        <span class="material-symbols-outlined">
          fullscreen
        </span>
        <span class="hidden material-symbols-outlined">
          close_fullscreen
        </span>
      </div>
      <span class="winbar-close material-symbols-outlined">
        close
      </span>
    </div>
  </div>
`

function _injectToolbar(id: string): HTMLElement | undefined | null {
  const rootEl          = common.getIdOrCry(id);
  const winbarContainer = document.createElement("div");
  winbarContainer.innerHTML = WIN_TOOL_BAR_HTML;
  const winbar = winbarContainer.querySelector(".winbar");
  if (winbar) rootEl?.insertBefore(winbar, rootEl.firstChild);
  else console.error("No element with 'winbar' found in HTML.");
  return rootEl;
}

function _wrap(id: string, mv: MasterView): void {
  const root = _injectToolbar(id);
  root
    ?.querySelector(".winbar-close")
    ?.addEventListener("click", () => mv.toggleMain(id));
  root
    ?.querySelector(".winbar-min-max")
    ?.addEventListener("click", () => mv.toggleFullscreen(id));
}

type anim = { in: string, out: string, dt: number };

function _classSwitch(
  className: string,
  elIden:    string,
  view:      HTMLElement | null,
  anim?:     anim,
): void {
  const viewMe: HTMLElement | undefined | null = common.getIdOrCry(elIden);
  const vmClasses = viewMe?.classList;
  if (!vmClasses?.contains(className) && anim) {
    vmClasses?.add(anim.out);
    setTimeout(() => {
      vmClasses?.remove(anim.out);
      vmClasses?.add(className, anim.in);
      view?.classList.toggle(className);
    }, anim.dt);
  } else {
    if (anim) vmClasses?.add(anim.in);
    vmClasses?.toggle(className);
    view?.classList.toggle(className);
  }
}

function _createMasterView(initId: string): MasterView {
  return {
    fullscreenView: null,
    mainView: common.getIdOrCry(initId),

    toggleMain: function(id: string) {
      _classSwitch("hidden", id, this.mainView, {
        in: "win-pop-view-in",
        out: "win-pop-view-out",
        dt: 150
      });
    },

    toggleFullscreen: function(id: string) {
      _classSwitch("fullscreen", id, this.fullscreenView);
    },

    winWrap: (id: string) => {
      console.error("UNIMPLEMENTED: did you call createMasterView?")
    },
  }
}

export function createMasterView(initId: string = "view-desktop"): MasterView {
  const mv = _createMasterView(initId);
  mv.winWrap = (id: string) => _wrap(id, mv);
  return mv;
}
