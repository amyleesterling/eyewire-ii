// EyeWire II — mobile welcome popup.
// Standalone overlay loaded from index.html; shows once per device on
// mobile browsers and invites the visitor to become a citizen scientist.
(function () {
  'use strict';

  var STORAGE_KEY = 'ew2-mobile-welcome-dismissed';

  function isMobile() {
    var ua = navigator.userAgent || '';
    var uaMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua) ||
      (/Mac/.test(ua) && navigator.maxTouchPoints > 2); // iPadOS reports as Mac
    var coarseSmall = window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches &&
      Math.min(window.innerWidth, window.innerHeight) < 820;
    return uaMobile || coarseSmall;
  }

  function alreadyDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function rememberDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) { /* private mode — show again next visit */ }
  }

  if (!isMobile() || alreadyDismissed()) return;

  var CSS = [
    '.ew2-mw-backdrop{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;',
    'background:rgba(2,4,12,.82);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);',
    'animation:ew2MwFade .25s ease-out;font-family:Inter,system-ui,sans-serif;color:#e0ecff}',
    '@keyframes ew2MwFade{from{opacity:0}to{opacity:1}}',
    '@keyframes ew2MwRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.ew2-mw-panel{width:min(440px,92vw);max-height:86dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    'background:linear-gradient(135deg,rgba(8,12,24,.98),rgba(12,18,32,.97));',
    'border:1px solid rgba(74,158,255,.3);border-radius:14px;padding:26px 22px 24px;',
    'box-shadow:0 12px 48px #0000008c,0 0 32px #4a9eff22;animation:ew2MwRise .3s ease-out;text-align:center}',
    '.ew2-mw-close{position:sticky;top:0;float:right;margin:-14px -8px 0 0;background:none;border:none;',
    'color:#889;font-size:1.6em;line-height:1;cursor:pointer;padding:6px}',
    '.ew2-mw-close:active{color:#fff}',
    '.ew2-mw-eyebrow{font-size:.7em;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#4a9eff;margin:2px 0 10px}',
    '.ew2-mw-title{font-family:Orbitron,Rajdhani,sans-serif;font-size:1.55em;font-weight:700;letter-spacing:.06em;',
    'margin:0 0 14px;color:#fff;text-shadow:0 0 18px #00c8ff55}',
    '.ew2-mw-intro{font-size:.95em;line-height:1.55;color:#b9c8e4;margin:0 0 18px}',
    '.ew2-mw-divider{height:1px;border:none;margin:18px auto;width:70%;',
    'background:linear-gradient(90deg,transparent,rgba(74,158,255,.45),transparent)}',
    '.ew2-mw-badge{width:96px;height:96px;object-fit:contain;margin:0 auto 10px;display:block;',
    'filter:drop-shadow(0 0 14px #00c8ff44)}',
    '.ew2-mw-subtitle{font-size:.85em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#cde;margin:0 0 10px}',
    '.ew2-mw-invite{font-size:.92em;line-height:1.55;color:#b9c8e4;margin:0 0 20px}',
    '.ew2-mw-cta{display:block;width:100%;padding:13px 18px;border:none;border-radius:10px;cursor:pointer;',
    'font-family:inherit;font-size:1em;font-weight:700;letter-spacing:.04em;color:#02040c;',
    'background:linear-gradient(135deg,#00c8ff,#4a9eff);box-shadow:0 4px 20px #00b4ff55;margin:0 0 12px}',
    '.ew2-mw-cta:active{transform:translateY(1px);box-shadow:0 2px 10px #00b4ff44}',
    '.ew2-mw-skip{background:none;border:none;cursor:pointer;font-family:inherit;font-size:.85em;',
    'color:#7d8ba8;text-decoration:underline;text-underline-offset:3px;padding:6px}'
  ].join('');

  function show() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var backdrop = document.createElement('div');
    backdrop.className = 'ew2-mw-backdrop';
    backdrop.innerHTML =
      '<div class="ew2-mw-panel" role="dialog" aria-modal="true" aria-labelledby="ew2-mw-title">' +
        '<button class="ew2-mw-close" aria-label="Close">&times;</button>' +
        '<div class="ew2-mw-eyebrow">EyeWire II</div>' +
        '<h1 class="ew2-mw-title" id="ew2-mw-title">Welcome, Citizen</h1>' +
        '<p class="ew2-mw-intro">You have arrived at the frontier of the brain. ' +
        'Explore real neurons in 3D, reconstructed from a living connectome &mdash; ' +
        'right from your phone.</p>' +
        '<hr class="ew2-mw-divider">' +
        '<img class="ew2-mw-badge" src="badge-citizen-scientist-IVPVNUGL.png" alt="" loading="lazy">' +
        '<div class="ew2-mw-subtitle">Your mission awaits</div>' +
        '<p class="ew2-mw-invite">Become a <strong>citizen scientist</strong> and join ' +
        'thousands of players mapping neural circuits for real neuroscience research. ' +
        'Trace neurons, earn badges, and help chart the connectome.</p>' +
        '<button class="ew2-mw-cta">Become a Citizen Scientist</button>' +
        '<button class="ew2-mw-skip">Just exploring for now</button>' +
      '</div>';
    document.body.appendChild(backdrop);

    function dismiss() {
      rememberDismissed();
      backdrop.remove();
      style.remove();
    }

    backdrop.querySelector('.ew2-mw-close').addEventListener('click', dismiss);
    backdrop.querySelector('.ew2-mw-skip').addEventListener('click', dismiss);
    backdrop.querySelector('.ew2-mw-cta').addEventListener('click', function () {
      dismiss();
      var login = document.querySelector('.nge-login-btn');
      if (login) login.click();
    });
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) dismiss();
    });
  }

  if (document.body) {
    show();
  } else {
    document.addEventListener('DOMContentLoaded', show);
  }
})();
