// Initialize the transliterator
const Transliterator = lotinKirill.default;
const transliterator = new Transliterator();

// DOM elements
const fromText = document.getElementById('fromText');
const toText = document.getElementById('toText');
const fromScriptTitle = document.getElementById('fromScriptTitle');
const toScriptTitle = document.getElementById('toScriptTitle');
const themeToggle = document.getElementById('themeToggle');
const copyFromBtn = document.getElementById('copyFrom');
const copyToBtn = document.getElementById('copyTo');
const swapButton = document.getElementById('swapButton');
const languageSelect = document.getElementById('languageSelect');

// Translations
const translations = {
  uz: {
    title: "Kirill-Lotin Tarjimon",
    fromPlaceholder: "Matnni kiriting...",
    toPlaceholder: "Tarjima natijasi...",
    copyFromBtn: "Lotindan nusxa olish",
    copyToBtn: "Кириллдан нусха олиш",
    faqTitle: "Tez-tez so'raladigan savollar"
  },
  ru: {
    title: "Кирилл-Латин Переводчик",
    fromPlaceholder: "Введите текст...",
    toPlaceholder: "Результат перевода...",
    copyFromBtn: "Копировать латиницу",
    copyToBtn: "Копировать кириллицу",
    faqTitle: "Часто задаваемые вопросы"
  },
  en: {
    title: "Cyrillic-Latin Translator",
    fromPlaceholder: "Enter text...",
    toPlaceholder: "Translation result...",
    copyFromBtn: "Copy Latin",
    copyToBtn: "Copy Cyrillic",
    faqTitle: "Frequently Asked Questions"
  }
};

translations.uz.faqQ1 = "Kiril-lotin tarjimonidan qanday foydalanaman?";
translations.uz.faqA1 = "Yuqoridagi matn maydoniga kiril yoki lotin alifbosidagi matnni kiriting...";
translations.uz.faqQ2 = "Tarjima qilingan matnni qanday saqlash mumkin?";
translations.uz.faqA2 = "Tarjima qilingan matnni nusxalash uchun 'Nusxa olish' tugmasini bosing...";
translations.uz.faqQ3 = "Xizmatdan foydalanish pullikmi?";
translations.uz.faqA3 = "Yo'q, kiril-lotin tarjimoni butunlay bepul xizmat ko'rsatadi.";

translations.ru.faqQ1 = "Как использовать кириллическо-латинский переводчик?";
translations.ru.faqA1 = "Введите текст на кириллице или латинице в поле ввода выше...";
translations.ru.faqQ2 = "Как сохранить переведённый текст?";
translations.ru.faqA2 = "Чтобы скопировать переведённый текст, нажмите кнопку «Скопировать»...";
translations.ru.faqQ3 = "Является ли сервис платным?";
translations.ru.faqA3 = "Нет, кириллическо-латинский переводчик полностью бесплатный.";

translations.en.faqQ1 = "How to use the Cyrillic-Latin translator?";
translations.en.faqA1 = "Enter text in Cyrillic or Latin scripts in the field above...";
translations.en.faqQ2 = "How to save the translated text?";
translations.en.faqA2 = "To copy the translated text, click the 'Copy' button...";
translations.en.faqQ3 = "Is the service paid?";
translations.en.faqA3 = "No, the Cyrillic-Latin translator is completely free.";

// Theme handling
function initTheme() {
    // Check localStorage first
    if (localStorage.theme === 'dark') {
        document.body.classList.add('dark');
    } else if (localStorage.theme === 'light') {
        document.body.classList.remove('dark');
    } 
    // If no preference, check system preference
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
});

// Translation handling
function translate() {
    const text = fromText.value;
    if (!text) {
        toText.value = '';
        return;
    }

    // Detect script and translate accordingly
    if (/[а-яА-ЯёЁ]/.test(text)) {
        // If text contains Cyrillic, translate to Latin
        toText.value = transliterator.textToLatin(text);
        fromScriptTitle.textContent = 'Кирил';
        toScriptTitle.textContent = 'Lotin';
    } else {
        // If text contains Latin, translate to Cyrillic
        toText.value = transliterator.textToCyrillic(text);
        fromScriptTitle.textContent = 'Lotin';
        toScriptTitle.textContent = 'Кирил';
    }
}

// Swap functionality
swapButton.addEventListener('click', () => {
    // Swap text contents
    const tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;

    // Swap titles
    const tempTitle = fromScriptTitle.textContent;
    fromScriptTitle.textContent = toScriptTitle.textContent;
    toScriptTitle.textContent = tempTitle;

    // Trigger translation
    translate();
});

// Copy functionality
async function copyText(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        const originalSvg = button.innerHTML;
        button.innerHTML = `
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
        setTimeout(() => {
            button.innerHTML = originalSvg;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}

// Event listeners
fromText.addEventListener('input', translate);
copyFromBtn.addEventListener('click', () => copyText(fromText.value, copyFromBtn));
copyToBtn.addEventListener('click', () => copyText(toText.value, copyToBtn));
languageSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  updateLanguage(lang);
});

// Initialize theme on page load
initTheme();

// Language update function
function updateLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelector('h1').textContent = translations[lang].title;
  fromText.placeholder = translations[lang].fromPlaceholder;
  toText.placeholder = translations[lang].toPlaceholder;
  copyFromBtn.textContent = translations[lang].copyFromBtn;
  copyToBtn.textContent = translations[lang].copyToBtn;
  document.querySelector('.faq-section h2').textContent = translations[lang].faqTitle;
  document.querySelectorAll('.faq-item')[0].querySelector('summary').textContent = translations[lang].faqQ1;
  document.querySelectorAll('.faq-item')[0].querySelector('p').textContent = translations[lang].faqA1;
  document.querySelectorAll('.faq-item')[1].querySelector('summary').textContent = translations[lang].faqQ2;
  document.querySelectorAll('.faq-item')[1].querySelector('p').textContent = translations[lang].faqA2;
  document.querySelectorAll('.faq-item')[2].querySelector('summary').textContent = translations[lang].faqQ3;
  document.querySelectorAll('.faq-item')[2].querySelector('p').textContent = translations[lang].faqA3;
}
