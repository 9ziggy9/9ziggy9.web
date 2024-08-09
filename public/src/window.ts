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

function _dropUtilityMenu(btn: HTMLElement, menu: HTMLElement): void {
  /*
    KNOWN BUG:
    If resize happens after a button is pressed, this will lead to drift of
    the menu. This is easy to understand, as there is no recomputation of
    rectbtn.bottom and rectbtn.left.

    TODO: Clicking outside closes dropdown. This should also fix bug.
   */
  menu.classList.toggle("hidden");
  const rectbtn = btn.getBoundingClientRect();
  menu.style.top  = `${rectbtn.bottom}px`;
  menu.style.left = `${rectbtn.left}px`;
}

function _injectToolbar(spec: ViewSpec): HTMLElement | undefined | null {
  const {id, utilities, template} = spec;
  const root = common.getIdOrCry(id);
  if (!root) return;
  if (template) {
    const tmpl = document.getElementById(template) as HTMLTemplateElement;
    if (tmpl) root.appendChild(tmpl.content);
  }
  const winbarContainer = document.createElement("div");
  winbarContainer.innerHTML = WIN_TOOL_BAR_HTML;
  const winbar = winbarContainer.querySelector(".winbar");
  if (winbar) root.insertBefore(winbar, root.firstChild);
  if (utilities && winbar) {
    const uts = winbar.querySelector(".winbar-left");
    if (uts) {
      utilities.forEach(um => {
        const menuBtn    = document.createElement("div");
        const menuBtnLbl = document.createElement("span");
        menuBtnLbl.innerText = um.title;
        menuBtn.appendChild(menuBtnLbl);
        menuBtn.classList.add("utility-menu-btn")
        const menu = document.createElement("div");
        menu.classList.add("utility-menu", "hidden");
        document.body.appendChild(menu);
        menuBtn.addEventListener("click", () => {
          _dropUtilityMenu(menuBtn, menu);
          menuBtn.classList.toggle("utility-menu-btn-on");
        });
        document.addEventListener("click", (e) =>{
          if (!menuBtn.contains(e.target as Node)
            && !menu.contains(e.target as Node))
          {
            menu.classList.add("hidden");
            menuBtn.classList.remove("utility-menu-btn-on");
          }
        });
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
  return root;
}

function _setSizing(vw: WindowView, override?: ViewScalingTable) {
  /* TODO:
     incorporate appropriate testing so that minWidth/height can be
     appropriately utilized, omitting for simplicity for the time being.
  */
  const source = override ? override : vw.spec.scales;
  if (!source) return;
  vw.root.style.maxWidth  = source.max?.width      as string;
  vw.root.style.maxHeight = source.max?.height     as string;
  vw.root.style.width     = source.default?.width  as string;
  vw.root.style.height    = source.default?.height as string;
}

function _wrapWin(spec: ViewSpec, mv: MasterView): WindowView | null {
  const root = _injectToolbar(spec);
  if (!root) {
    console.error("failed to inject into root view div!");
    return null;
  }
  // TODO: abstract this into ViewSpec as well
  root?.classList.add("hidden", "view-win");
  root
    ?.querySelector(".winbar-close")
    ?.addEventListener("click", () => mv.toggleMain(spec.name));
  root
    ?.querySelector(".winbar-min-max")
    ?.addEventListener("click", () => mv.toggleFullscreen(spec.name));
  const vw = { id: spec.id, root, spec };
  _setSizing(vw);
  return vw
}

async function _classSwitch(
  className: string, viewMe: HTMLElement, view: HTMLElement | null,
  anim?: cssAnim,
): Promise<void> {
  const vmClasses = viewMe.classList;
  if (!vmClasses.contains(className) && anim) {
    vmClasses.add(anim.out);
    return new Promise((res) => {
      setTimeout(() => {
        vmClasses.remove(anim.out);
        vmClasses.add(className, anim.in);
        view?.classList.toggle(className);
        res();
      }, anim.dt);
    })
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
    _windowTable: {},

    getWindow: function(name: string): WindowView {
      return (this._windowTable as any)[name];
    },

    toggleMain: async function(name: string) {
      const vw = this.getWindow(name);
      if (!vw) return;
      await _classSwitch("hidden", vw.root, this.mainView, {
        in:  "win-pop-view-in",
        out: "win-pop-view-out",
        dt:  150
      });
      if (vw.root.classList.contains("fullscreen")) {
        _setSizing(vw); 
        vw.root.classList.remove("fullscreen");
      }
    },

    toggleFullscreen: async function(name: string) {
      const vw = this.getWindow(name);
      if (!vw) return;
      await _classSwitch("fullscreen", vw.root, this.fullscreenView, {
        in:  "fullscreen-view-in",
        out: "fullscreen-view-out",
        dt:  150
      });
      _setSizing(
        vw, vw.root.classList.contains("fullscreen")
          ? ({ default: { width: "100%", height: "100%" },
               max:     { width: "100%", height: "100%" }})
          : undefined );
    },

    windowFrom: function(spec: ViewSpec): WindowView | null {
      console.error("UNIMPLEMENTED: did you call createMasterView?");
      return null;
    },

  }
}

export function createMasterView(initId: string = "view-desktop"): MasterView {
  const mv = _createMasterView(initId);
  mv.windowFrom = (spec: ViewSpec) => {
    const vw = _wrapWin(spec, mv);
    if (!vw) {
      console.error("_wrapWin internal injection error");
      return null;
    }
    (mv._windowTable as any)[spec.name] = vw;
    return vw;
  }
  return mv;
}
