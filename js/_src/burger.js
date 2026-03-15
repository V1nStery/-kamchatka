document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    // Функция для открытия/закрытия меню
    const toggleMenu = () => {
        burgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    };
    
    // Инициализация бургер-меню
    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', toggleMenu);
        
        if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);
    }
});