import "../css/main.css"
import "../css/anim.css"
import "../css/topnav.css"
import "../css/chat.css"
import "../css/winbar.css"
import "../css/utility-menu.css"

import * as common from "./common"
import * as win from "./window"

function viewMountHandler(id: string, ev: string, fn: EventListener): void {
  common.getIdOrCry(id)?.addEventListener(ev, fn);
}

function main(): void {
  const mv: MasterView = win.createMasterView();

  mv.windowFrom({
    id: "view-chat",
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
            mv.toggleMain("view-chat");
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
