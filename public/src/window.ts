import * as common from "./common"

const WIN_TOOL_BAR_HTML = `
  <div class="winbar">
    <div class="winbar-left"></div>
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

function _dropUtilityMenu(
  bar: HTMLElement, btn: HTMLElement, menu: HTMLElement
): void {
  /*
    KNOWN BUG:
    If resize happens after a button is pressed, this will lead to drift of
    the menu. This is easy to understand, as there is no recomputation of
    rectbtn.bottom and rectbtn.left.

    TODO: Clicking outside closes dropdown. This should also fix bug.
   */
  menu.classList.toggle("hidden");
  const rectbar = bar.getBoundingClientRect();
  const rectbtn = btn.getBoundingClientRect();
  menu.style.top  = `${rectbar.bottom}px`;
  menu.style.left = `${rectbtn.left}px`;
}

function _injectToolbar(
  id: string, uMap?: UtilityMenu[],
): HTMLElement | undefined | null {
  const rootEl          = common.getIdOrCry(id);
  const winbarContainer = document.createElement("div");
  winbarContainer.innerHTML = WIN_TOOL_BAR_HTML;
  const winbar = winbarContainer.querySelector(".winbar");
  if (winbar) rootEl?.insertBefore(winbar, rootEl.firstChild);
  if (uMap && winbar) {
    const uts = winbar.querySelector(".winbar-left");
    if (uts) {
      uMap.forEach(um => {
        const menuBtn    = document.createElement("div");
        const menuBtnLbl = document.createElement("span");
        menuBtnLbl.innerText = um.title;
        menuBtn.appendChild(menuBtnLbl);
        menuBtn.classList.add("utility-menu-btn")
        const menu = document.createElement("div");
        menu.classList.add("utility-menu", "hidden");
        document.body.appendChild(menu);
        menuBtn.addEventListener(
          "click", () => _dropUtilityMenu(winbar as HTMLElement, menuBtn, menu)
        );
        for (const [lbl, fn] of Object.entries(um.fields)) {
          const div = document.createElement("div");
          div.classList.add("utility-menu-field-btn");
          const spanLabel = document.createElement("span");
          spanLabel.innerText = lbl;
          div.appendChild(spanLabel);
          div.addEventListener("click", fn ? fn : () => {});
          menu.appendChild(div);
        }
        uts.appendChild(menuBtn);
      })
    }
  }
  else console.error("No element with 'winbar' found in HTML.");
  return rootEl;
}

function _wrap(id: string, mv: MasterView, uts?: UtilityMenu[]): void {
  const root = _injectToolbar(id, uts);
  root?.classList.add("hidden", "view-win");
  root
    ?.querySelector(".winbar-close")
    ?.addEventListener("click", () => mv.toggleMain(id));
  root
    ?.querySelector(".winbar-min-max")
    ?.addEventListener("click", () => mv.toggleFullscreen(id));
}

function _classSwitch(
  className: string,
  elIden:    string,
  view:      HTMLElement | null,
  anim?:     cssAnim,
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
      _classSwitch("fullscreen", id, this.fullscreenView, {
        in: "fullscreen-view-in",
        out: "fullscreen-view-out",
        dt: 150
      });
    },

    winWrap: (id: string) => {
      console.error("UNIMPLEMENTED: did you call createMasterView?");
    },
  }
}

export function createMasterView(initId: string = "view-desktop"): MasterView {
  const mv = _createMasterView(initId);
  mv.winWrap = (id: string, uts?: UtilityMenu[]) => _wrap(id, mv, uts);
  return mv;
}
