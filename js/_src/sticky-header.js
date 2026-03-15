function initStickyHeader() {
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", function() {
      const coordWindow = window.scrollY;
      // если координаты окна больше 80, то добавляем класс, иначе - нет
      if (coordWindow >0) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
  }
}

initStickyHeader();


