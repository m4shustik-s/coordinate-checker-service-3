function createGraph() {
    console.log('Создаю график...');
    const container = document.getElementById('graphContainer');
    if (!container) {
        console.error('graphContainer не найден!');
        return;
    }

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '400');
    svg.setAttribute('id', 'areaGraph');
    svg.style.cursor = 'crosshair';
    svg.style.border = '2px solid #ddd';
    svg.style.borderRadius = '8px';
    svg.style.background = '#f9f9f9';

    // Оси
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0'); xAxis.setAttribute('y1', '200');
    xAxis.setAttribute('x2', '400'); xAxis.setAttribute('y2', '200');
    xAxis.setAttribute('stroke', 'black'); xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '200'); yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '200'); yAxis.setAttribute('y2', '400');
    yAxis.setAttribute('stroke', 'black'); yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);

    // Стрелки
    const xArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    xArrow.setAttribute('points', '395,200 385,195 385,205');
    xArrow.setAttribute('fill', 'black'); svg.appendChild(xArrow);

    const yArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    yArrow.setAttribute('points', '200,5 195,15 205,15');
    yArrow.setAttribute('fill', 'black'); svg.appendChild(yArrow);

    // Подписи осей
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.textContent = 'X'; xLabel.setAttribute('x', '390'); xLabel.setAttribute('y', '190');
    xLabel.setAttribute('style', 'font: 14px Arial; fill: black;'); svg.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.textContent = 'Y'; yLabel.setAttribute('x', '210'); yLabel.setAttribute('y', '15');
    yLabel.setAttribute('style', 'font: 14px Arial; fill: black;'); svg.appendChild(yLabel);

    // Подписи значений
    const labels = [
        {id: 'labelMinusR', x: 100, y: 215, text: '-R', anchor: 'middle'},
        {id: 'labelR', x: 300, y: 215, text: 'R', anchor: 'middle'},
        {id: 'labelTopR', x: 185, y: 100, text: 'R', anchor: 'end'},
        {id: 'labelBottomMinusR', x: 185, y: 300, text: '-R', anchor: 'end'},
        {id: 'labelMinusR2', x: 150, y: 235, text: '-R/2', anchor: 'middle'},
        {id: 'labelR2', x: 250, y: 235, text: 'R/2', anchor: 'middle'},
        {id: 'labelTopR2', x: 170, y: 150, text: 'R/2', anchor: 'end'},
        {id: 'labelBottomMinusR2', x: 170, y: 250, text: '-R/2', anchor: 'end'}
    ];

    labels.forEach(label => {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.textContent = label.text;
        textEl.setAttribute('x', label.x);
        textEl.setAttribute('y', label.y);
        textEl.setAttribute('style', 'font: 12px Arial; fill: #666;');
        textEl.setAttribute('text-anchor', label.anchor);
        if (label.id) textEl.id = label.id;
        svg.appendChild(textEl);
    });

    // Фигуры (области)
    // 1. Четверть круга (левый верхний квадрант)
    const quarterCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    quarterCircle.setAttribute('d', 'M200,150 A50,50 0 0,0 150,200 L200,200 Z');
    quarterCircle.setAttribute('fill', '#3498db');
    quarterCircle.setAttribute('fill-opacity', '0.3');
    quarterCircle.setAttribute('stroke', '#2980b9');
    quarterCircle.setAttribute('stroke-width', '1.5');
    svg.appendChild(quarterCircle);

    // 2. Квадрат (правый верхний квадрант)
    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    square.setAttribute('x', '200');
    square.setAttribute('y', '100');
    square.setAttribute('width', '100');
    square.setAttribute('height', '100');
    square.setAttribute('fill', '#3498db');
    square.setAttribute('fill-opacity', '0.3');
    square.setAttribute('stroke', '#2980b9');
    square.setAttribute('stroke-width', '1.5');
    svg.appendChild(square);

    // 3. Треугольник (правый нижний квадрант)
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points', '200,200 300,200 200,250');
    triangle.setAttribute('fill', '#3498db');
    triangle.setAttribute('fill-opacity', '0.3');
    triangle.setAttribute('stroke', '#2980b9');
    triangle.setAttribute('stroke-width', '1.5');
    svg.appendChild(triangle);

    container.appendChild(svg);
    console.log('График создан');
}

document.addEventListener('DOMContentLoaded', function() {
    const rInput = document.getElementById('r');
    if (rInput) {
        rInput.addEventListener('input', function() {
            // Обновляем подписи на графике
            if (typeof updateRLabels === 'function') {
                updateRLabels();
            }
            // Запускаем валидацию R
            if (typeof validateRField === 'function') {
                validateRField();
            }
        });
    }
});


// Добавь эту функцию в конец файла для инициализации с AJAX
function initializePageForAjax() {
    console.log('Инициализация страницы для AJAX');
    
    // Создай график
    createGraph();
    
    // Инициализируй валидацию
    initializeFormValidation();
    
    // Подпишись на клик
    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.addEventListener('click', onSvgClick);
    }
    
    // Загрузи историю
    setTimeout(() => {
        displayHistoryPoints();
        updateRLabels(); // Обновляем подписи при загрузке
    }, 800);
}

// Замени старую initializePage на эту
window.initializePage = initializePageForAjax;

// Функция для проверки и перерисовки графика после AJAX
function refreshGraphAfterAjax() {
    console.log('Перерисовка графика после AJAX...');

    // Проверяем, существует ли график
    if (!document.getElementById('areaGraph')) {
        console.log('График не найден, создаю заново...');
        createGraph();

        // Добавляем обработчик клика
        const svg = document.getElementById('areaGraph');
        if (svg && typeof onSvgClick === 'function') {
            svg.addEventListener('click', onSvgClick);
        }
    }

    // Загружаем историю точек с задержкой
    setTimeout(function() {
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }
    }, 500);
}

// Обновляем initializePage для работы с AJAX
function initializePage() {
    console.log('Инициализация страницы (AJAX-совместимая)');

    // Создай график если его нет
    if (!document.getElementById('areaGraph')) {
        createGraph();
    } else {
        console.log('График уже существует');
    }

    // Инициализируй валидацию
    if (typeof initializeFormValidation === 'function') {
        initializeFormValidation();
    }

    // Подпишись на клик по графику
    const svg = document.getElementById('areaGraph');
    if (svg) {
        if (typeof onSvgClick === 'function') {
            svg.addEventListener('click', onSvgClick);
        }
    } else {
        console.error('График не найден для установки обработчика');
        // Пробуем снова через 500мс
        setTimeout(function() {
            const svg = document.getElementById('areaGraph');
            if (svg && typeof onSvgClick === 'function') {
                svg.addEventListener('click', onSvgClick);
            }
        }, 500);
    }

    // Загрузи историю с задержкой чтобы таблица успела отрисоваться
    setTimeout(function() {
        console.log('Начинаю загрузку истории...');
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        } else {
            console.error('displayHistoryPoints не найдена!');
        }
    }, 800);
}

// В graph-renderer.js добавьте:
function displayHistoryPoints() {
    console.log('Загрузка истории точек...');

    // Очищаем только точки-результаты
    clearResultPoints();

    const table = document.querySelector('.results-table');
    if (!table) {
        console.log('Таблица результатов не найдена');
        return;
    }

    const rows = table.querySelectorAll('tbody tr');
    console.log(`Найдено ${rows.length} строк в таблице`);

    rows.forEach((row, index) => {
        try {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const x = parseFloat(cells[0].textContent);
                const y = parseFloat(cells[1].textContent);
                const r = parseFloat(cells[2].textContent);
                const hitCell = cells[3];

                // Получаем значение попадания
                const span = hitCell.querySelector('span');
                let hit = false;

                if (span && span.hasAttribute('data-hit')) {
                    hit = span.getAttribute('data-hit') === 'true';
                } else {
                    const spanClass = span ? span.className : hitCell.className;
                    hit = spanClass.includes('hit');
                }

                console.log(`Точка ${index+1}: x=${x}, y=${y}, r=${r}, hit=${hit}`);

                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    addPointToGraph(x, y, r, 'result', hit);
                }
            }
        } catch (e) {
            console.error(`Ошибка точки ${index+1}:`, e);
        }
    });
}

function clearResultPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.querySelectorAll('.result-point').forEach(point => point.remove());
    }
}

function clearAllGraphPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.querySelectorAll('circle').forEach(point => point.remove());
    }
}

// Экспортируйте эти функции
if (typeof window !== 'undefined') {
    window.displayHistoryPoints = displayHistoryPoints;
    window.clearResultPoints = clearResultPoints;
    window.clearAllGraphPoints = clearAllGraphPoints;
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.initializePage = initializePage;
    window.refreshGraphAfterAjax = refreshGraphAfterAjax;
    window.createGraph = createGraph;
    window.displayHistoryPoints = displayHistoryPoints;
    window.clearAllGraphPoints = clearAllGraphPoints;
}