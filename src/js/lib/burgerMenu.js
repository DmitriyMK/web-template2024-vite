// navigation
const burger = document.getElementById('burger');
const navigation = document.getElementById('navigation');
const html = document.querySelector('html');

const openBurger = () => {
  html.classList.toggle('html-freeze');
  burger.classList.toggle('burger-active');
  navigation.classList.toggle('nav-open');
};

const closeBurger = () => {
  html.classList.remove('html-freeze');
  burger.classList.remove('burger-active');
  navigation.classList.remove('nav-open');
};

if (burger) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    openBurger();
  });

  window.addEventListener('click', (event) => {
    if (!event.target.classList.contains('nav__inner')) {
      closeBurger();
    }
  });
}

export default 'burgerMenu';
