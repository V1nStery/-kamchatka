document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.reviews-button');
    const innerContainer = document.querySelector('.reviews-list__inner');

    if (button && innerContainer) {
        button.addEventListener('click', () => {
            // Добавляем класс для отображения скрытых блоков
            innerContainer.classList.add('show-all');
        });
    }
});