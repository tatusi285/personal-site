/* ==========================================================
   个人主页交互 · 原生 JS，无依赖
   1. 深色 / 浅色主题（记住选择）
   2. 移动端菜单
   3. 滚动淡入、导航高亮、顶栏描边
   4. 一键复制邮箱
   ========================================================== */
(function () {
  'use strict';

  var html = document.documentElement;

  /* ---------- 1. 主题 ---------- */
  var THEME_KEY = 'theme';
  var themeBtn = document.getElementById('theme-toggle');
  var themeMeta = document.getElementById('theme-color');

  function syncThemeMeta() {
    if (!themeMeta) return;
    themeMeta.setAttribute(
      'content',
      html.dataset.theme === 'light' ? '#faf9f6' : '#0a0b0e'
    );
  }

  function applyTheme(mode) {
    html.dataset.theme = mode;
    syncThemeMeta();
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(mode === 'light'));
      themeBtn.setAttribute(
        'aria-label',
        mode === 'light' ? '切换到深色模式' : '切换到浅色模式'
      );
    }
  }

  applyTheme(html.dataset.theme === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  // 用户没手动选过时，跟随系统变化
  var lightMQ = window.matchMedia('(prefers-color-scheme: light)');
  var onSchemeChange = function (event) {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    if (!stored) applyTheme(event.matches ? 'light' : 'dark');
  };
  if (lightMQ.addEventListener) {
    lightMQ.addEventListener('change', onSchemeChange);
  } else if (lightMQ.addListener) {
    lightMQ.addListener(onSchemeChange);
  }

  /* ---------- 2. 移动端菜单 ---------- */
  var nav = document.getElementById('nav');
  var navBtn = document.getElementById('nav-toggle');

  function closeNav() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    if (navBtn) {
      navBtn.setAttribute('aria-expanded', 'false');
      navBtn.setAttribute('aria-label', '打开菜单');
    }
  }

  if (navBtn && nav) {
    navBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navBtn.setAttribute('aria-expanded', String(open));
      navBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- 3. 顶栏描边 + 滚动淡入 + 导航高亮 ---------- */
  var header = document.querySelector('.site-header');

  function syncHeader() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // 首屏的 .reveal 由纯 CSS 动画接管，其余区块交给 IntersectionObserver
  var reveals = Array.prototype.slice
    .call(document.querySelectorAll('.reveal'))
    .filter(function (el) {
      return !el.closest('.hero');
    });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revealObserver.observe(el);
    });

    // 兜底：某些内嵌浏览器 / 老旧内核里 IntersectionObserver 不回调，
    // 两秒半后把没显示的元素全部放出来，绝不让页面变成一片空白。
    window.setTimeout(function () {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 2500);
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var sectionEls = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if ('IntersectionObserver' in window && sectionEls.length && navLinks.length) {
    var linkMap = {};
    navLinks.forEach(function (link) {
      linkMap[link.getAttribute('href').slice(1)] = link;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var active = linkMap[entry.target.id];
          if (!active) return;
          navLinks.forEach(function (link) {
            link.removeAttribute('aria-current');
          });
          active.setAttribute('aria-current', 'true');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sectionEls.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- 4. 一键复制（邮箱 / 电话） ---------- */
  var copyTargets = Array.prototype.slice.call(
    document.querySelectorAll('[data-copy]')
  );

  if (copyTargets.length) {
    var toast = null;
    var toastTimer = null;

    var showToast = function (message) {
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 1900);
    };

    // 同步方案：http 页面、旧浏览器、内嵌浏览器里都能用
    var fallbackCopy = function (text) {
      try {
        var field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.top = '-1000px';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(field);
        return ok;
      } catch (e) {
        return false;
      }
    };

    copyTargets.forEach(function (btn) {
      var value = (btn.getAttribute('data-copy') || '').trim();
      var shown = btn.getAttribute('data-display') || value;

      var report = function (ok) {
        btn.classList.toggle('is-copied', ok);
        window.setTimeout(function () {
          btn.classList.remove('is-copied');
        }, 1600);
        showToast(ok ? '已复制：' + shown : '复制失败，请手动选择后复制');
      };

      btn.addEventListener('click', function () {
        if (!value) return;

        if (fallbackCopy(value)) {
          report(true);
          return;
        }

        // 现代剪贴板 API，带超时兜底，避免没有任何反馈
        if (navigator.clipboard && navigator.clipboard.writeText) {
          var guard = window.setTimeout(function () {
            report(false);
          }, 1200);
          navigator.clipboard.writeText(value).then(
            function () {
              window.clearTimeout(guard);
              report(true);
            },
            function () {
              window.clearTimeout(guard);
              report(false);
            }
          );
        } else {
          report(false);
        }
      });
    });
  }

  /* ---------- 5. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
