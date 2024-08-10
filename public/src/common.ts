export enum RevealDir {
  DOWN = "bottom",
  UP   = "top",
}

export function getIdOrCry(id: string): HTMLElement | null {
  const el: HTMLElement | null = document.getElementById(id);
  if (!el) {
    console.error(`Couldn't find element with id ${id}`);
    return null;
  }
  return el;
}

export function getIdOrDie(id: string): HTMLElement | null {
  const el: HTMLElement | null = document.getElementById(id);
  if (!el) {
    throw Error(`Couldn't find element with id ${id}`);
  }
  return el;
}

export function hideOnUnboundedClick(btn: HTMLElement, menu: HTMLElement) {
  document.addEventListener("click", (e) =>{
    if (!btn.contains(e.target as Node)
      && !menu.contains(e.target as Node))
    {
      menu.classList.add("hidden");
      btn.classList.remove("utility-menu-btn-on");
    }
  });
}

export function revealMenu(
  btn: HTMLElement, menu: HTMLElement, dir: RevealDir
): void {
  console.log("clicked a reveal menu: ", dir);
  menu.classList.toggle("hidden");
  const rectbtn = btn.getBoundingClientRect();
  menu.style[dir === RevealDir.DOWN
    ? RevealDir.UP
    : RevealDir.DOWN
  ]  = `${rectbtn[dir]}px`;
  menu.style.left = `${rectbtn.left}px`;
}

