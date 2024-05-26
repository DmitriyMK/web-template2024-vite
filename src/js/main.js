import "../scss/style.scss";

import sayHello from './lib/sayHello.js';

sayHello();

// navigation
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
const body = document.querySelector('body');

const openBurger = () => {
  body.classList.toggle('body-freeze');
  burger.classList.toggle('burger-active');
  nav.classList.toggle('nav-open');
};

const closeBurger = () => {
  body.classList.remove('body-freeze');
  burger.classList.remove('burger-active');
  nav.classList.remove('nav-open');
};

burger.addEventListener('click', () => {
  openBurger();
});

document.addEventListener('click', (event) => {
  if (
    // event.target.matches('.header__menu-list a') ||
    event.target.closest('.header__menu-list a')
  ) {
    closeBurger();
  }
});
