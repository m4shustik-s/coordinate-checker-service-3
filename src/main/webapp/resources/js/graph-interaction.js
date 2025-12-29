function onSvgClick(evt) {
    console.log('Клик по графику');

    // Проверяем, не идет ли уже AJAX запрос
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
    if (!rInput || !rInput.value.trim()) {
        alert('Сначала введите R (от 1 до 4)');
        rInput.classList.add('invalid');
        return;
    }

    const r = parseFloat(rInput.value.replace(',', '.'));
    if (isNaN(r) || r < 1 || r > 4) {
        alert('R должно быть числом от 1 до 4');
        rInput.classList.add('invalid');
        return;
    }

    // Получаем координаты клика
    const rect = svg.getBoundingClientRect();
    const clickX = (evt.clientX - rect.left - 200) / (100 / r);
    const clickY = (200 - (evt.clientY - rect.top)) / (100 / r);

    console.log(`Координаты клика: X=${clickX.toFixed(2)}, Y=${clickY.toFixed(2)}`);

    // Ограничиваем Y
    let finalY = clickY;
    if (finalY < -3) finalY = -3;
    if (finalY > 5) finalY = 5;

    // Находим ближайшее X из допустимых значений
    const xValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    let closestX = -4;
    let minDiff = Math.abs(-4 - clickX);

    xValues.forEach(val => {
        const diff = Math.abs(val - clickX);
        if (diff < minDiff) {
            minDiff = diff;
            closestX = val;
        }
    });

    console.log(`Выбраны значения: X=${closestX}, Y=${finalY.toFixed(4)}, R=${r}`);

    // Проверяем попадание локально
    const hit = checkHitInJS(closestX, finalY, r);

    // Рисуем временную точку
    clearTempPoints();
    addPointToGraph(clickX, finalY, r, 'temp', hit);

    // Заполняем и отправляем hidden форму
    setTimeout(() => {
        fillAndSubmitHiddenForm(closestX, finalY, r);
    }, 500);
}

// ============================================
// РАБОТА С HIDDEN ФОРМОЙ
// ============================================
function fillAndSubmitHiddenForm(x, y, r) {
    console.log('Заполняем hidden форму:', { x, y, r });

    // Ищем hidden форму
    const graphForm = document.getElementById('graphForm');
    if (!graphForm) {
        console.error('Hidden форма не найдена!');
        clearTempPoints();
        return;
    }

    // Ищем элементы формы (JSF может добавлять префиксы)
    const graphX = findFormElement('graphX', graphForm);
    const graphY = findFormElement('graphY', graphForm);
    const graphR = findFormElement('graphR', graphForm);
    const submitBtn = findFormElement('graphSubmitBtn', graphForm);

    if (!graphX || !graphY || !graphR || !submitBtn) {
        console.error('Не все элементы hidden формы найдены');
        console.log('Доступные input в форме:', graphForm.querySelectorAll('input'));
        clearTempPoints();
        return;
    }

    // Проверяем валидность значений
    if (y < -3 || y > 5 || r < 1 || r > 4) {
        console.error('Значения вне диапазона');
        clearTempPoints();
        return;
    }

    // Заполняем форму
    graphX.value = x;
    graphY.value = y.toFixed(4);
    graphR.value = r;

    console.log('Форма заполнена:', {
        x: graphX.value,
        y: graphY.value,
        r: graphR.value
    });

    // Отправляем форму
    console.log('Отправляем hidden форму...');
    submitBtn.click();
}

// Вспомогательная функция для поиска элементов формы
function findFormElement(elementId, formElement) {
    // Пробуем разные варианты ID (JSF добавляет префиксы)
    const selectors = [
        `[id$="${elementId}"]`,      // заканчивается на elementId
        `[id*="${elementId}"]`,      // содержит elementId
        `#${elementId}`,             // точный ID
        `#${formElement.id}:${elementId}`, // с префиксом формы
        `#mainForm\\:${elementId}`   // с экранированием
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            console.log('Найден элемент по селектору: ${selector}');
            return element;
        }
    }

    return null;
}

function checkHitInJS(x, y, r) {
    const inQuarterCircle = (x <= 0 && y >= 0) &&
                           (x * x + y * y <= (r/2) * (r/2));

    const inSquare = (x >= 0 && x <= r) &&
                    (y >= 0 && y <= r);

    const inTriangle = (x >= 0 && y <= 0) &&
                      (y >= -0.5 * x) &&
                      (x <= r) && (y >= -r/2);

    const result = inQuarterCircle || inSquare || inTriangle;

    console.log('Локальная проверка: круг=${inQuarterCircle}, квадрат=${inSquare}, треугольник=${inTriangle}, итог=${result}');
    return result;
}

function addTempPointToGraph(x, y, r, type, hit) {
    // Вызываем функцию из graph-renderer.js
    if (typeof window.addPointToGraph === 'function') {
        return window.addPointToGraph(x, y, r, type, hit);
    }
}

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
        'labelMinusR2': `-${(r/2).toFixed(1)}`,
        'labelR2': `${(r/2).toFixed(1)}`,
        'labelTopR2': `${(r/2).toFixed(1)}`,
        'labelBottomMinusR2': `-${(r/2).toFixed(1)}`
    };

    for (const [id, text] of Object.entries(labels)) {
        const label = document.getElementById(id);
        if (label) {
            label.textContent = text;
        }
    }

    console.log('Обновлены подписи для R=${r}');
}


function initializeGraphInteractions() {
    console.log('Инициализация взаимодействий с графиком...');

    // 1. Добавляем обработчик клика на график
    attachClickHandler();

    // 2. Настраиваем обработчик изменения R
    setupRChangeListener();

    console.log('Взаимодействия с графиком инициализированы');
}

function attachClickHandler() {
    console.log('Пытаюсь добавить обработчик клика на график...');

    const svg = document.getElementById('areaGraph');
    if (!svg) {
        console.log('График еще не создан, жду...');
        setTimeout(attachClickHandler, 500);
        return;
    }

    // Удаляем старый обработчик если есть
    svg.removeEventListener('click', onSvgClick);

    // Добавляем новый обработчик
    svg.addEventListener('click', onSvgClick);
    console.log('Обработчик клика добавлен на график');
}

function setupRChangeListener() {
    const rInput = document.getElementById('r');
    if (rInput) {
        rInput.removeEventListener('input', handleRChange);
        rInput.addEventListener('input', handleRChange);
        console.log('Обработчик изменения R добавлен');
    }
}

function handleRChange() {
    // Обновляем подписи на графике при изменении R
    if (typeof updateRLabels === 'function') {
        updateRLabels();
    }

    // Запускаем валидацию R
    if (typeof validateRField === 'function') {
        validateRField();
    }
}

(function() {
    console.log('graph-interaction.js загружен');

    function init() {
        console.log('Запускаю инициализацию взаимодействий...');
        initializeGraphInteractions();
    }

    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM загружен, запускаю инициализацию');
            setTimeout(init, 300); // Ждем чтобы график успел создаться
        });
    } else {
        // DOM уже загружен
        console.log('DOM уже загружен, запускаю инициализацию');
        setTimeout(init, 300);
    }
})();


if (typeof window !== 'undefined') {
    window.onSvgClick = onSvgClick;
    window.fillAndSubmitHiddenForm = fillAndSubmitHiddenForm;
    window.checkHitInJS = checkHitInJS;
    window.addPointToGraph = addPointToGraph;
    window.clearTempPoints = clearTempPoints;
    window.updateRLabels = updateRLabels;
    window.initializeGraphInteractions = initializeGraphInteractions;
}