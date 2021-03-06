export const GuideNav = (el) => {
  const ui = {
    el,
    nav: document.querySelector('.guide__nav'),
    navInner: document.querySelector('.guide__nav-inner'),
    navLists: document.querySelectorAll('.guide__heading + .guide__list'),
    search: el.querySelector('.guide__nav--search .field__native'),
    newElement: document.querySelector('.new-element .input-text .field__native'),
    renameElementTrigger: document.querySelectorAll('[data-modal="rename"]:not(.guide__modal)'),
    removeElementTrigger: document.querySelectorAll('[data-modal="remove"]:not(.guide__modal)')
  };

  const events = {
    keyupWait: undefined
  };

  const init = () => {
    if (ui.nav) {
      ui.nav.addEventListener('click', (e) => {
        const { target } = e;

        // navigaiton toggle open/close
        if (target.classList.contains('guide-nav__open') || target.classList.contains('guide-nav__close')) {
          if (ui.nav.classList.contains('open')) {
            ui.nav.classList.remove('open');
            ui.nav.classList.add('close');
            setTimeout(() => {
              ui.nav.classList.remove('close');
              document.body.style.overflow = '';
            }, 1000);
          } else {
            ui.nav.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        }

        // navigation accordion
        if (target.classList.contains('guide__heading')) {
          if (target.classList.contains('home')) { return; }
          Utils.toggleClass(target.nextSibling, 'hidden');
          e.preventDefault();
        }

        // rename / remove element
        if (target.dataset) {
          if (target.dataset.modal === 'rename') {
            const renameElementForm = document.querySelector('[data-modal="rename"] form');
            renameElementForm.querySelector('[name="name"]').value = target.dataset.name; // eslint-disable-line
            renameElementForm.querySelector('[name="path"]').value = target.dataset.path; // eslint-disable-line
          }

          if (target.dataset.modal === 'remove') {
            const removeElementForm = document.querySelector('[data-modal="remove"] form');
            removeElementForm.querySelector('[name="path"]').value = target.dataset.path; // eslint-disable-line
            renameElementForm.querySelector('[name="location"]').value = target.dataset.location; // eslint-disable-line
          }
        }
      });

      // Navigation search
      const loopList = (value) => {
        Object.keys(ui.navLists).map((i) => {
          const items = ui.navLists[i].querySelectorAll('.list__item');
          let j = items.length;
          let hasMatches = false;

          if (typeof value === 'string') {
            // Searching

            // toggle list visibility by value length
            if (value.length) {
              ui.navLists[i].classList.remove('hidden');
            } else {
              ui.navLists[i].classList.add('hidden');
            }

            // toggle list__items visibility by value match
            while (j--) {
              items[j].classList.add('hidden');
              if (items[j].dataset) {
                if (items[j].dataset.search) {
                  if (items[j].dataset.search.toLowerCase().match(value.toLowerCase())) {
                    items[j].classList.remove('hidden');
                    hasMatches = true;
                  }
                }
              }
            }

            // toggle list parent by all list__items being hidden or not.
            if (hasMatches === false) {
              ui.navLists[i].parentNode.classList.add('hidden');
            } else {
              ui.navLists[i].parentNode.classList.remove('hidden');
            }
          } else {
            // Clearing
            ui.navLists[i].classList.add('hidden');
            while (j--) {
              items[j].classList.remove('hidden');
              ui.navLists[i].parentNode.classList.remove('hidden');
            }
          }

          return true;
        });
      };

      // Searching Events
      ui.search.addEventListener('keyup', () => {
        loopList(ui.search.value);
      });

      ui.search.addEventListener('search', () => {
        loopList(true);
      });

      // Prevent form from searching
      Utils.parents(ui.search, 'form').addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }

    if (ui.newElement) {
      ui.newElementType = document.querySelector('.new-element .guide__select');
      ui.newElementTypeNative = ui.newElementType.querySelector('.field__native');
      ui.newElementContainerOption = document.querySelector('.new-element .input-checkbox');

      ui.newElementType.addEventListener('change', () => {
        if (['atoms', 'molecules', 'organisms', 'modifiers', 'templates'].indexOf(ui.newElementTypeNative.value) === -1) {
          ui.newElementContainerOption.classList.add('hidden');
        } else {
          ui.newElementContainerOption.classList.remove('hidden');
        }
      });

      ui.newElement.addEventListener('keyup', () => {
        if (typeof events.keyupWait !== 'undefined') {
          clearTimeout(events.keyupWait);
        }

        events.keyupWait = setTimeout(() => {
          ui.newElement.value = ui.newElement.value
            .replace(/[A-Z]/g, (g0) => [' ', g0].join(''))
            .replace(
              /(\w)(\w*)/g,
              (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
            ).replace(/ /g, '')
            .replace(/_/g, '')
            .replace(/-/g, '')
            .replace(/'/g, '')
            .trim();
        }, 200);
      });
    }
  };

  init();
};

export default GuideNav;
