import '../css/main.css'
import '../css/anim.css'
import '../css/topnav.css'
import '../css/chat.css'

function getOrCry(id: string): HTMLElement | null {
  const el: HTMLElement | null = document.getElementById(id);
  if (!el) {
    console.error(`Couldn't find element with id ${id}`);
    return null;
  }
  return el;
}

interface MainViewport {
  currentView: HTMLElement | null,
  currentId:   string,
  toggle:     (id: string) => void
}

function createMainView(initId: string = "view-desktop"): MainViewport {
  return {
    currentView: getOrCry(initId),
    currentId:   initId,
    toggle: function(id: string) {
      const viewMe: HTMLElement | undefined | null = getOrCry(id);
      viewMe?.classList.toggle("hidden");
      this.currentView?.classList.toggle("hidden");
    }
  }
}

function viewMountHandler(id: string, ev: string, fn: EventListener): void {
  getOrCry(id)?.addEventListener(ev, fn);
}

function main(): void {
  const mv: MainViewport = createMainView();
  viewMountHandler("view-chat-btn", "click", () => mv.toggle("view-chat"));
}

window.onload = main
