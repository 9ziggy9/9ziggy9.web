import "../css/main.css"
import "../css/anim.css"
import "../css/topnav.css"
import "../css/chat.css"
import "../css/winbar.css"

import * as common from "./common"
import * as win from "./window"

function viewMountHandler(id: string, ev: string, fn: EventListener): void {
  common.getIdOrCry(id)?.addEventListener(ev, fn);
}

function main(): void {
  const mv: MasterView = win.createMasterView();
  mv.winWrap("view-chat");

  viewMountHandler("view-chat-btn",  "click", () => mv.toggleMain("view-chat"));
}

window.onload = main
