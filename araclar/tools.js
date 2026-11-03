(function () {
  var q = new URLSearchParams(location.search);
  var lang = q.get('lang') || (location.hash === '#en' ? 'en' : (localStorage.getItem('vw_lang') || 'tr'));
  window.vwLang = function () { return document.documentElement.getAttribute('data-lang'); };
  window.L = function (tr, en) { return vwLang() === 'en' ? en : tr; };
  function set(l) {
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.lang = l;
    try { localStorage.setItem('vw_lang', l); } catch (e) {}
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === l);
    });
    if (window.vwRender) window.vwRender();
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-set-lang')); });
    });
    set(lang === 'en' ? 'en' : 'tr');
    document.querySelectorAll('input,select').forEach(function (el) {
      el.addEventListener('input', function () { if (window.vwRender) window.vwRender(); });
    });
  });
  window.vwNum = function (id) {
    var v = parseFloat(String(document.getElementById(id).value).replace(',', '.'));
    return isNaN(v) ? null : v;
  };
})();
