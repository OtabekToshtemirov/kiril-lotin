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

// Initialize theme on page load
initTheme();
initTheme();
