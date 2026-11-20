const translated = [...document.querySelectorAll('[data-en]')];
const russian = new Map(translated.map(node => [node, node.innerHTML]));
function setLanguage(language) {
  const english = language === 'en';
  translated.forEach(node => { node.innerHTML = english ? node.dataset.en : russian.get(node); });
  document.documentElement.lang = english ? 'en' : 'ru';
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  document.title = english ? 'Konstantin Emyashev — Software Developer' : 'Константин Емяшев — Разработчик';
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
