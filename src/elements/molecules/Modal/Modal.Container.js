import _ from 'lodash';

// Private functions
export const Modal = (el) => {
  const ui = {
    modal: el,
    innerWidth: undefined,
    innerHeight: undefined
  };

  // modal history
  const modalHistory = [];

  // checks if window height is smaller than modal height
  const checkHeight = () => {
    const elm = document.querySelector('.modal-visible');
    if (!elm) { return; }

    elm.classList.remove('overflowing');
    elm.classList[
      (window.innerHeight <= (ui.innerWidth.clientHeight + 96)) ? 'add' : 'remove'
    ]('overflowing');
  };

  // window resize event
  const handleWindowResize = _.debounce(() => {
    checkHeight();
  }, 64);

  // Hide instead of close. Usefull in modal history usage.
  const hide = (modal) => {
    if (!modal) { return; }
    modal.setAttribute('data-modal-hide', true);
  };

  // Unhide instead of open. Usefull in modal history usage.
  const unhide = (modal) => {
    if (!modal) { return; }
    modal.removeAttribute('data-modal-hide');
  };

  // Open modal
  const open = (modal, trigger) => {
    if (!modal || !modal.classList) { return; }

    if (modalHistory.length) {
      hide(modalHistory[modalHistory.length - 1]);
    }
    modalHistory.push(modal);

    if (trigger.hasAttribute('href')) {
      modal.dataset.href = trigger.href;
    }

    modal.classList.add('modal-visible');
    modal.removeAttribute('data-modal-hide');

    setTimeout(() => {
      checkHeight();
    });
  };

  // Close modal
  const close = (modal) => {
    if (!modal || !modal.classList) { return; }

    modalHistory.pop();

    if (modalHistory.length) {
      unhide(modalHistory[modalHistory.length - 1]);
    }

    modal.classList.remove('modal-visible');
    modal.removeAttribute('data-modal-hide');
    modal.removeAttribute('data-href');
    window.removeEventListener('resize', handleWindowResize, true);
  };

  const init = () => {
    // prepare a close button for modal
    const closeButton = document.createElement('a');
    closeButton.setAttribute('data-modal-close', true);

    // prepare inner wrapper for modal
    const inner = document.createElement('div');
    inner.classList.add('modal-inner');

    // prepare inner wrapper for width variants
    const innerWidth = document.createElement('div');
    innerWidth.classList.add('modal-inner--width');
    ui.innerWidth = innerWidth;

    // prepare inner wrapper for height scrolling
    const innerHeight = document.createElement('div');
    innerHeight.classList.add('modal-inner--height');
    ui.innerHeight = innerHeight;

    // prepare inner modal content for a hook to modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // compile modal
    modalContent.innerHTML = ui.modal.innerHTML;
    innerHeight.appendChild(modalContent);
    innerWidth.appendChild(closeButton);
    innerWidth.appendChild(innerHeight);
    inner.appendChild(innerWidth);
    ui.modal.innerHTML = '';
    ui.modal.appendChild(inner);

    // drop modal at body level
    document.body.appendChild(ui.modal);

    // one listener to rule them all
    // this allows modals and even targets to be changed or added to the DOM without losing any events.
    if (!window.modals) {
      document.body.addEventListener('click', (e) => {
        const { target } = e; // tell us what was clicked please

        // get our targets modal element
        const getRefModal = (modalId) => {
          const refSelector = ['.modal[data-modal="', modalId, '"]'].join('');
          const refModal = document.querySelector(refSelector);
          if (refModal) { return refModal; }

          return false;
        };

        // if target has no data set, we are done here
        if (target.dataset) {
          // open new modal, from within a modal
          const { dataset } = target;
          const classes = target.classList;
          if (dataset.modal && !classes.contains('modal')) {
            const refModal = getRefModal(dataset.modal);
            if (!refModal) { return; }

            // pass our targets modal element to the open method
            open(refModal, target);
            e.preventDefault();
          }

          // click close button
          if (dataset.modalClose) {
            close(Utils.parents(target, '.modal'));
          }

          // click overlay close modal
          if (classes.contains('modal')) {
            close(target);
          }
        }
      });

      window.modal = true;
    }

    // finally, we run our debounced checkHeight to a window resize listener.
    window.addEventListener('resize', handleWindowResize, true);
  };

  init();
};

export default Modal;