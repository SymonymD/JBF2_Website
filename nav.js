(function () {
  // ── Styles ──────────────────────────────────────────────────────────────
  var css = `
    #jbf-nav-toggle {
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 10000;
      width: 42px;
      height: 42px;
      background: rgba(10, 10, 46, 0.92);
      border: 1px solid rgba(255, 215, 0, 0.5);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.5);
      transition: border-color 0.2s, background 0.2s;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    #jbf-nav-toggle:hover {
      border-color: #FFD700;
      background: rgba(20, 20, 60, 0.98);
    }
    #jbf-nav-toggle .jbf-bar {
      width: 20px;
      height: 2px;
      background: #FFD700;
      border-radius: 2px;
      transition: transform 0.25s, opacity 0.25s;
      transform-origin: center;
    }
    #jbf-nav-toggle.open .jbf-bar:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    #jbf-nav-toggle.open .jbf-bar:nth-child(2) {
      opacity: 0;
    }
    #jbf-nav-toggle.open .jbf-bar:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    #jbf-nav-panel {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 270px;
      max-width: 85vw;
      background: #06061a;
      border-right: 1px solid rgba(255, 215, 0, 0.2);
      z-index: 9998;
      transform: translateX(-100%);
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      font-family: Georgia, 'Times New Roman', serif;
      box-shadow: 4px 0 30px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
    }
    #jbf-nav-panel.open {
      transform: translateX(0);
    }

    #jbf-nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9997;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }
    #jbf-nav-overlay.open {
      opacity: 1;
      pointer-events: all;
    }

    #jbf-nav-panel .jbf-nav-header {
      padding: 24px 20px 16px;
      border-bottom: 1px solid rgba(255, 215, 0, 0.15);
    }
    #jbf-nav-panel .jbf-nav-header .jbf-nav-eyebrow {
      font-size: 0.65em;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 215, 0, 0.5);
      margin-bottom: 4px;
    }
    #jbf-nav-panel .jbf-nav-header h2 {
      font-size: 1em;
      color: #FFD700;
      margin: 0;
      font-weight: bold;
      line-height: 1.3;
    }

    #jbf-nav-panel .jbf-nav-section {
      padding: 14px 20px 4px;
    }
    #jbf-nav-panel .jbf-nav-section-label {
      font-size: 0.62em;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 215, 0, 0.4);
      margin-bottom: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #jbf-nav-panel a.jbf-nav-link {
      display: block;
      padding: 8px 10px;
      color: #d4c9a8;
      text-decoration: none;
      font-size: 0.9em;
      border-radius: 6px;
      margin-bottom: 2px;
      transition: background 0.15s, color 0.15s;
      line-height: 1.3;
    }
    #jbf-nav-panel a.jbf-nav-link:hover {
      background: rgba(255, 215, 0, 0.08);
      color: #FFD700;
    }
    #jbf-nav-panel a.jbf-nav-link.active {
      background: rgba(255, 215, 0, 0.1);
      color: #FFD700;
    }
    #jbf-nav-panel .jbf-nav-divider {
      border: none;
      border-top: 1px solid rgba(255, 215, 0, 0.1);
      margin: 10px 20px;
    }
    #jbf-nav-panel .jbf-nav-footer {
      margin-top: auto;
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 215, 0, 0.1);
      font-size: 0.65em;
      color: rgba(255,255,255,0.25);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.5;
    }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Determine active page ────────────────────────────────────────────────
  var currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

  function link(href, label) {
    var a = document.createElement('a');
    a.href = href;
    a.className = 'jbf-nav-link';
    if (href.toLowerCase() === currentPage) a.classList.add('active');
    a.textContent = label;
    return a;
  }

  function section(label) {
    var div = document.createElement('div');
    div.className = 'jbf-nav-section';
    var lbl = document.createElement('div');
    lbl.className = 'jbf-nav-section-label';
    lbl.textContent = label;
    div.appendChild(lbl);
    return div;
  }

  function divider() {
    var hr = document.createElement('hr');
    hr.className = 'jbf-nav-divider';
    return hr;
  }

  // ── Build panel ──────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'jbf-nav-overlay';

  var panel = document.createElement('div');
  panel.id = 'jbf-nav-panel';

  // Header
  var header = document.createElement('div');
  header.className = 'jbf-nav-header';
  header.innerHTML = '<div class="jbf-nav-eyebrow">Attorney</div><h2>John Benz Fentner, Jr.</h2>';
  panel.appendChild(header);

  // Added by family section
  var sec0 = section('Added by JBF3');
  sec0.appendChild(link('history.html', 'Family History'));
  sec0.appendChild(link('photos.html', 'Family Photos'));
  panel.appendChild(sec0);

  panel.appendChild(divider());

  // Personal section
  var sec1 = section("John's Site");
  sec1.appendChild(link('index.html', '🏠 Home'));
  sec1.appendChild(link('personal.html', 'Personal Interests'));
  sec1.appendChild(link('marxbros.html', 'Marx Brothers'));
  sec1.appendChild(link('movie.html', 'Movies'));
  sec1.appendChild(link('food.html', 'Food & Recipes'));
  sec1.appendChild(link('free.html', 'Free Speech'));
  sec1.appendChild(link('whitem.html', 'The White Mouse'));
  panel.appendChild(sec1);

  panel.appendChild(divider());

  // Professional section
  var sec2 = section('Professional');
  sec2.appendChild(link('profess.html', 'Law Practice'));
  sec2.appendChild(link('resume.html', 'Résumé'));
  sec2.appendChild(link('re.html', 'Real Estate'));
  sec2.appendChild(link('re_svc.html', 'Services & Fees'));
  sec2.appendChild(link('manual.html', 'RE Manual'));
  sec2.appendChild(link('interest.html', 'Loan Calculator'));
  panel.appendChild(sec2);

  panel.appendChild(divider());

  // Connecticut section
  var sec3 = section('Connecticut');
  sec3.appendChild(link('ct.html', 'CT Info'));
  sec3.appendChild(link('lgia.html', 'Lake Garda'));
  sec3.appendChild(link('trap.html', 'Speed Traps'));
  sec3.appendChild(link('ulcer.html', 'Top 10: Lawyer Ulcers'));
  panel.appendChild(sec3);

  // Footer
  var footer = document.createElement('div');
  footer.className = 'jbf-nav-footer';
  footer.innerHTML = 'Navigation added by <a href="https://www.jbfentner.design/" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.4);text-decoration:underline;">JBF3</a> · Original site 1996\u20132000';
  panel.appendChild(footer);

  // ── Hamburger button ─────────────────────────────────────────────────────
  var toggle = document.createElement('button');
  toggle.id = 'jbf-nav-toggle';
  toggle.setAttribute('aria-label', 'Open navigation menu');
  for (var i = 0; i < 3; i++) {
    var bar = document.createElement('div');
    bar.className = 'jbf-bar';
    toggle.appendChild(bar);
  }

  // ── Logic ────────────────────────────────────────────────────────────────
  function openNav() {
    panel.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeNav() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  toggle.addEventListener('click', function () {
    panel.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // ── Mount ────────────────────────────────────────────────────────────────
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.body.appendChild(toggle);
})();
