const accButtons = document.querySelectorAll(".accordion button")

  accButtons.forEach(button => {
    const content = button.nextElementSibling;

    button.addEventListener('click', () => {

      if (button.classList.contains('active')) {
        button.classList.remove('active')
        content.style.maxHeight = null
        button.setAttribute("aria-expanded", false)
        content.setAttribute("aria-hidden", true)
      }

      else {
        // Array.from(document.querySelectorAll(".accordion button.active")).forEach(function (el) {
        //   el.classList.remove('active');
        // })

        button.classList.add('active')
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.setAttribute("aria-hidden", false)
        button.setAttribute("aria-expanded", true)
      }
    })
  })


  export { accButtons } ;
