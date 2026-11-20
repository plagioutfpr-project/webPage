/**
 * @fileoverview Theme Toggle - Gerenciamento de tema claro/escuro
 * @description Alterna entre light mode e dark mode com persistencia no localStorage
 */

// Chave para armazenar preferencia no localStorage
const THEME_KEY = 'autoria-theme';

/**
 * Detecta preferencia do sistema
 * @returns {'light'|'dark'}
 */
function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

/**
 * Obtem tema salvo ou preferencia do sistema
 * @returns {'light'|'dark'}
 */
function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    return getSystemPreference();
}

/**
 * Aplica tema ao documento
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
    const body = document.body;

    if (theme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    updateThemeControl(theme);
}

/**
 * Mantem o nome e o estado acessiveis do controle sincronizados.
 * @param {'light'|'dark'} theme
 */
function updateThemeControl(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const isDark = theme === 'dark';
    const currentLabel = isDark ? 'escuro' : 'claro';
    const nextLabel = isDark ? 'claro' : 'escuro';
    const accessibleLabel = `Tema atual: ${currentLabel}. Ativar tema ${nextLabel}`;

    toggleBtn.setAttribute('aria-pressed', String(isDark));
    toggleBtn.setAttribute('aria-label', accessibleLabel);
    toggleBtn.title = accessibleLabel;
}

/**
 * Salva preferencia de tema
 * @param {'light'|'dark'} theme
 */
function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Alterna entre temas
 */
function toggleTheme() {
    const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';

    applyTheme(next);
    saveTheme(next);
}

/**
 * Inicializa o sistema de temas
 */
function initTheme() {
    // Aplicar tema salvo imediatamente
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Configurar botao de toggle
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }

    // Escutar mudancas de preferencia do sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            // So aplicar se usuario nao tiver preferencia salva
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }
}

// Inicializar assim que o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Exportar funcoes para uso externo
export { toggleTheme, applyTheme, getSavedTheme };
