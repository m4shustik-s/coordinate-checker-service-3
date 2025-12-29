function initializeFormValidation() {
    console.log('Инициализация валидации');
    const yField = document.getElementById('y');
    const rField = document.getElementById('r');

    if (yField) {
        yField.addEventListener('input', validateYField);
        validateYField();
    }
    if (rField) {
        rField.addEventListener('input', validateRField);
        validateRField();
    }
}

function validateFormBeforeSubmit() {
    if (!validateForm()) {
        const x = document.getElementById('x');
        const y = document.getElementById('y');
        const r = document.getElementById('r');

        if (!x.value) alert('Выберите X');
        else if (!y.value.trim()) alert('Введите Y');
        else if (!r.value.trim()) alert('Введите R');

        return false;
    }
    return true;
}

function validateYField() {
    const yField = document.getElementById('y');
    if (!yField) return false;
    const val = yField.value.trim().replace(',', '.');
    yField.classList.remove('valid', 'invalid');

    // Проверка на пустое поле
    if (!val) {
        yField.classList.add('invalid');
        return false;
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
        yField.classList.add('invalid');
        return false;
    }
    if (num > -3 && num < 5) {
        yField.classList.add('valid');
        return true;
    } else {
        yField.classList.add('invalid');
        return false;
    }
}

function validateRField() {
    const rField = document.getElementById('r');
    if (!rField) return false;
    const val = rField.value.trim().replace(',', '.');
    rField.classList.remove('valid', 'invalid');

    // Проверка на пустое поле
    if (!val) {
        rField.classList.add('invalid');
        return false;
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
        rField.classList.add('invalid');
        return false;
    }
    if (num > 1 && num < 4) {
        rField.classList.add('valid');
        return true;
    } else {
        rField.classList.add('invalid');
        return false;
    }
}

function validateForm() {
    console.log('Валидация формы');

    const xSelect = document.getElementById('x');
    const yInput = document.getElementById('y');
    const rInput = document.getElementById('r');

    console.log('x value:', xSelect ? xSelect.value : 'null');
    console.log('y value:', yInput ? yInput.value : 'null');
    console.log('r value:', rInput ? rInput.value : 'null');

    // Проверка X
    if (!xSelect || !xSelect.value || xSelect.value === '') {
        alert('Выберите значение X');
        xSelect.classList.add('invalid');
        return false;
    } else {
        xSelect.classList.remove('invalid');
    }

    // Проверка Y
    if (!yInput || !yInput.value.trim()) {
        alert('Введите значение Y');
        yInput.classList.add('invalid');
        return false;
    }

    // Проверка R
    if (!rInput || !rInput.value.trim()) {
        alert('Введите значение R');
        rInput.classList.add('invalid');
        return false;
    }

    const yNum = parseFloat(yInput.value.replace(',', '.'));
    const rNum = parseFloat(rInput.value.replace(',', '.'));

    if (isNaN(yNum)) {
        alert('Y должно быть числом');
        yInput.classList.add('invalid');
        return false;
    }
    if (isNaN(rNum)) {
        alert('R должно быть числом');
        rInput.classList.add('invalid');
        return false;
    }
    if (yNum < -3 || yNum > 5) {
        alert('Y должно быть от -3 до 5');
        yInput.classList.add('invalid');
        return false;
    }
    if (rNum < 1 || rNum > 4) {
        alert('R должно быть от 1 до 4');
        rInput.classList.add('invalid');
        return false;
    }

    console.log('Валидация пройдена');
    return true;
}

function validateFormBeforeSubmit() {
    console.log('Проверка перед отправкой (AJAX)');

    validateYField();
    validateRField();

    // Затем проверяем всю форму
    if (!validateForm()) {
        return false;
    }

    return true;
}


function refreshAfterAjax() {
    console.log('Обновление после AJAX...');


    validateYField();
    validateRField();

    // Обновляем график через 300мс (после рендера DOM)
    setTimeout(function() {
        if (typeof displayHistoryPoints === 'function') {
            console.log('Вызываю displayHistoryPoints после AJAX');
            displayHistoryPoints();
        }
    }, 300);
}

if (typeof window !== 'undefined') {
    window.refreshAfterAjax = refreshAfterAjax;
}
