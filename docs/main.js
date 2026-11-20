(function () {
  // mobile menu
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  burger.addEventListener('click', function () {
    var open = header.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.links a').forEach(function (a) {
    a.addEventListener('click', function () {
      header.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // scroll reveal
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // curriculum tabs
  var tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
      t.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      document.getElementById(t.dataset.tab).classList.add('active');
    });
  });

  // cursor glow on cards
  document.querySelectorAll('.glow').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // number count-up for hero stats
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nums = document.querySelectorAll('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
        var start = performance.now(), dur = 1400;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
          el.textContent = pre + v.toLocaleString('en-IN') + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { co.observe(n); });
  }
})();
