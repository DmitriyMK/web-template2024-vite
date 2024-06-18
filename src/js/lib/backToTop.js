const SCROLL_GAP = 400;

const backToTopButton = document.getElementById("backToTop");

function handleWindowScroll() {
  if (!backToTopButton) {
    return;
  }

  if (document.documentElement.scrollTop > SCROLL_GAP) {
    backToTopButton.classList.add("_visible");
    return;
  }

  backToTopButton.classList.remove("_visible");
}

window.addEventListener("scroll", handleWindowScroll);

function handleButtonBackToTopClick() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

(function () {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.addEventListener("click", handleButtonBackToTopClick);
})();

export default 'backToTop';
