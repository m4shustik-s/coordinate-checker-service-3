function createGraph() {
    console.log('Создаю график...');

    const container = document.getElementById('graphContainer');
    if (!container) {
        console.error('graphContainer не найден!');
        return;
    }

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем SVG элемент
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '400');
    svg.setAttribute('id', 'areaGraph');
    svg.style.cssText = `
        cursor: crosshair;
        border: 2px solid #ddd;
        border-radius: 8px;
        background: #f9f9f9;
        display: block;
    `;

    createAxes(svg);

    createArrows(svg);

    createAxisLabels(svg);

    createValueLabels(svg);

    createShapes(svg);

    container.appendChild(svg);

    console.log('График создан');
    return svg;
}


function createAxes(svg) {
    // Ось X
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', '200');
    xAxis.setAttribute('x2', '400');
    xAxis.setAttribute('y2', '200');
    xAxis.setAttribute('stroke', 'black');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);

    // Ось Y
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '200');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '200');
    yAxis.setAttribute('y2', '400');
    yAxis.setAttribute('stroke', 'black');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
}

function createArrows(svg) {
    // Стрелка оси X
    const xArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    xArrow.setAttribute('points', '395,200 385,195 385,205');
    xArrow.setAttribute('fill', 'black');
    svg.appendChild(xArrow);

    // Стрелка оси Y
    const yArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    yArrow.setAttribute('points', '200,5 195,15 205,15');
    yArrow.setAttribute('fill', 'black');
    svg.appendChild(yArrow);
}

function createAxisLabels(svg) {
    // Подпись оси X
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.textContent = 'X';
    xLabel.setAttribute('x', '390');
    xLabel.setAttribute('y', '190');
    xLabel.setAttribute('style', 'font: 14px Arial; fill: black;');
    svg.appendChild(xLabel);

    // Подпись оси Y
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.textContent = 'Y';
    yLabel.setAttribute('x', '210');
    yLabel.setAttribute('y', '15');
    yLabel.setAttribute('style', 'font: 14px Arial; fill: black;');
    svg.appendChild(yLabel);
}

function createValueLabels(svg) {
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
}

function createShapes(svg) {
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
}


function addPointToGraph(x, y, r, type, hit) {
    const svg = document.getElementById('areaGraph');
    if (!svg) {
        console.error('График не найден для добавления точки');
        return;
    }

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

    // Устанавливаем классы для CSS стилизации
    if (type === 'temp') {
        point.setAttribute('class', 'temp-point');
    } else if (type === 'result') {
        point.setAttribute('class', hit ? 'result-point hit-point' : 'result-point miss-point');
    }

    svg.appendChild(point);
    console.log('Добавлена ${type} точка: (${x.toFixed(2)}, ${y.toFixed(2)}), попадание=${hit}, классы=${point.getAttribute('class')}');
    return point;
}

function clearTempPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        const tempPoints = svg.querySelectorAll('.temp-point');
        tempPoints.forEach(point => point.remove());
        console.log('Удалено ${tempPoints.length} временных точек');
    }
}

function clearResultPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        const resultPoints = svg.querySelectorAll('.result-point');
        resultPoints.forEach(point => point.remove());
        console.log('Удалено ${resultPoints.length} точек-результатов');
    }
}

function clearAllGraphPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        const allPoints = svg.querySelectorAll('circle');
        allPoints.forEach(point => point.remove());
        console.log('Удалено ${allPoints.length} всех точек');
    }
}

function updateRLabels() {
    const rInput = document.getElementById('r');
    if (!rInput || !rInput.value) return;

    const r = parseFloat(rInput.value.replace(',', '.'));
    if (isNaN(r) || r <= 0) return;

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


function displayHistoryPoints() {
    console.log('Загрузка истории точек...');

    // Убеждаемся, что график существует
    ensureGraphExists();

    // Даем время на создание графика если нужно
    setTimeout(loadPointsFromTable, 100);
}

function loadPointsFromTable() {
    const svg = document.getElementById('areaGraph');
    if (!svg) {
        console.error('График не найден для загрузки точек');
        return;
    }

    // Очищаем старые точки-результаты
    clearResultPoints();

    const table = document.querySelector('.results-table');
    if (!table) {
        console.log('Таблица результатов не найдена');
        return;
    }

    const rows = table.querySelectorAll('tbody tr');
    console.log('Найдено ${rows.length} строк в таблице');

    let loadedCount = 0;
    rows.forEach((row, index) => {
        try {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const x = parseFloat(cells[0].textContent);
                const y = parseFloat(cells[1].textContent);
                const r = parseFloat(cells[2].textContent);
                const hitCell = cells[3];

                // Получаем значение попадания
                let hit = false;
                const span = hitCell.querySelector('span');

                if (span && span.hasAttribute('data-hit')) {
                    hit = span.getAttribute('data-hit') === 'true';
                } else if (span) {
                    const spanClass = span.className;
                    hit = spanClass.includes('hit');
                }

                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    addPointToGraph(x, y, r, 'result', hit);
                    loadedCount++;
                }
            }
        } catch (e) {
            console.error('Ошибка загрузки точки ${index+1}:', e);
        }
    });

    console.log('Загружено ${loadedCount} точек из истории');
}

function ensureGraphExists() {
    const svg = document.getElementById('areaGraph');
    if (!svg) {
        console.log('График не найден, создаю...');
        createGraph();
        return false; // график только что создан
    }
    return true; // график уже существует
}

function initializePage() {
    console.log('Инициализация графики...');

    // 1. Гарантируем, что график существует
    ensureGraphExists();

    // 2. Обновляем подписи
    updateRLabels();

    // 3. Загружаем историю точек с небольшой задержкой
    setTimeout(() => {
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }
    }, 300);

    console.log('Графика инициализирована');
}

function refreshGraphAfterAjax() {
    console.log('Обновление графика после AJAX...');

    // Убеждаемся, что график существует
    ensureGraphExists();

    // Обновляем подписи
    updateRLabels();

    // Загружаем историю точек с задержкой
    setTimeout(() => {
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }
    }, 400);
}

if (typeof window !== 'undefined') {
    window.createGraph = createGraph;
    window.initializePage = initializePage;
    window.refreshGraphAfterAjax = refreshGraphAfterAjax;
    window.displayHistoryPoints = displayHistoryPoints;
    window.addPointToGraph = addPointToGraph;
    window.clearTempPoints = clearTempPoints;
    window.clearResultPoints = clearResultPoints;
    window.clearAllGraphPoints = clearAllGraphPoints;
    window.updateRLabels = updateRLabels;
}

(function() {
    console.log('graph-renderer.js загружен');

    // Автоматически создаем график при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM загружен, создаю график...');
            setTimeout(ensureGraphExists, 100);
        });
    } else {
        // DOM уже загружен
        console.log('DOM уже загружен, создаю график...');
        setTimeout(ensureGraphExists, 100);
    }
})();