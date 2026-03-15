const scrollContainers = document.querySelectorAll('.scrolls');

// Функция проверки необходимости скроллбара
const checkScrollbar = (container) => {
    const needsScrollbar = container.scrollWidth <= container.clientWidth;
    container.classList.toggle('force-scrollbar', needsScrollbar);
};

// Инициализация контейнеров
scrollContainers.forEach(container => {
    
    checkScrollbar(container);
    
    // Обработчик колеса мыши
    container.addEventListener('wheel', (e) => {
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    if (!isVerticalScroll) return; // Пропускаем горизонтальную прокрутку
    
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
    
    if (
        (e.deltaY > 0 && canScrollRight) || // Скролл вниз + можно вправо
        (e.deltaY < 0 && canScrollLeft)      // Скролл вверх + можно влево
    ) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
    }
    });
});

// Глобальный обработчик ресайза
const resizeObserver = new ResizeObserver(() => {
    scrollContainers.forEach(checkScrollbar);
});

// Наблюдаем за изменениями размеров каждого контейнера
scrollContainers.forEach(container => {
    resizeObserver.observe(container);
});