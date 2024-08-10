import "../css/main.css"
import "../css/anim.css"
import "../css/topnav.css"
import "../css/chat.css"
import "../css/winbar.css"
import "../css/utility-menu.css"

import * as common from "./common"
import * as win from "./window"
import * as themes from "./themes"

function viewMountHandler(id: string, ev: string, fn: EventListener): void {
  common.getIdOrCry(id)?.addEventListener(ev, fn);
}

function loadThemes(): void {
  themes.bootstrap();
  const btn = common.getIdOrDie("color-theme-btn");
  if (btn) {
    const menu = document.createElement("div");
    menu.classList.add("utility-menu", "hidden");
    document.body.append(menu);
    menu.innerHTML = `<p>hello</p><p>moar</p>`
    btn.addEventListener("click", () => {
      common.revealMenu(btn, menu, common.RevealDir.UP);
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
    utilities: [
      {
        title: "actions",
        fields: {
          connect: () => console.log("hello from chat button"),
          name:    null,
          exit: () => {
            mv.toggleMain("chat");
            Array.from(document.getElementsByClassName("utility-menu"))
              .forEach((el) => el.classList.add("hidden"));
          }
        }
      },
    ]
  });

  viewMountHandler("view-chat-btn",  "click", () => mv.toggleMain("chat"));
}

window.onload = main
