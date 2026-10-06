const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(name, updateHash = true) {
  const target = tabs.find((tab) => tab.dataset.tab === name) || tabs[0];
  tabs.forEach((tab) => {
    const selected = tab === target;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== target.dataset.tab; });
  if (updateHash) history.replaceState(null, '', `#${target.dataset.tab}`);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    activateTab(tabs[next].dataset.tab);
  });
});

document.querySelectorAll('[data-go-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    activateTab(button.dataset.goTab);
    document.querySelector('.tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const caption = lightbox.querySelector('p');
document.querySelectorAll('[data-open-image]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.openImage;
    lightboxImage.alt = button.dataset.alt;
    caption.textContent = button.dataset.alt;
    lightbox.showModal();
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

const initialTab = location.hash.slice(1);
activateTab(['prepare', 'features', 'use'].includes(initialTab) ? initialTab : 'prepare', false);
window.addEventListener('hashchange', () => {
  const name = location.hash.slice(1);
  if (['prepare', 'features', 'use'].includes(name)) activateTab(name, false);
});
