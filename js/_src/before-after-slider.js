document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".slider-before-after")) {
    console.log(123);
    const sliders = document.querySelectorAll(".slider-before-after");
    const changes = document.querySelectorAll(".change");
    const body = document.body;

    let isActive = false;

    sliders.forEach(slide => {
      console.log(slide);
      let before = slide.querySelector(".before");
      console.log(before);
      let beforeImage = before.querySelector("img");
      console.log(beforeImage);
      let width = slide.offsetWidth;
      beforeImage.style.width = `${width}px`;
    })

    // Добавляем CSS для отключения стандартного поведения
    changes.forEach(change => {
      change.style.touchAction = 'none';
    });

    for (let i = 0; i < changes.length; i++) {
      changes[i].addEventListener("mousedown", () => {
        isActive = true;
      });
    }

    body.addEventListener("mouseup", () => {
      isActive = false;
    });

    body.addEventListener("mouseleave", () => {
      isActive = false;
    });

    const beforeAfterSlider = (x, slider) => {
      let shift = Math.max(0, Math.min(x, slider.offsetWidth));
      let before = slider.querySelector(".before");
      let change = slider.querySelector(".change");
      before.style.width = `${shift}px`;
      change.style.left = `${shift}px`;
    };

    const pauseEvents = (e) => {
      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    body.addEventListener("mousemove", (e) => {
      if (!isActive) {
        return;
      }
      let slider = e.target.closest(".slider-before-after");

      let x = e.pageX;
      if (!slider) {
        isActive = false;
        return;
      }
      x -= slider.getBoundingClientRect().left;
      beforeAfterSlider(x, slider);
      pauseEvents(e);
    });

    // Исправленные touch-обработчики с {passive: false}
    for (let i = 0; i < changes.length; i++) {
      changes[i].addEventListener("touchstart", (e) => {
        isActive = true;
        // Предотвращаем стандартное поведение для touchstart
        e.preventDefault();
      }, { passive: false });
    }

    body.addEventListener("touchend", () => {
      isActive = false;
    }, { passive: false });

    body.addEventListener("touchcancel", () => {
      isActive = false;
    }, { passive: false });

    body.addEventListener("touchmove", (e) => {
      if (!isActive) {
        return;
      }
      
      let x;
      // Более безопасный способ получить координаты
      if (e.changedTouches && e.changedTouches.length > 0) {
        x = e.changedTouches[0].pageX;
      } else {
        return;
      }

      let slider = e.target.closest(".slider-before-after");
      if (!slider) {
        isActive = false;
        return;
      }
      
      x -= slider.getBoundingClientRect().left;
      beforeAfterSlider(x, slider);
      
      // Предотвращаем прокрутку страницы при перемещении слайдера
      e.preventDefault();
    }, { passive: false });

    // Альтернативный вариант - добавить touch-action в CSS
    const style = document.createElement('style');
    style.textContent = `
      .slider-before-after .change {
        touch-action: none;
      }
    `;
    document.head.appendChild(style);
  }
});
