
const html = document.querySelector('html');
const modalTriggers = document.querySelectorAll('.popup-trigger');
const modalClose = document.querySelectorAll('.popup__btn-close');
const popupOverlay = document.querySelector('.popup__overlay');

modalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const { popupTrigger } = trigger.dataset;
    const popupModal = document.querySelector(
      `[data-popup-modal='${popupTrigger}']`
    );

    popupModal.classList.add('is--visible');
    popupOverlay.classList.add('is-blacked-out');
    html.classList.add('html-freeze');

    modalClose.forEach((click) => {
      click.addEventListener('click', () => {
        popupModal.classList.remove('is--visible');
        popupModal.classList.remove(`${popupTrigger}`);
        popupOverlay.classList.remove('is-blacked-out');
        html.classList.remove('html-freeze');
      });
    });

    popupOverlay.addEventListener('click', () => {
      popupModal.classList.remove('is--visible');
      popupOverlay.classList.remove('is-blacked-out');
      html.classList.remove('html-freeze');
    });
  });
});

export default modal;
