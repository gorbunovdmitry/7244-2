/**
 * Apps Script код для Google Таблицы
 * Скопируйте этот код в редактор Apps Script вашей Google Таблицы
 * 
 * Инструкция:
 * 1. Откройте Google Таблицу: https://docs.google.com/spreadsheets/d/1b-kln3a3LqkKrIK5gboFDOfMG_g43TNfCbsHK9C1yB8
 * 2. Расширения → Apps Script
 * 3. Вставьте этот код
 * 4. Сохраните и разверните как веб-приложение
 * 5. Скопируйте URL веб-приложения и используйте его в script.js
 */

function doGet(e) {
  // Обработка JSONP запросов
  const callback = e.parameter.callback;
  const dataParam = e.parameter.data;
  
  if (callback && dataParam) {
    // JSONP запрос с данными
    try {
      const data = JSON.parse(dataParam);
      
      // Получаем активную таблицу
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // Форматируем дату и время: 08.09.2025 6:48:22
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = now.getHours(); // Без ведущего нуля
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dateTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
      
      // Подготавливаем строку данных
      const row = [
        data.operationType || 0,
        data.operationAmount || 0,
        data.fromAccount || 0,
        data.accountNumber || 0,
        data.fromCard || 0,
        data.cardNumber || 0,
        data.merchant || 0,
        data.balance || 0,
        dateTime
      ];
      
      // Добавляем строку в таблицу
      sheet.appendRow(row);
      
      const result = {
        success: true,
        message: 'Данные успешно сохранены',
        timestamp: new Date().toISOString()
      };
      
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
        
    } catch (error) {
      const result = {
        success: false,
        error: error.toString(),
        message: 'Ошибка при сохранении данных',
        timestamp: new Date().toISOString()
      };
      
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  } else {
    // Обычный GET запрос (для тестирования)
    return ContentService
      .createTextOutput('Google Apps Script is working!')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Функция для создания заголовков (выполнить один раз)
function createHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = [
    'Тип операции',
    'Сумма операции',
    'Со счета',
    'Номер счета',
    'С карты',
    'Номер карты',
    'Магазин или организация',
    'Баланс',
    'Дата и время'
  ];
  
  // Проверяем, есть ли уже заголовки
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}
