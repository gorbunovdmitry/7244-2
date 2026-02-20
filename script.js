// Функция для рендеринга заглушки
function renderPlaceholder() {
    const app = document.getElementById('app');
    
    // Отправляем событие просмотра финальной страницы только один раз за сессию
    if (!sessionStorage.getItem('endPageViewed')) {
        sendAnalyticsEvent('7244_end_page_view_var2');
        sessionStorage.setItem('endPageViewed', '1');
    }
    
    app.innerHTML = `
        <div class="placeholder">
            <img src="img/moai.png" alt="Moai" class="placeholder__img" />
            <div class="placeholder__title">Только тссс</div>
            <div class="placeholder__desc">
                Вы поучаствовали в очень важном исследовании, которое поможет улучшить продукт. Вы – наш герой!
            </div>
        </div>
    `;
    
    // Очищаем историю, чтобы нельзя было вернуться назад
    history.replaceState(null, '', location.href);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    // Если уже была показана заглушка, показываем её сразу
    if (localStorage.getItem('7244_placeholderShown_var2') === '1') {
        renderPlaceholder();
        return;
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const smsText = document.getElementById('smsText');
    const applyButton = document.getElementById('applyButton');
    
    // Отправка события просмотра лендинга (один раз за сессию)
    if (!hasPageViewBeenSent()) {
        sendAnalyticsEvent('7244_page_view_var2');
        markPageViewAsSent();
    }
    
    // Компоненты сообщения
    const messageParts = {
        'operation-type': 'Покупка',
        'from-account': 'со счета',
        'account-number': '*0000',
        'operation-amount': '10р',
        'from-card': 'со счета карты',
        'card-number': '*1111',
        'merchant': 'в&nbsp;Alfastore',
        'balance': 'Баланс: 1234,45p'
    };
    
    // Функция для обновления состояния disabled кнопок
    function updateButtonsState() {
        const activeFilters = Array.from(filterButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-filter'));
        
        const fromAccountBtn = document.querySelector('[data-filter="from-account"]');
        const fromCardBtn = document.querySelector('[data-filter="from-card"]');
        const accountNumberBtn = document.querySelector('[data-filter="account-number"]');
        const cardNumberBtn = document.querySelector('[data-filter="card-number"]');
        
        // Сбрасываем состояние всех кнопок
        fromAccountBtn.disabled = false;
        fromAccountBtn.style.opacity = '1';
        fromAccountBtn.style.cursor = 'pointer';
        fromCardBtn.disabled = false;
        fromCardBtn.style.opacity = '1';
        fromCardBtn.style.cursor = 'pointer';
        accountNumberBtn.disabled = false;
        accountNumberBtn.style.opacity = '1';
        accountNumberBtn.style.cursor = 'pointer';
        cardNumberBtn.disabled = false;
        cardNumberBtn.style.opacity = '1';
        cardNumberBtn.style.cursor = 'pointer';
        
        // Правило 1: Если выбран "Со счета" → дизейблим "С карты" и "Номер карты"
        if (activeFilters.includes('from-account')) {
            fromCardBtn.disabled = true;
            fromCardBtn.style.opacity = '0.5';
            fromCardBtn.style.cursor = 'not-allowed';
            cardNumberBtn.disabled = true;
            cardNumberBtn.style.opacity = '0.5';
            cardNumberBtn.style.cursor = 'not-allowed';
        }
        
        // Правило 2: Если выбран "С карты" → дизейблим "Со счета" и "Номер счета"
        if (activeFilters.includes('from-card')) {
            fromAccountBtn.disabled = true;
            fromAccountBtn.style.opacity = '0.5';
            fromAccountBtn.style.cursor = 'not-allowed';
            accountNumberBtn.disabled = true;
            accountNumberBtn.style.opacity = '0.5';
            accountNumberBtn.style.cursor = 'not-allowed';
        }
        
        // Правило 3: Если выбран "Номер счета" → дизейблим "С карты" и "Номер карты"
        if (activeFilters.includes('account-number')) {
            fromCardBtn.disabled = true;
            fromCardBtn.style.opacity = '0.5';
            fromCardBtn.style.cursor = 'not-allowed';
            cardNumberBtn.disabled = true;
            cardNumberBtn.style.opacity = '0.5';
            cardNumberBtn.style.cursor = 'not-allowed';
        }
        
        // Правило 4: Если выбран "Номер карты" → дизейблим "Со счета" и "Номер счета"
        if (activeFilters.includes('card-number')) {
            fromAccountBtn.disabled = true;
            fromAccountBtn.style.opacity = '0.5';
            fromAccountBtn.style.cursor = 'not-allowed';
            accountNumberBtn.disabled = true;
            accountNumberBtn.style.opacity = '0.5';
            accountNumberBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Функция для формирования текста сообщения на основе активных фильтров
    function updateSmsText() {
        const activeFilters = Array.from(filterButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-filter'));
        
        const parts = [];
        
        // Тип операции
        if (activeFilters.includes('operation-type')) {
            parts.push(messageParts['operation-type']);
        }
        
        // Со счета или Со счета карты (взаимоисключающие)
        // Если не выбран тип операции, заменяем "со счета" на "Счет" и "со счета карты" на "Карта"
        if (activeFilters.includes('from-account')) {
            if (activeFilters.includes('operation-type')) {
                parts.push(messageParts['from-account']);
            } else {
                // Если тип операции не выбран, заменяем "со счета" на "Счет"
                parts.push('Счет');
            }
        } else if (activeFilters.includes('from-card')) {
            if (activeFilters.includes('operation-type')) {
                parts.push(messageParts['from-card']);
            } else {
                // Если тип операции не выбран, заменяем "со счета карты" на "Карта"
                parts.push('Карта');
            }
        }
        
        // Номер счета или карты (можно выбрать независимо от "со счета"/"со счета карты")
        if (activeFilters.includes('account-number')) {
            parts.push(messageParts['account-number']);
        }
        if (activeFilters.includes('card-number')) {
            parts.push(messageParts['card-number']);
        }
        
        // Сумма операции (с двоеточием и пробелом после него, если есть предыдущие части)
        if (activeFilters.includes('operation-amount')) {
            if (parts.length > 0) {
                parts.push(':' + ' ' + messageParts['operation-amount']);
            } else {
                parts.push(messageParts['operation-amount']);
            }
        }
        
        // Магазин или организация
        if (activeFilters.includes('merchant')) {
            parts.push(messageParts['merchant']);
        }
        
        // Баланс
        if (activeFilters.includes('balance')) {
            parts.push(messageParts['balance']);
        }
        
        // Обновляем текст сообщения
        smsText.innerHTML = parts.length > 0 ? parts.join(' ') : 'Выберите параметры';
        
        // Обновляем состояние кнопок
        updateButtonsState();
    }
    
    // Обработчик клика на кнопки-фильтры
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const willBeActive = !this.classList.contains('active');
            
            // Обработка взаимоисключающих опций
            if (filter === 'from-account') {
                if (willBeActive) {
                    // Если выбираем "Со счета", убираем "С карты"
                    document.querySelector('[data-filter="from-card"]').classList.remove('active');
                }
            } else if (filter === 'from-card') {
                if (willBeActive) {
                    // Если выбираем "С карты", убираем "Со счета"
                    document.querySelector('[data-filter="from-account"]').classList.remove('active');
                }
            } else if (filter === 'account-number') {
                if (willBeActive) {
                    // Если выбираем "Номер счета", убираем "С карты" и "Номер карты"
                    document.querySelector('[data-filter="from-card"]').classList.remove('active');
                    document.querySelector('[data-filter="card-number"]').classList.remove('active');
                }
            } else if (filter === 'card-number') {
                if (willBeActive) {
                    // Если выбираем "Номер карты", убираем "Со счета" и "Номер счета"
                    document.querySelector('[data-filter="from-account"]').classList.remove('active');
                    document.querySelector('[data-filter="account-number"]').classList.remove('active');
                }
            }
            
            // Не позволяем кликать на disabled кнопки
            if (this.disabled) {
                return;
            }
            
            this.classList.toggle('active');
            updateSmsText();
        });
    });
    
    // Инициализация текста сообщения и состояния кнопок
    updateSmsText();
    
    // URL веб-приложения Apps Script
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxX-tm4-Ew8YRtVKuL_w8Yf25FINaMCgR1XdY1I2L0rhGVfHzpo5hHcsmIriXmdoFvy/exec';
    
    // Функция для отправки данных в Google Таблицу через JSONP (обход CORS)
    function sendDataToGoogleSheet(activeFilters) {
        return new Promise((resolve, reject) => {
            try {
                // Подготавливаем данные в бинарном виде (1/0)
                const data = {
                    operationType: activeFilters.includes('operation-type') ? 1 : 0,
                    operationAmount: activeFilters.includes('operation-amount') ? 1 : 0,
                    fromAccount: activeFilters.includes('from-account') ? 1 : 0,
                    accountNumber: activeFilters.includes('account-number') ? 1 : 0,
                    fromCard: activeFilters.includes('from-card') ? 1 : 0,
                    cardNumber: activeFilters.includes('card-number') ? 1 : 0,
                    merchant: activeFilters.includes('merchant') ? 1 : 0,
                    balance: activeFilters.includes('balance') ? 1 : 0
                };
                
                console.log('Отправляем данные через JSONP:', data);
                
                // Создаем уникальное имя функции для JSONP
                const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
                
                // Создаем глобальную функцию для обработки ответа
                window[callbackName] = function(response) {
                    // Удаляем функцию после использования
                    delete window[callbackName];
                    if (document.getElementById('jsonp_script')) {
                        document.head.removeChild(document.getElementById('jsonp_script'));
                    }
                    
                    if (response.success) {
                        console.log('Данные успешно отправлены в Google Таблицу');
                        resolve(true);
                    } else {
                        console.error('Ошибка при отправке данных:', response.error);
                        reject(new Error(response.error));
                    }
                };
                
                // Создаем script тег для JSONP запроса
                const script = document.createElement('script');
                script.id = 'jsonp_script';
                
                // URL Google Apps Script с параметрами
                const params = new URLSearchParams({
                    callback: callbackName,
                    data: JSON.stringify(data)
                });
                
                script.src = GOOGLE_SHEET_URL + '?' + params.toString();
                script.onerror = function() {
                    delete window[callbackName];
                    if (document.getElementById('jsonp_script')) {
                        document.head.removeChild(document.getElementById('jsonp_script'));
                    }
                    reject(new Error('Ошибка загрузки JSONP скрипта'));
                };
                
                document.head.appendChild(script);
                
            } catch (error) {
                console.error('Ошибка при отправке данных:', error);
                reject(error);
            }
        });
    }
    
    // Обработчик клика на кнопку "Применить"
    applyButton.addEventListener('click', async function() {
        const activeFilters = Array.from(filterButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-filter'));
        
        if (activeFilters.length === 0) {
            alert('Пожалуйста, выберите хотя бы один параметр');
            return;
        }
        
        // Отправка события клика по кнопке "Применить"
        sendAnalyticsEvent('7244_click_continue_var2');
        
        console.log('Активные фильтры:', activeFilters);
        
        // Отключаем кнопку
        applyButton.disabled = true;
        
        // Отправка данных в Google Таблицу (асинхронно, не блокируем показ заглушки)
        sendDataToGoogleSheet(activeFilters).catch(error => {
            console.error('Ошибка при отправке данных:', error);
        });
        
        // Сохраняем флаг показа заглушки
        localStorage.setItem('7244_placeholderShown_var2', '1');
        
        // Показываем заглушку моментально
        renderPlaceholder();
    });
});
