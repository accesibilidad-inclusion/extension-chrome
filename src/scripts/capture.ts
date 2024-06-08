// Add styles using regular CSS
const style = document.createElement('style');
style.textContent = `
  .pictos-popover {
    position: absolute;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    z-index: 10000;
    display: none;
  }
`;
document.head.appendChild(style);

/**
 * Get interactive elements from the DOM
 * @returns {Element[]} List of interactive elements
 */
const getInteractiveElements = (): Element[] => {
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
  const interactiveRoles = ['button', 'link'];
  const elements = new Set<Element>();

  // Get elements by interactive tags
  interactiveTags.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => elements.add(el));
  });

  // Get elements by ARIA roles
  interactiveRoles.forEach(role => {
    document.querySelectorAll(`[role="${role}"]`).forEach(el => elements.add(el));
  });

  // Get elements with event attributes
  document.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement) {
      if (el.hasAttribute('onclick') || el.hasAttribute('onmouseover') || el.hasAttribute('onfocus')) {
        elements.add(el);
      }
      if (el.hasAttribute('tabindex')) {
        elements.add(el);
      }
    }
  });

  return Array.from(elements);
};

const interactiveElements = getInteractiveElements();

// Create the popover
const popover = document.createElement('div');
popover.classList.add('pictos-popover');
document.body.appendChild(popover);

interactiveElements.forEach((el: Element) => {
  el.addEventListener('mouseover', () => {
    const content = `${el.tagName.toLowerCase()} ${el.textContent?.trim() || ''}`;
    popover.textContent = content;
    popover.style.display = 'block';
    const rect = el.getBoundingClientRect();
    popover.style.left = `${rect.left + window.scrollX}px`;
    popover.style.top = `${rect.bottom + window.scrollY + 5}px`;
  });

  el.addEventListener('mouseout', () => {
    popover.style.display = 'none';
  });

  el.addEventListener('click', () => {

    chrome.runtime.sendMessage({ action: 'pictos__take-screenshot' })

  });
});