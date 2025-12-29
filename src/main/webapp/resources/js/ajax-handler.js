function handleAjaxEvent(data) {
    console.log('AJAX событие:', data.status);

    switch (data.status) {
        case "begin":
            handleAjaxBegin(data);
            break;

        case "complete":
            handleAjaxComplete(data);
            break;

        case "success":
            handleAjaxSuccess(data);
            break;

        case "error":
            handleAjaxError(data);
            break;
    }
}

function handleAjaxBegin(data) {
    console.log('Начало AJAX запроса');

    // Устанавливаем флаг выполнения
    window.ajaxInProgress = true;

    // Блокируем форму
    disableForm(true);

    // Очищаем временные точки
    if (typeof clearTempPoints === 'function') {
        clearTempPoints();
    }
}

function handleAjaxComplete(data) {
    console.log('Завершение AJAX запроса');

    // Разблокируем форму
    setTimeout(() => {
        disableForm(false);
    }, 300);
}

function handleAjaxSuccess(data) {
    console.log('AJAX запрос успешно выполнен');

    // Сбрасываем флаг выполнения
    window.ajaxInProgress = false;

    setTimeout(() => {
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }

        if (typeof updateRLabels === 'function') {
            updateRLabels();
        }
    }, 500);

    // Показываем уведомление об успехе
     const x = document.getElementById('x');
        const y = document.getElementById('y');
        const r = document.getElementById('r');

        if (x.value && y.value.trim() && r.value.trim()) {
            showSuccessNotification('Точка успешно проверена!');
        } else {
            console.log('Поля пустые, не показываем уведомление');
        }
}

function handleAjaxError(data) {
    console.error('Ошибка AJAX запроса:', data);

    // Сбрасываем флаг выполнения
    window.ajaxInProgress = false;

    // Разблокируем форму
    disableForm(false);

    // Показываем сообщение об ошибке
    let errorMessage = 'Произошла ошибка при обработке запроса';

    if (data.responseText) {
        try {
            const response = JSON.parse(data.responseText);
            if (response.error) {
                errorMessage = response.error;
            }
        } catch (e) {
            if (data.responseText.includes('error') || data.responseText.includes('Error')) {
                errorMessage = data.responseText.substring(0, 200);
            }
        }
    }

    showErrorNotification(errorMessage);
}

function handleClearAjax(data) {
    console.log('AJAX для очистки:', data.status);

    switch (data.status) {
        case "begin":
            // Подтверждение перед очисткой
            if (!confirm('Вы уверены, что хотите очистить всю историю проверок?')) {
                data.source.disabled = false;
                return false;
            }
            showLoadingIndicator();
            window.ajaxInProgress = true;
            break;

        case "success":
            // Успешная очистка
            window.ajaxInProgress = false;
            hideLoadingIndicator();

            // Очищаем точки на графике
            if (typeof clearAllGraphPoints === 'function') {
                clearAllGraphPoints();
            }

            // Показываем уведомление
            showSuccessNotification('История проверок успешно очищена!');
            break;

        case "error":
            // Ошибка при очистке
            window.ajaxInProgress = false;
            hideLoadingIndicator();
            showErrorNotification('Ошибка при очистке истории');
            break;
    }

    return true;
}


// Управление состоянием формы
function disableForm(disabled) {
    const form = document.getElementById('mainForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        if (input.type !== 'hidden') {
            input.disabled = disabled;

            if (disabled) {
                input.classList.add('disabled');
            } else {
                input.classList.remove('disabled');
            }
        }
    });

    console.log(`Форма ${disabled ? 'заблокирована' : 'разблокирована'}`);
}

// Уведомления
function showSuccessNotification(message) {
    console.log('Успех:', message);

    // Создаем уведомление, если его нет
    let notification = document.getElementById('success-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'success-notification';
        notification.className = 'notification success';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.display = 'block';

    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

function showErrorNotification(message) {
    console.error('Ошибка:', message);

    // Создаем уведомление, если его нет
    let notification = document.getElementById('error-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'error-notification';
        notification.className = 'notification error';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message.length > 100 ? message.substring(0, 100) + '...' : message;
    notification.style.display = 'block';

    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 5000);
}

// Инициализация AJAX системы
function initializeAjaxSystem() {
    console.log('Инициализация AJAX системы...');

    // Регистрируем глобальные обработчики
    if (typeof jsf !== 'undefined' && jsf.ajax) {
        jsf.ajax.addOnEvent(function(data) {
            console.log('Глобальный AJAX обработчик:', data.status);

            // Дополнительная обработка для всех AJAX запросов
            if (data.status === 'begin') {
                window.ajaxInProgress = true;
            }

            if (data.status === 'success' || data.status === 'error') {
                setTimeout(() => {
                    window.ajaxInProgress = false;
                }, 100);
            }
        });
    }

    // Добавляем стили для уведомлений
    addNotificationStyles();

    console.log('AJAX система инициализирована');
}


// Обработчик AJAX для hidden формы графика
function handleGraphAjax(data) {
    console.log('График AJAX:', data.status);

    switch (data.status) {
        case "begin":
            handleGraphAjaxBegin(data);
            break;
        case "complete":
            handleGraphAjaxComplete(data);
            break;
        case "success":
            handleGraphAjaxSuccess(data);
            break;
        case "error":
            handleGraphAjaxError(data);
            break;
    }
}

function handleGraphAjaxBegin(data) {
    console.log('Начало AJAX из графика');
    window.ajaxInProgress = true;
    showLoadingIndicator();

}

function handleGraphAjaxSuccess(data) {
    console.log('Успешный AJAX из графика');
    window.ajaxInProgress = false;

    setTimeout(() => {
        hideLoadingIndicator();
        showSuccessNotification('Точка успешно проверена!');

        // Обновляем график и таблицу
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }
        if (typeof updateRLabels === 'function') {
            updateRLabels();
        }

        // Очищаем временную точку
        if (typeof clearTempPoints === 'function') {
            clearTempPoints();
        }
    }, 300);
}

function handleGraphAjaxError(data) {
    console.error('Ошибка AJAX из графика');
    window.ajaxInProgress = false;
    hideLoadingIndicator();
    showErrorNotification('Ошибка при проверке точки');

    // Очищаем временную точку при ошибке
    if (typeof clearTempPoints === 'function') {
        clearTempPoints();
    }
}

function handleGraphAjaxComplete(data) {
    console.log('Завершение AJAX из графика');
}

if (typeof window !== 'undefined') {
    window.handleAjaxEvent = handleAjaxEvent;
    window.handleClearAjax = handleClearAjax;
    window.handleGraphAjax = handleGraphAjax;
    window.showLoadingIndicator = showLoadingIndicator;
    window.hideLoadingIndicator = hideLoadingIndicator;
    window.disableForm = disableForm;
    window.showSuccessNotification = showSuccessNotification;
    window.showErrorNotification = showErrorNotification;
    window.initializeAjaxSystem = initializeAjaxSystem;
}