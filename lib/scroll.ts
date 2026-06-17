// lib/scroll.ts — smooth-scroll to a section id (client-only helper, called from
// event handlers in client components).
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
