document.addEventListener('DOMContentLoaded', function() {
    // --- Элементы формы ---
    const form = document.querySelector('.request__form');
    const submitBtn = document.querySelector('.request__button');
    const nameInput = document.getElementById('name');
    const quantityInput = document.getElementById('quantity');
    const radioButtons = document.querySelectorAll('input[name="radio"]');
    const dateHiddenInput = document.getElementById('date-hidden-input');
    
    // --- Функция проверки заполненности обязательных полей ---
    function checkRequiredFields() {
        // Имя (не пустое)
        const nameFilled = nameInput && nameInput.value.trim() !== '';
        
        // Количество (число в пределах min/max)
        let quantityFilled = false;
        if (quantityInput) {
            const val = parseInt(quantityInput.value);
            const min = parseInt(quantityInput.min);
            const max = parseInt(quantityInput.max);
            quantityFilled = !isNaN(val) && val >= min && val <= max;
        }
        
        // Радио (выбран хотя бы один вариант)
        const radioChecked = document.querySelector('input[name="radio"]:checked');
        const radioFilled = !!radioChecked;
        
        // Дата (скрытое поле не пустое)
        const dateFilled = dateHiddenInput && dateHiddenInput.value.trim() !== '';
        
        // Все обязательные поля должны быть заполнены (комментарий пропускаем)
        return nameFilled && quantityFilled && radioFilled && dateFilled;
    }
    
    // --- Функция обновления состояния кнопки ---
    function updateButtonState() {
        if (!submitBtn) return;
        
        const isValid = checkRequiredFields();
        if (isValid) {
            submitBtn.classList.add('active');    // opacity: 1 (нужен соответствующий CSS)
            submitBtn.disabled = false;           // делаем кнопку доступной
        } else {
            submitBtn.classList.remove('active'); // возвращаем полупрозрачность
            submitBtn.disabled = true;            // блокируем отправку
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Получаем выбранный тариф (radio)
        const selectedRadio = document.querySelector('input[name="radio"]:checked');
        const tariff = selectedRadio ? selectedRadio.value : 'не выбран';

        // Получаем дату из скрытого поля
        const date = dateHiddenInput.value; // переменная уже объявлена ранее

        // Получаем комментарий
        const comment = document.getElementById('review').value;

        alert(`Форма отправилась, ваши данные:
    Имя - ${nameInput.value}
    Количество людей - ${quantityInput.value}
    Тариф - ${tariff}
    Даты тура - ${date}
    Комментарий - ${comment}`);
    });
    
    // --- Обработчики на полях ---
    if (nameInput) {
        nameInput.addEventListener('input', updateButtonState);
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', updateButtonState);
        quantityInput.addEventListener('change', updateButtonState);
    }
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateButtonState);
    });
    
    // --- Инициализация кастомного селекта (с добавлением вызова updateButtonState) ---
    const allCustomSelects = document.querySelectorAll('.custom-select-wrapper');
    allCustomSelects.forEach(selectWrapper => {
        const trigger = selectWrapper.querySelector('.custom-select-trigger');
        const valueDisplay = selectWrapper.querySelector('.custom-select-value');
        const optionsList = selectWrapper.querySelector('.custom-options');
        const hiddenInput = selectWrapper.querySelector('#date-hidden-input');
        const options = selectWrapper.querySelectorAll('.custom-option');
    
        // Установка начального значения
        if (valueDisplay && hiddenInput && !hiddenInput.value) {
            hiddenInput.value = valueDisplay.textContent.trim();
        } else if (hiddenInput && hiddenInput.value) {
            valueDisplay.textContent = hiddenInput.value;
            options.forEach(option => {
                if (option.dataset.value === hiddenInput.value) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }
    
        // Открытие/закрытие списка
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            optionsList.style.display = optionsList.style.display === 'flex' ? 'none' : 'flex';
            selectWrapper.classList.toggle('active');
        });
    
        // Выбор опции
        options.forEach(option => {
            option.addEventListener('click', function() {
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                valueDisplay.textContent = this.textContent;
                hiddenInput.value = this.dataset.value;
                optionsList.style.display = 'none';
                selectWrapper.classList.remove('active');
                
                // Важно! После изменения даты вызываем проверку формы
                updateButtonState();
            });
        });
    
        // Закрытие по клику вне селекта
        document.addEventListener('click', function(e) {
            if (!selectWrapper.contains(e.target)) {
                optionsList.style.display = 'none';
                selectWrapper.classList.remove('active');
            }
        });
    });
    
    // --- Обработка количества (минус/плюс) с вызовом проверки ---
    const quantitySelector = document.querySelector('.request__label-quantity');
    if (quantitySelector) { 
        const minusBtn = quantitySelector.querySelector('.minus-btn');
        const plusBtn = quantitySelector.querySelector('.plus-btn');
    
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            let minValue = parseInt(quantityInput.min);
            if (currentValue > minValue) {
                quantityInput.value = currentValue - 1;
                quantityInput.style.color = '#212121';
                updateButtonState(); // проверяем форму после изменения
            }
        });
    
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            let maxValue = parseInt(quantityInput.max);
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
                quantityInput.style.color = '#212121';
                updateButtonState(); // проверяем форму после изменения
            }
        });
    
        quantityInput.addEventListener('change', function() {
            let currentValue = parseInt(quantityInput.value);
            let minValue = parseInt(quantityInput.min);
            let maxValue = parseInt(quantityInput.max);
            quantityInput.style.color = '#212121';
    
            if (isNaN(currentValue) || currentValue < minValue) {
                quantityInput.value = minValue;
            } else if (currentValue > maxValue) {
                quantityInput.value = maxValue;
            }
            updateButtonState(); // проверяем форму после корректировки
        });
    }
    
    // --- Первоначальная проверка при загрузке ---
    updateButtonState();
});