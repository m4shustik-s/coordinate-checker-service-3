function clearTempPoints() {
    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.querySelectorAll('.temp-point').forEach(p => p.remove());
    }
}

function validateFormBeforeSubmit() {
    console.log('проверка перед отправкой');
    if (validateForm()) {
        showLoadingIndicator();
        return true;
    }
    return false;
}

function showLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        setTimeout(() => indicator.style.display = 'none', 2000);
    }
}

function displayHistoryPoints() {
    console.log('загрузка истории');
    const svg = document.getElementById('areaGraph');
    if (!svg) {
        setTimeout(displayHistoryPoints, 100);
        return;
    }

    const table = document.querySelector('.results-table tbody');
    if (!table) {
        console.log('таблица результатов не найдена');
        return;
    }

    table.querySelectorAll('tr').forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            try {
                const x = parseFloat(cells[0].textContent.trim());
                const y = parseFloat(cells[1].textContent.trim());
                const r = parseFloat(cells[2].textContent.trim());

                // правильное определение попадания
                const resultCell = cells[3];
                let hit = false;

                // проверяем несколько вариантов
                const resultText = resultCell.textContent.trim().toLowerCase();
                if (resultText.includes('попала') ||
                    resultText.includes('hit') ||
                    resultText.includes('да') ||
                    resultText === 'true' ||
                    resultCell.classList.contains('hit')) {
                    hit = true;
                } else if (resultText.includes('не попала') ||
                          resultText.includes('miss') ||
                          resultText.includes('нет') ||
                          resultText === 'false' ||
                          resultCell.classList.contains('miss')) {
                    hit = false;
                }

                console.log(`точка ${index+1}: x=${x}, y=${y}, r=${r}, попадание=${hit}`);

                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    addPointToGraph(x, y, r, 'result', hit);
                }
            } catch (e) {
                console.error(`ошибка парсинга строки ${index+1}:`, e);
            }
        }
    });
}

function onSvgClick(evt) {
    console.log('клик по графику');
    const svg = document.getElementById('areaGraph');
    if (!svg) return;

    const rInput = document.getElementById('mainForm:r');
    if (!rInput || !rInput.value) {
        alert('введите r сначала');
        return;
    }

    const r = parseFloat(rInput.value.replace(',', '.'));
    if (r <= 0) {
        alert('r > 0');
        return;
    }

    const rect = svg.getBoundingClientRect();
    const x = (evt.clientX - rect.left - 200) / (100 / r);
    const y = (200 - (evt.clientY - rect.top)) / (100 / r);

    // установка x
    const xSelect = document.getElementById('mainForm:x');
    if (xSelect) {
        let closest = '-4';
        let minDiff = Math.abs(-4 - x);
        Array.from(xSelect.options).forEach(opt => {
            const diff = Math.abs(parseFloat(opt.value) - x);
            if (diff < minDiff) {
                minDiff = diff;
                closest = opt.value;
            }
        });
        xSelect.value = closest;
    }

    // установка y
    const yInput = document.getElementById('mainForm:y');
    if (yInput) {
        yInput.value = y.toFixed(4);
        validateYField();
    }

    // временная точка
    clearTempPoints();
    addPointToGraph(x, y, r, 'temp', false);

    // автоотправка
    setTimeout(() => {
        if (validateForm()) {
            const btn = document.querySelector('.submit-btn');
            if (btn) {
                showLoadingIndicator();
                btn.click();
            } else {
                clearTempPoints();
            }
        } else {
            clearTempPoints();
        }
    }, 1500);
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

    if (type === 'temp') {
        point.setAttribute('class', 'temp-point');
        point.setAttribute('fill', 'orange');
        point.setAttribute('stroke', 'black');
    } else if (type === 'result') {
        if (hit) {
            point.setAttribute('class', 'result-point hit-point');
            point.setAttribute('fill', '#27ae60'); // зеленый
        } else {
            point.setAttribute('class', 'result-point miss-point');
            point.setAttribute('fill', '#e74c3c'); // красный
        }
        point.setAttribute('stroke', 'black');
        point.setAttribute('stroke-width', '1');
        point.setAttribute('data-hit', hit);
    }

    svg.appendChild(point);
    console.log(`нарисована ${type} точка: (${x.toFixed(2)}, ${y.toFixed(2)}), попадание=${hit}`);
}

// инициализация
function initializePage() {
    console.log('инициализация страницы');
    createGraph();
    initializeFormValidation();
    setTimeout(displayHistoryPoints, 300);

    const svg = document.getElementById('areaGraph');
    if (svg) {
        svg.addEventListener('click', onSvgClick);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);