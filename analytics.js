// Константы для ID аналитики
const GA_MEASUREMENT_ID = 'G-VNG605KE2R';
const YANDEX_METRIKA_ID = '96171108';

// Инициализация Google Analytics
(function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    window.gtag = gtag;
})();

// Инициализация Yandex Metrika
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

if (typeof ym !== 'undefined') {
    ym(YANDEX_METRIKA_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
    });
}

// Функция для отправки событий в Google Analytics и Yandex Metrika
function sendAnalyticsEvent(eventName) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'engagement',
            'event_label': eventName
        });
    }
    
    // Yandex Metrika
    if (typeof ym !== 'undefined') {
        try {
            ym(YANDEX_METRIKA_ID, 'reachGoal', eventName);
        } catch(e) {
            console.warn('Yandex Metrika error:', e);
        }
    }
    
    console.log('Analytics event sent:', eventName);
}

// Проверка, было ли уже отправлено событие просмотра страницы в этой сессии
function hasPageViewBeenSent() {
    return sessionStorage.getItem('7244_page_view_sent') === 'true';
}

// Отметить, что событие просмотра страницы было отправлено
function markPageViewAsSent() {
    sessionStorage.setItem('7244_page_view_sent', 'true');
}
