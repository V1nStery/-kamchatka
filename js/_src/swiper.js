
const topSwiper = new Swiper(".top-swiper.swiper", {
    slidesPerView: 3.25,
    // spaceBetween: 35,
    speed: 1000,
    loop: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

const dayOneSwiper = new Swiper(".day-1__swiper.swiper,.day-4__swiper.swiper,.day-6__swiper.swiper", {
    slidesPerView: 3.15,
    // spaceBetween: 35,
    speed: 1000,
    loop: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

const dayTwoSwiper = new Swiper(".day-2__swiper.swiper,.day-7__swiper.swiper,.team__swiper.swiper", {
    slidesPerView: 3.27,
    // spaceBetween: 35,
    speed: 1000,
    loop: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

const dayThreeSwiper = new Swiper(".day-3__swiper.swiper,.day-5__swiper.swiper", {
    slidesPerView: 3.9,
    speed: 1000,
    loop: false,
    initialSlide: 1, // второй слайд активный
    
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    
    on: {
        init: function() {
            // 👇 Блокируем кнопку prev при инициализации
            const prevBtn = this.navigation.prevEl;
            if (prevBtn) {
                prevBtn.classList.add('swiper-button-disabled');
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
                prevBtn.style.pointerEvents = 'none';
            }
        },
        slideNextTransitionStart: function() {
            // 👇 Разблокируем кнопку prev при первом нажатии next
            const prevBtn = this.navigation.prevEl;
            if (prevBtn && prevBtn.classList.contains('swiper-button-disabled')) {
                prevBtn.classList.remove('swiper-button-disabled');
                prevBtn.style.opacity = '';
                prevBtn.style.cursor = '';
                prevBtn.style.pointerEvents = '';
            }
        }
    }
});

function updateSwiperButtonPosition() {
    const button = document.querySelector('.team__swiper-button');
    if (!button) return;

    const width = window.innerWidth;

    if (width <= 767.98) {
        // На мобильных экранах убираем right и фиксируем кнопку слева
        button.style.right = '1160px';    // удаляем свойство right
    } else {
        // Для остальных экранов удаляем left, чтобы не мешал
        button.style.left = '';

        // Рассчитываем right по линейной зависимости
        let rightValue;
        if (width >= 1400) {
            rightValue = 2; // базовое значение для ≥1400px
        } else {
            // Для ширины от 768 до 1399: right = 2 + (1400 - width)
            rightValue = 2 + (1400 - width);
        }
        button.style.right = rightValue + 'px';
    }
}

// Запуск при загрузке
updateSwiperButtonPosition();

// Оптимизированный обработчик resize с debounce
let swiperResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(swiperResizeTimer);
    swiperResizeTimer = setTimeout(updateSwiperButtonPosition, 100);
});
