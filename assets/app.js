/* 深港一日游：折叠、清单、当前站点高亮。没有 JS 时页面照样能看。 */
(function () {
  var TRIP_DATE = '2026-11-14';

  // 全部展开 / 全部收起
  document.querySelectorAll('[data-act]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('data-act') === 'open';
      document.querySelectorAll('details.stop').forEach(function (d) { d.open = open; });
    });
  });

  // 带 #s5 这样的锚点进来时，自动展开那一站
  function openHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.closest('details');
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
    if (el.tagName === 'DETAILS') el.open = true;
    setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 30);
  }
  window.addEventListener('hashchange', openHash);
  openHash();

  // 清单：记住勾选（只存在这台手机的浏览器里）
  document.querySelectorAll('.chk input[type=checkbox]').forEach(function (c, i) {
    var key = 'szhk-chk-' + (c.id || i);
    try { c.checked = localStorage.getItem(key) === '1'; } catch (e) {}
    c.addEventListener('change', function () {
      try { localStorage.setItem(key, c.checked ? '1' : '0'); } catch (e) {}
    });
  });

  // 出行当天：按计划时间高亮“现在这一站”
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function mark() {
    var now = new Date();
    var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    if (today !== TRIP_DATE) return;
    var hm = pad(now.getHours()) + ':' + pad(now.getMinutes());
    document.querySelectorAll('[data-start]').forEach(function (el) {
      var on = hm >= el.getAttribute('data-start') && hm < el.getAttribute('data-end');
      el.classList.toggle('now', on);
    });
  }
  mark();
  setInterval(mark, 60000);
})();
