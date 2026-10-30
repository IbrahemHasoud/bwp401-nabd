/* CH4: المتغيرات والوظائف والمصفوفات والتعابير النمطية.
   CH5: DOM والأحداث والتحقق من الإدخال. CH6: إظهار العناصر وإخفاؤها.
   Bootstrap مطلوب في ورقة المشروع، ويشغّل القائمة والسلايدر ونافذة المشاركة. */
var english = document.documentElement.lang === 'en';
var words = english ? {
    event:' event', events:' events', brand:'Nabd Campus',
    nameError:'Enter a name with at least two characters.',
    emailError:'Enter a valid email address, such as name@example.com.',
    messageError:'Write a message between 10 and 2,000 characters.',
    failure:'Please review the highlighted fields before continuing.',
    success:'Your message passed validation. This is an educational form; no message was sent and no personal data was stored.',
    dark:'Switch to dark mode',light:'Switch to light mode'
} : {
    event:' فعالية',events:' فعاليات',brand:'نبض الجامعة',
    nameError:'اكتب اسمًا من حرفين على الأقل.',
    emailError:'اكتب بريدًا إلكترونيًا صحيحًا، مثل name@example.com.',
    messageError:'اكتب رسالة من 10 إلى 2000 حرف.',
    failure:'يرجى مراجعة الحقول المبيّنة أدناه قبل المتابعة.',
    success:'تم التحقق من رسالتك بنجاح. هذا نموذج تعليمي؛ لم تُرسل الرسالة أو تُخزّن بياناتك.',
    dark:'تفعيل الوضع الداكن',light:'تفعيل الوضع النهاري'
};
function byId(id) { return document.getElementById(id); }
// localStorage مذكور كإضافة اختيارية في ورقة المشروع؛ يُستخدم لتفضيلات العرض فقط.
function preference(key, value) {
    try {
        if (typeof value === 'undefined') { return window.localStorage.getItem(key); }
        window.localStorage.setItem(key, value);
    } catch (error) { return null; }
}
function languageUrl(target) {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return (target === 'en' ? 'en/' : '../') + file + window.location.search + window.location.hash;
}
function toggleLanguage() {
    var target = english ? 'ar' : 'en';
    preference('nabd-language', target);
    window.location.href = languageUrl(target);
}
function applyTheme(theme) {
    var dark = theme === 'dark';
    document.documentElement.className = dark ? 'dark-theme' : '';
    if (byId('themeToggle')) {
        byId('themeToggle').setAttribute('aria-label', dark ? words.light : words.dark);
        byId('themeToggle').setAttribute('aria-pressed', dark ? 'true' : 'false');
        byId('themeSymbol').textContent = dark ? '☀' : '☾';
    }
}
function toggleTheme() {
    var theme = document.documentElement.className === 'dark-theme' ? 'light' : 'dark';
    preference('nabd-theme', theme);
    applyTheme(theme);
}
applyTheme(preference('nabd-theme') || 'light');
var savedLanguage = preference('nabd-language');
if (savedLanguage && savedLanguage !== (english ? 'en' : 'ar')) {
    window.location.replace(languageUrl(savedLanguage));
}
function parameter(name) {
    var parts = window.location.search.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split('=');
        if (pair[0] === name) {
            try { return decodeURIComponent((pair[1] || '').replace(/\+/g, ' ')); }
            catch (error) { return ''; }
        }
    }
    return '';
}
function clean(value) { return value.replace(/^\s+|\s+$/g, ''); }
function normalizeArabic(value) {
    return value.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/[\u064B-\u065F\u0640]/g, '');
}
function filterEvents() {
    var query = normalizeArabic(clean(byId('searchQuery').value));
    var category = byId('categoryFilter').value;
    var date = byId('dateFilter').value;
    var place = byId('locationFilter').value;
    var cards = byId('eventGrid').getElementsByClassName('event-column');
    var count = 0;
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var text = normalizeArabic(card.getAttribute('data-title'));
        var visible = (query === '' || text.indexOf(query) !== -1) &&
            (category === '' || category === card.getAttribute('data-category')) &&
            (date === '' || date === card.getAttribute('data-date')) &&
            (place === '' || place === card.getAttribute('data-location'));
        card.style.display = visible ? '' : 'none';
        if (visible) { count++; }
    }
    byId('resultCount').textContent = count + (count === 1 ? words.event : words.events);
    byId('emptyState').style.display = count === 0 ? 'block' : 'none';
}
function resetFilters() {
    byId('searchQuery').value = '';
    byId('categoryFilter').value = '';
    byId('dateFilter').value = '';
    byId('locationFilter').value = '';
    filterEvents();
}
function prepareShare(id) {
    var url = window.location.href.split('?')[0].split('#')[0] + '?id=' + id;
    byId('shareUrl').value = url;
    byId('shareWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(url);
    byId('shareTelegram').href = 'https://t.me/share/url?url=' + encodeURIComponent(url);
}
function showFieldError(id, message) {
    var field = byId(id);
    field.className = message ? 'form-control is-invalid' : 'form-control';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    var errors = {contactName:'nameError',contactEmail:'emailError',contactMessage:'messageError'};
    byId(errors[id]).textContent = message;
}
function checkContact() {
    var name = clean(byId('contactName').value);
    var email = clean(byId('contactEmail').value);
    var message = clean(byId('contactMessage').value);
    var nameError = name.length < 2 ? words.nameError : '';
    var emailError = email.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== 0 ? words.emailError : '';
    var messageError = message.length < 10 || message.length > 2000 ? words.messageError : '';
    showFieldError('contactName', nameError);
    showFieldError('contactEmail', emailError);
    showFieldError('contactMessage', messageError);
    var alertBox = byId('contactAlert');
    alertBox.style.display = 'block';
    if (nameError || emailError || messageError) {
        alertBox.className = 'alert alert-danger';
        alertBox.textContent = words.failure;
        byId(nameError ? 'contactName' : emailError ? 'contactEmail' : 'contactMessage').focus();
    } else {
        alertBox.className = 'alert alert-success';
        alertBox.textContent = words.success;
        alertBox.setAttribute('tabindex', '-1');
        alertBox.focus();
    }
    return false;
}
if (byId('filters')) {
    byId('searchQuery').value = parameter('q');
    byId('categoryFilter').value = parameter('category');
    byId('dateFilter').value = parameter('date');
    byId('searchQuery').oninput = filterEvents;
    byId('categoryFilter').onchange = filterEvents;
    byId('dateFilter').onchange = filterEvents;
    byId('locationFilter').onchange = filterEvents;
    byId('filters').onsubmit = function () { filterEvents(); return false; };
    byId('filters').onreset = function () { resetFilters(); return false; };
    filterEvents();
}
if (byId('eventNotFound')) {
    var selectedId = parameter('id') || 'responsive-lab';
    var detailBlocks = document.getElementsByClassName('event-detail');
    for (var d = 0; d < detailBlocks.length; d++) { detailBlocks[d].style.display = 'none'; }
    var selected = byId('detail-' + selectedId);
    if (selected) {
        selected.style.display = 'block';
        document.title = selected.getElementsByTagName('h1')[0].textContent + ' | ' + words.brand;
    } else { byId('eventNotFound').style.display = 'block'; }
}
if (byId('contactForm')) {
    if (parameter('subject') === 'event') { byId('contactSubject').value = 'event'; }
    byId('contactForm').onsubmit = checkContact;
}
window.onscroll = function () {
    var position = document.documentElement.scrollTop || document.body.scrollTop;
    byId('toTop').style.display = position > 500 ? 'block' : 'none';
};

// عرضان للقائمة نفسها باستخدام تغيير صنف CSS (CH5 وCH6).
function setEventView(view) {
    byId('eventGrid').className = view === 'agenda' ? 'row g-4 agenda-view' : 'row g-4';
    byId('cardsView').className = view === 'cards' ? 'active' : '';
    byId('agendaView').className = view === 'agenda' ? 'active' : '';
    byId('cardsView').setAttribute('aria-pressed', view === 'cards' ? 'true' : 'false');
    byId('agendaView').setAttribute('aria-pressed', view === 'agenda' ? 'true' : 'false');
}
