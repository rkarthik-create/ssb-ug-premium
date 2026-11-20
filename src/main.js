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
  document.querySelectorAll('.tabgroup').forEach(function (group) {
    var btns = group.querySelectorAll('.tabs button');
    btns.forEach(function (t) {
      t.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        t.setAttribute('aria-selected', 'true');
        group.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
        document.getElementById(t.dataset.tab).classList.add('active');
        window.dispatchEvent(new Event('resize')); // let carousels in the newly shown panel refresh their buttons
      });
    });
  });

  // carousels: add prev/next buttons under each rail
  document.querySelectorAll('.carousel').forEach(function (c) {
    var rail = c.querySelector('.rail');
    if (!rail) return;
    var nav = document.createElement('div');
    nav.className = 'car-nav';
    nav.innerHTML = '<button type="button" aria-label="Previous" disabled>←</button><button type="button" aria-label="Next">→</button>';
    c.appendChild(nav);
    var prev = nav.children[0], next = nav.children[1];
    function step() { return Math.max(rail.clientWidth * 0.8, 260); }
    function sync() {
      if (!rail.clientWidth) return; // hidden tab panel: leave buttons alone until it is shown
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    }
    prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(rail); // fires when a hidden tab panel becomes visible
    sync();
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

  // section strip: appears once the hero has scrolled away, underlines the section you are in
  var sn = document.getElementById('section-nav');
  if (sn) {
    var snLinks = [].slice.call(sn.querySelectorAll('a[data-spy]'));
    var snTargets = snLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var snList = sn.querySelector('.sn-list');
    var snHero = document.querySelector('.hero');
    var snLast = null;
    var spy = function () {
      var show = snHero ? snHero.getBoundingClientRect().bottom < 40 : window.scrollY > 200;
      sn.classList.toggle('show', show);
      var active = -1;
      snTargets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= 150) active = i; });
      snLinks.forEach(function (l, i) {
        var on = i === active;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      var cur = active >= 0 ? snLinks[active] : null;
      if (cur !== snLast) {
        snLast = cur;
        if (cur && snList.scrollWidth > snList.clientWidth) { // phones: keep the active item centred
          snList.scrollTo({ left: cur.offsetLeft - (snList.clientWidth - cur.offsetWidth) / 2, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  }

  // sticky bottom "Join the early waitlist" bar: shows once the hero buttons have scrolled away,
  // hides again when the closing call-to-action or footer is on screen
  var bar = document.getElementById('sticky-cta');
  if (bar) {
    var heroCta = document.querySelector('.hero .cta-row');
    var endEls = document.querySelectorAll('.final, .footer');
    var update = function () {
      var past = heroCta ? heroCta.getBoundingClientRect().bottom < 0 : window.scrollY > 400;
      var atEnd = [].some.call(endEls, function (n) { return n.getBoundingClientRect().top < window.innerHeight - 80; });
      bar.classList.toggle('show', past && !atEnd);
    };
    var onScroll = update; // cheap enough to run on every scroll event
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
})();
