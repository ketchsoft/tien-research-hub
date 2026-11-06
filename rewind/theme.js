/* Rewind: chọn giao diện Sáng, Tối, Theo máy. Nạp trong <head> để không chớp màu khi mở trang.
   Lựa chọn lưu ở localStorage, áp cho mọi màn, và đồng bộ sang các màn đang mở cùng lúc (khung xem trước). */
(function () {
  var KEY = 'rewind-theme';
  var root = document.documentElement;
  function read() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch (e) { return 'system'; }
  }
  function apply(pref) {
    if (pref === 'light' || pref === 'dark') root.setAttribute('data-theme', pref); else root.removeAttribute('data-theme');
    var btns = document.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-theme-set') === pref));
  }
  function set(pref) {
    try { localStorage.setItem(KEY, pref); } catch (e) { /* trình duyệt chặn lưu thì chỉ áp cho trang này */ }
    apply(pref);
  }
  apply(read());
  document.addEventListener('DOMContentLoaded', function () { apply(read()); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-theme-set]');
    if (b) { e.preventDefault(); set(b.getAttribute('data-theme-set')); }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(read()); });
})();
