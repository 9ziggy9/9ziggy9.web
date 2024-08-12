import "../css/style.css"

import * as common from "./common"
import * as themes from "./themes"
import * as    win from "./window"

function viewMountHandler(id: string, ev: string, fn: EventListener): void {
  const btn = common.getIdOrCry(id);
  if (!btn) return;
  btn.addEventListener(ev, fn);
}

function loadThemes(): void {
  const themeControl = themes.bootstrap();
  themeControl.select("NINEZIG");
  const btn = common.getIdOrDie("color-theme-btn");
  if (btn) {
    const menu = document.createElement("div");
    menu.classList.add("utility-menu", "hidden");
    document.body.append(menu);
    for (const theme of Object.keys(themeControl.lib)) {
      const curr = common.constructMenuField(menu, theme, () => {
        themeControl.select(theme);
        themeControl.cycleCurrent(curr);
      });
      if (theme == "NINEZIG") themeControl.cycleCurrent(curr);
    }
    btn.addEventListener("click", () => {
      common.revealMenu(btn, menu, common.RevealDir.UP);
      btn.classList.toggle("utility-menu-btn-on");
    });
    common.hideOnUnboundedClick(btn, menu);
  }
}

function main(): void {
  const mv: MasterView = win.createMasterView();

  loadThemes();

  mv.windowFrom({
    id: "view-chat",
    template: "--templ-view-chat",
    name: "chat",
    scales: {
      default: { width: "90%",    height: "90%" },
      max:     { width: "1280px", height: "1040px" }
    },
    exit: function() {
      if (this.toggle) this.toggle();
      Array.from(document.getElementsByClassName("utility-menu"))
        .forEach((el) => el.classList.add("hidden"));
    },
    utilities: [
      {
        title: "run",
        actions: {
          connect: () => console.log("connecting ..."),
          name:    null,
        }
      },
    ]
  });

  mv.attachToggler({
    winName: "chat",
    classId:  "hidden",
    transition: ["win-pop-view-in", "win-pop-view-out", 150],
    onToggle: (vw) => {
      if (vw.root.classList.contains("fullscreen")) mv.resetSizes(vw);
    },
  }),

  viewMountHandler("view-chat-btn", "click",
                   () => (mv.getWindow("chat").toggle as Toggler)());
}

window.onload = main
