// ajax-handler.js
// Обработка AJAX запросов и ответов

// Обработчики AJAX событий для основной формы
function handleAjaxEvent(data) {
    console.log('AJAX событие:', data.status);

    switch (data.status) {
        case "begin":
            // Начало AJAX запроса
            handleAjaxBegin(data);
            break;

        case "complete":
            // Завершение AJAX запроса
            handleAjaxComplete(data);
            break;

        case "success":
            // Успешное выполнение
            handleAjaxSuccess(data);
            break;

        case "error":
            // Ошибка выполнения
            handleAjaxError(data);
            break;
    }
}

// Обработчик начала AJAX запроса
function handleAjaxBegin(data) {
    console.log('Начало AJAX запроса');

    // Устанавливаем флаг выполнения
    window.ajaxInProgress = true;

    // Показываем индикатор загрузки
    showLoadingIndicator();

    // Блокируем форму
    disableForm(true);

    // Очищаем временные точки
    if (typeof clearTempPoints === 'function') {
        clearTempPoints();
    }
}

// Обработчик завершения AJAX запроса
function handleAjaxComplete(data) {
    console.log('Завершение AJAX запроса');

    // Разблокируем форму
    setTimeout(() => {
        disableForm(false);
    }, 300);
}

// Обработчик успешного AJAX запроса
function handleAjaxSuccess(data) {
    console.log('AJAX запрос успешно выполнен');

    // Сбрасываем флаг выполнения
    window.ajaxInProgress = false;

    // Скрываем индикатор загрузки
    setTimeout(() => {
        hideLoadingIndicator();
    }, 300);

    // Обновляем точки на графике
    setTimeout(() => {
        if (typeof displayHistoryPoints === 'function') {
            displayHistoryPoints();
        }

        // Обновляем подписи R
        if (typeof updateRLabels === 'function') {
            updateRLabels();
        }
    }, 500);

    // Показываем уведомление об успехе (опционально)
     const x = document.getElementById('x');
        const y = document.getElementById('y');
        const r = document.getElementById('r');

        if (x.value && y.value.trim() && r.value.trim()) {
            showSuccessNotification('Точка успешно проверена!');
        } else {
            console.log('Поля пустые, не показываем уведомление');
        }
}

// Обработчик ошибки AJAX запроса
function handleAjaxError(data) {
    console.error('Ошибка AJAX запроса:', data);

    // Сбрасываем флаг выполнения
    window.ajaxInProgress = false;

    // Скрываем индикатор загрузки
    hideLoadingIndicator();

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
            // Не JSON ответ, используем текст как есть
            if (data.responseText.includes('error') || data.responseText.includes('Error')) {
                errorMessage = data.responseText.substring(0, 200);
            }
        }
    }

    showErrorNotification(errorMessage);
}

// Обработчик AJAX для кнопки очистки
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

// Функции управления индикатором загрузки
function showLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        indicator.style.opacity = '1';
        document.body.style.cursor = 'wait';

        // Анимация появления
        setTimeout(() => {
            indicator.style.opacity = '1';
        }, 10);

        console.log('Индикатор загрузки показан');
    } else {
        console.warn('Элемент индикатора загрузки не найден');
    }
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        // Анимация исчезновения
        indicator.style.opacity = '0';

        setTimeout(() => {
            indicator.style.display = 'none';
            document.body.style.cursor = 'default';
        }, 300);

        console.log('Индикатор загрузки скрыт');
    }
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

// Добавление стилей для уведомлений
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                font-family: Arial, sans-serif;
                font-size: 14px;
            }

            .notification.success {
                background: #27ae60;
                border-left: 4px solid #219653;
            }

            .notification.error {
                background: #e74c3c;
                border-left: 4px solid #c0392b;
            }

            .disabled {
                opacity: 0.6;
                cursor: not-allowed !important;
            }

            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                flex-direction: column;
            }

            .loading-message {
                margin-top: 20px;
                font-size: 18px;
                color: #333;
                font-family: Arial, sans-serif;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);

        // Обновляем индикатор загрузки, если он есть
        const indicator = document.getElementById('loadingIndicator');
        if (indicator && !indicator.querySelector('.loading-spinner')) {
            indicator.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message">Проверка точки...</div>
            `;
        }

        console.log('Стили уведомлений добавлены');
    }
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.handleAjaxEvent = handleAjaxEvent;
    window.handleClearAjax = handleClearAjax;
    window.showLoadingIndicator = showLoadingIndicator;
    window.hideLoadingIndicator = hideLoadingIndicator;
    window.disableForm = disableForm;
    window.showSuccessNotification = showSuccessNotification;
    window.showErrorNotification = showErrorNotification;
    window.initializeAjaxSystem = initializeAjaxSystem;
}