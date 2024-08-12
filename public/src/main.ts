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
    common.hideMenuOnMouseEvent(
      common.MouseFlag.UNBOUNDED_CLICK,
      btn, menu
    );
  }
}

function main(): void {
  const mv: MasterView = win.createMasterView();

  loadThemes();

  mv.windowFrom({
    id: "view-chat-uname",
    template: "--templ-view-chat-uname",
    name: "chat-uname",
    header: "enter username",
    exit: function() { if (this.toggle) this.toggle(); },
    scales: {
      default: { width: "30%",    height: "10%" },
      max:     { width: "1280px", height: "1040px" }
    },
  })

  mv.attachToggler({
    winName: "chat-uname",
    classId: "hidden",
    transition: ["win-pop-view-in", "win-pop-view-out", 150],
    onToggle: () => {
      document.getElementById("chat-uname-in")?.focus();
    }
  }),

  mv.windowFrom({
    id: "view-chat",
    template: "--templ-view-chat",
    name: "chat",
    header: "chat",
    fullscreenable: true,
    scales: {
      default: { width: "90%",    height: "90%" },
      max:     { width: "1280px", height: "1040px" }
    },
    exit: function() {
      if (this.toggle) this.toggle();
      mv.getWindow("chat-uname").root.classList.add("hidden");
      Array.from(document.getElementsByClassName("utility-menu"))
        .forEach((el) => el.classList.add("hidden"));
    },
    utilities: [
      {
        title: "run",
        actions: {
          connect: () => console.log("connecting ..."),
          name:    () => (mv.getWindow("chat-uname").toggle as Toggler)(),
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
