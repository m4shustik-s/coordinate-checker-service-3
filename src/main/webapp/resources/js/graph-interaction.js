
function onSvgClick(evt) {
    console.log('Клик по графику (AJAX)');

    // Если идет AJAX запрос, игнорируем клик
    if (window.ajaxInProgress) {
        console.log('Идет AJAX запрос, игнорируем клик');
        return;
    }

    const svg = document.getElementById('areaGraph');
    if (!svg) {
        console.error('График не найден!');
        return;
    }

    const rInput = document.getElementById('r');
    if (!rInput || !rInput.value) {
        alert('Сначала введите R');
        return;
    }

    const r = parseFloat(rInput.value.replace(',', '.'));
    if (isNaN(r) || r <= 0) {
        alert('R должно быть числом больше 0');
        return;
    }

    const rect = svg.getBoundingClientRect();
    const x = (evt.clientX - rect.left - 200) / (100 / r);
    const y = (200 - (evt.clientY - rect.top)) / (100 / r);

    const hit = checkHitInJS(x, y, r);
    console.log(`Точка (${x.toFixed(2)}, ${y.toFixed(2)}) при R=${r}: ${hit ? 'ПОПАЛА' : 'НЕ ПОПАЛА'}`);

    // Установи X
    const xSelect = document.getElementById('x');
    if (xSelect) {
        let closestValue = '-4';
        let minDiff = Math.abs(-4 - x);

        Array.from(xSelect.options).forEach(option => {
            const optValue = parseFloat(option.value);
            const diff = Math.abs(optValue - x);
            if (diff < minDiff) {
                minDiff = diff;
                closestValue = option.value;
            }
        });

        xSelect.value = closestValue;
        console.log('Выбрано X:', closestValue);
    }

    // Установи Y
    const yInput = document.getElementById('y');
    if (yInput) {
        yInput.value = y.toFixed(4);
        if (typeof validateYField === 'function') {
            validateYField();
        }
    }

    // Рисуем временную точку
    clearTempPoints();
    addPointToGraph(x, y, r, 'temp', hit);

    // Автоотправка через AJAX через 1 секунду
    setTimeout(() => {
        if (typeof validateFormBeforeSubmit === 'function' && validateFormBeforeSubmit()) {
            console.log('Отправка формы после клика по графику');

            // Находим и кликаем по кнопке отправки
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            } else {
                console.error('Кнопка отправки не найдена');
                clearTempPoints();
            }
        } else {
            console.log('Валидация не пройдена');
            clearTempPoints();
        }
    }, 1000);
}

// Остальные функции остаются без изменений
function updateRLabels() {
    const rInput = document.getElementById('r');
    if (!rInput || !rInput.value) return;

    const r = parseFloat(rInput.value.replace(',', '.'));
    if (isNaN(r)) return;

    // Обновляем подписи на графике
    const labels = {
        'labelMinusR': `-${r}`,
        'labelR': `${r}`,
        'labelTopR': `${r}`,
        'labelBottomMinusR': `-${r}`,
        'labelMinusR2': `-${r/2}`,
        'labelR2': `${r/2}`,
        'labelTopR2': `${r/2}`,
        'labelBottomMinusR2': `-${r/2}`
    };

    for (const [id, text] of Object.entries(labels)) {
        const label = document.getElementById(id);
        if (label) {
            label.textContent = text;
        }
    }
}

function checkHitInJS(x, y, r) {
    // 1. Четверть круга: x ≤ 0, y ≥ 0, x² + y² ≤ (R/2)²
    const inQuarterCircle = (x <= 0 && y >= 0) &&
                           (x * x + y * y <= (r/2) * (r/2));

    // 2. Квадрат: 0 ≤ x ≤ R, 0 ≤ y ≤ R
    const inSquare = (x >= 0 && x <= r) &&
                    (y >= 0 && y <= r);

    // 3. Треугольник: 0 ≤ x ≤ R, -R/2 ≤ y ≤ 0, y ≥ -x/2
    const inTriangle = (x >= 0 && y <= 0) &&
                      (y >= -0.5 * x) &&
                      (x <= r) && (y >= -r/2);

    const result = inQuarterCircle || inSquare || inTriangle;

    console.log(`Проверка JS: круг=${inQuarterCircle}, квадрат=${inSquare}, треугольник=${inTriangle}, итог=${result}`);
    return result;
}

function addPointToGraph(x, y, r, type, hit) {
    const svg = document.getElementById('areaGraph');
    if (!svg) return;

    const scale = 100 / r;
    const svgX = 200 + (x * scale);
    const svgY = 200 - (y * scale);

    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.setAttribute('cx', svgX);
    point.setAttribute('cy', svgY);
    point.setAttribute('r', '4');
    point.setAttribute('data-x', x);
    point.setAttribute('data-y', y);
    point.setAttribute('data-r', r);
    point.setAttribute('data-type', type);
    point.setAttribute('data-hit', hit);

    if (type === 'temp') {
        point.setAttribute('class', 'temp-point');
        if (hit) {
            point.setAttribute('fill', '#27ae60');
        } else {
            point.setAttribute('fill', '#e74c3c');
        }
        point.setAttribute('stroke', 'black');
    } else if (type === 'result') {
        if (hit) {
            point.setAttribute('class', 'result-point hit-point');
            point.setAttribute('fill', '#27ae60');
        } else {
            point.setAttribute('class', 'result-point miss-point');
            point.setAttribute('fill', '#e74c3c');
        }
        point.setAttribute('stroke', 'black');
        point.setAttribute('stroke-width', '1');
    }

    svg.appendChild(point);
    console.log(`Нарисована ${type} точка: (${x.toFixed(2)}, ${y.toFixed(2)}), попадание=${hit}, цвет=${hit ? 'зеленый' : 'красный'}`);
}

function clearTempPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.querySelectorAll('.temp-point').forEach(p => p.remove());
    }
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.onSvgClick = onSvgClick;
    window.updateRLabels = updateRLabels;
    window.checkHitInJS = checkHitInJS;
    window.addPointToGraph = addPointToGraph;
    window.clearTempPoints = clearTempPoints;
}