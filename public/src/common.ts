export function getIdOrCry(id: string): HTMLElement | null {
  const el: HTMLElement | null = document.getElementById(id);
  if (!el) {
    console.error(`Couldn't find element with id ${id}`);
    return null;
  }
  return el;
}
