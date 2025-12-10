function initializeFormValidation() {
    console.log('инициализация валидации');
    const yField = document.getElementById('mainForm:y');
    const rField = document.getElementById('mainForm:r');

    if (yField) {
        yField.addEventListener('input', validateYField);
        validateYField();
    }
    if (rField) {
        rField.addEventListener('input', validateRField);
        validateRField();
    }
}

function validateYField() {
    const yField = document.getElementById('mainForm:y');
    if (!yField) return false;
    const val = yField.value.trim().replace(',', '.');
    yField.classList.remove('valid', 'invalid');
    if (!val) return false;
    const num = parseFloat(val);
    if (isNaN(num)) { yField.classList.add('invalid'); return false; }
    if (num >= -3 && num <= 5) { yField.classList.add('valid'); return true; }
    else { yField.classList.add('invalid'); return false; }
}

function validateRField() {
    const rField = document.getElementById('mainForm:r');
    if (!rField) return false;
    const val = rField.value.trim().replace(',', '.');
    rField.classList.remove('valid', 'invalid');
    if (!val) return false;
    const num = parseFloat(val);
    if (isNaN(num)) { rField.classList.add('invalid'); return false; }
    if (num >= 1 && num <= 4) { rField.classList.add('valid'); return true; }
    else { rField.classList.add('invalid'); return false; }
}

function validateForm() {
    console.log('валидация формы');
    const x = document.getElementById('mainForm:x');
    const y = document.getElementById('mainForm:y');
    const r = document.getElementById('mainForm:r');

    if (!x || !x.value) { alert('выберите x'); return false; }
    if (!y || !y.value) { alert('введите y'); return false; }
    if (!r || !r.value) { alert('введите r'); return false; }

    const yNum = parseFloat(y.value.replace(',', '.'));
    const rNum = parseFloat(r.value.replace(',', '.'));

    if (isNaN(yNum)) { alert('y не число'); return false; }
    if (isNaN(rNum)) { alert('r не число'); return false; }
    if (yNum < -3 || yNum > 5) { alert('y от -3 до 5'); return false; }
    if (rNum < 1 || rNum > 4) { alert('r от 1 до 4'); return false; }

    return true;
}