const accButtons = document.querySelectorAll('.accordion__btn');

// const closeAllDrops = () => {
//   accButtons.forEach(() => {

//   });
// };

accButtons.forEach((button) => {
  const content = button.nextElementSibling;

  button.addEventListener('click', (e) => {

    const activePanel = e.target.closest(".accordion__item");
    if (!activePanel) return;

    if (button.classList.contains('_active')) {

      // closeAllDrops();

      button.classList.remove('_active');
      button.setAttribute('aria-expanded', false);
      content.setAttribute('aria-hidden', true);

    } else {

      button.classList.add('_active');
      button.setAttribute('aria-expanded', true);
      content.setAttribute('aria-hidden', false);
    }
  });
});

export default 'accButtons';
