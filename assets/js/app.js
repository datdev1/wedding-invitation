/**
 * Wedding Invitation - Main Application
 * Config-driven wedding invitation website
 * Reads all content from config.json
 */

(async function () {
  'use strict';

  /* ─── Load Config ─── */
  const res = await fetch('config.json');
  const CONFIG = await res.json();

  /* ─── URL Parameters ─── */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get('to') || CONFIG.defaultGuest;
  const side = params.get('side') || 'bride';

  /* ─── SVG Icons ─── */
  const ICONS = {
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"></path></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"></path></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"></path></svg>`,
    chevronsDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 7 6 6 6-6M6 13l6 6 6-6"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14M16 5v14"></path></svg>`,
    musicOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13M9 8l11-2"></path><ellipse cx="6" cy="18" rx="3" ry="3"></ellipse><ellipse cx="17" cy="16" rx="3" ry="3"></ellipse></svg>`,
    musicOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v8M9 8l11-2M16 16l6 6m0-6-6 6"></path><ellipse cx="6" cy="18" rx="3" ry="3"></ellipse></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"></path></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"></path></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`,
  };

  /* ─── Helper Functions ─── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  /* ─── Build Cover Section ─── */
  function buildCover() {
    const ambientSpans = Array.from({ length: 12 }, (_, i) => {
      const left = 7 + i * 8;
      const dur = 9 + (i % 5);
      const delay = -(i * 1.7);
      const sway = i % 2 ? 22 : -22;
      return `<span style="--left:${left}%;--duration:${dur}s;--delay:${delay}s;--sway:${sway}px">✻</span>`;
    }).join('');

    return `
    <section class="cover" aria-label="Thiệp mời đám cưới" id="cover">
      <div class="cover-ambient" aria-hidden="true">${ambientSpans}</div>
      <div class="cover-card">
        <div class="seal-wrap">
          <div class="seal-ring"></div>
          <div class="seal">${ICONS.heart}</div>
        </div>
        <img src="${CONFIG.decorations.floral}" alt="" class="floral cover-flower left" draggable="false" loading="lazy">
        <img src="${CONFIG.decorations.floral}" alt="" class="floral cover-flower right" draggable="false" loading="lazy">
        <div class="cover-copy">
          <h1>${CONFIG.bride.firstName}<small>&amp;</small>${CONFIG.groom.firstName}</h1>
          <div class="ornament">❦</div>
          <p class="cover-date">${CONFIG.coverDate}</p>
          <p class="cover-time">${CONFIG.coverTime}</p>
          <p class="salutation">${CONFIG.salutation}</p>
          <p class="guest-name">${guestName}</p>
          <p class="invitation-message">${CONFIG.invitationMessage}</p>
          <button class="primary open-button" id="open-invitation">Mở thiệp</button>
        </div>
      </div>
      <span class="cover-footnote">TRÂN TRỌNG KÍNH MỜI</span>
    </section>`;
  }

  /* ─── Build Opening Hero ─── */
  function buildOpeningHero() {
    return `
    <header class="opening-hero">
      <p class="eyebrow">SAVE THE DATE</p>
      <div class="envelope-scene" aria-label="Ảnh cưới trong phong bì">
        <div class="envelope-back"></div>
        <div class="hero-photo">
          <img src="${CONFIG.gallery.heroImage}" alt="Ảnh cưới ${CONFIG.bride.fullName} và ${CONFIG.groom.fullName}" draggable="false" loading="eager">
        </div>
        <img src="${CONFIG.decorations.floral}" alt="" class="floral hero-flower" draggable="false" loading="lazy">
        <div class="envelope-front"></div>
        <div class="envelope-seal">${ICONS.heart}</div>
      </div>
      <div class="couple-names">
        <span>${CONFIG.bride.firstName}</span>
        <i>&amp;</i>
        <span>${CONFIG.groom.firstName}</span>
      </div>
    </header>`;
  }

  /* ─── Build Ceremony Section ─── */
  function buildCeremony() {
    const c = CONFIG.ceremony;
    return `
    <section class="ceremony section-card burgundy">
      <img src="${CONFIG.decorations.floral}" alt="" class="floral card-flower right" draggable="false" loading="lazy">
      <h2>THÔNG TIN LỄ CƯỚI</h2>
      <div class="families">
        <div>
          <p class="family-label">Nhà trai</p>
          <p>Ông Bà</p>
          <strong>${CONFIG.groom.parents.father}<br>${CONFIG.groom.parents.mother}</strong>
          <p class="family-address">${CONFIG.groom.parents.address}</p>
        </div>
        <div>
          <p class="family-label">Nhà gái</p>
          <p>Ông Bà</p>
          <strong>${CONFIG.bride.parents.father}<br>${CONFIG.bride.parents.mother}</strong>
          <p class="family-address">${CONFIG.bride.parents.address}</p>
        </div>
      </div>
      <p class="formal">TRÂN TRỌNG BÁO TIN<br>LỄ THÀNH HÔN CỦA CHÚNG TÔI</p>
      <h3 class="full-name">${CONFIG.groom.fullName}</h3>
      <p class="birth-order">${CONFIG.groom.role}</p>
      <div class="ampersand">&amp;</div>
      <h3 class="full-name">${CONFIG.bride.fullName}</h3>
      <p class="birth-order">${CONFIG.bride.role}</p>
      <p class="formal ceremony-place">LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI<br><strong>${c.venue}</strong></p>
      <p class="time-row">VÀO LÚC ${c.time} <span>${c.dayOfWeek}</span></p>
      <div class="date-block">
        <b>${c.date}</b>
        <span>${c.monthName}<br>${c.year}</span>
      </div>
      <p class="lunar">TỨC NGÀY ${c.lunarDate}</p>
    </section>`;
  }

  /* ─── Build Gallery ─── */
  function buildGallery() {
    const photos = CONFIG.gallery.images;
    const photoButtons = photos.map((src, i) => `
      <button class="gallery-photo${i === 0 ? ' active' : ''}" data-photo="${i}" 
              aria-label="Xem ảnh cưới ${i + 1}" tabindex="${i === 0 ? 0 : -1}">
        <img src="${src}" alt="Ảnh cưới ${i + 1} của ${CONFIG.bride.firstName} và ${CONFIG.groom.firstName}" 
             draggable="false" loading="lazy">
      </button>`).join('');

    const dots = photos.map((_, i) => `
      <button data-dot="${i}" aria-label="Tới ảnh ${i + 1}" ${i === 0 ? 'class="active" aria-pressed="true"' : 'aria-pressed="false"'}>
        <span></span>
      </button>`).join('');

    return `
    <section class="gallery-section" id="gallery" aria-label="Album ảnh cưới">
      <h2>ALBUM ẢNH</h2>
      <div class="gallery-stage">
        <div class="gallery-perspective">${photoButtons}</div>
        <button class="gallery-arrow prev icon-button" aria-label="Ảnh trước">${ICONS.chevronLeft}</button>
        <button class="gallery-arrow next icon-button" aria-label="Ảnh sau">${ICONS.chevronRight}</button>
      </div>
      <div class="gallery-dots" aria-label="Chọn ảnh">${dots}</div>
    </section>`;
  }

  /* ─── Build Reception Section ─── */
  function buildReception() {
    const r = CONFIG.reception;
    const cal = CONFIG.calendar;

    // Build calendar grid
    const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    let calendarHTML = weekdays.map(d => `<span class="weekday">${d}</span>`).join('');

    // Empty cells before first day
    for (let i = 0; i < cal.firstDayOffset; i++) calendarHTML += '<span></span>';

    // Day cells
    for (let d = 1; d <= cal.totalDays; d++) {
      if (d === cal.highlightDay) {
        calendarHTML += `<span class="wedding-day" aria-label="Ngày cưới ${d}">${d}</span>`;
      } else {
        calendarHTML += `<span>${d}</span>`;
      }
    }

    return `
    <section class="reception section-card burgundy">
      <img src="${CONFIG.decorations.floral}" alt="" class="floral card-flower left" draggable="false" loading="lazy">
      <h2>THÔNG TIN TIỆC CƯỚI</h2>
      <h3 class="reception-subtitle">TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:</h3>
      <p class="time-row">${r.dayOfWeek}<span>${r.time}</span></p>
      <div class="date-block">
        <b>${r.date}</b>
        <span>${r.monthName}<br>${r.year}</span>
      </div>
      <p class="lunar">TỨC NGÀY ${r.lunarDate}</p>
      <p class="banquet">KHAI TIỆC<br><strong>${r.banquetTime}</strong></p>
      <div class="wedding-calendar">
        <p>Tháng ${cal.month} / ${cal.year}</p>
        <div class="calendar-grid">${calendarHTML}</div>
      </div>
    </section>`;
  }

  /* ─── Build Venue Section ─── */
  function buildVenue() {
    function venueArticle(key) {
      const v = CONFIG.venues[key];
      return `
      <article class="family-venue">
        <h3>${v.label}</h3>
        <p>${v.address}</p>
        <iframe title="Bản đồ ${v.label}" 
                src="${v.mapEmbedUrl}" 
                loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <a class="outline-button" href="https://www.google.com/maps/search/?api=1&query=${v.mapQuery}" 
           target="_blank" rel="noopener noreferrer">
          ${ICONS.mapPin} Chỉ đường đến ${v.label.toLowerCase()}
        </a>
      </article>`;
    }

    return `
    <section class="venue narrow-section">
      <h2>ĐỊA ĐIỂM HAI GIA ĐÌNH</h2>
      ${venueArticle('bride')}
      ${venueArticle('groom')}
    </section>`;
  }

  /* ─── Build Guestbook ─── */
  function buildGuestbook() {
    return `
    <section class="guestbook narrow-section" id="guestbook">
      <div class="guestbook-card">
        <img src="${CONFIG.decorations.floral}" alt="" class="floral guestbook-flower" draggable="false" loading="lazy">
        <h2>SỔ LƯU BÚT</h2>
        <form novalidate>
          <label for="guest-name-input">Tên của bạn</label>
          <input id="guest-name-input" name="name" maxlength="80" autocomplete="name" 
                 placeholder="Tên của bạn" required value="${guestName}" readonly>
          <label for="guest-message">Lời chúc của bạn</label>
          <textarea id="guest-message" name="message" maxlength="1000" 
                    placeholder="Gửi đôi lời yêu thương…" required></textarea>
          <p id="guestbook-status" class="form-status" role="status" aria-live="polite"></p>
          <div class="submit-row">
            <button class="primary" type="submit">GỬI LỜI CHÚC</button>
          </div>
        </form>
      </div>
      <div class="guestbook-messages" tabindex="0" role="region" aria-label="Những lời chúc dành cho đôi bạn"></div>
    </section>`;
  }

  /* ─── Build Gift Section ─── */
  function buildGift() {
    return `
    <section class="gift-section">
      <h2>HỘP QUÀ MỪNG</h2>
      <button id="open-gift" class="gift-button" aria-haspopup="dialog">
        <span class="gift-envelopes" aria-hidden="true">
          <span class="gift-envelope">${ICONS.heart}</span>
          <span class="gift-envelope">${ICONS.heart}</span>
        </span>
        <span class="gift-label">Nhấn để mở</span>
      </button>
    </section>`;
  }

  /* ─── Build Gift Modal ─── */
  function buildGiftModal() {
    function giftAccount(person, label) {
      const bank = person.bank;
      return `
      <article data-gift="${label}">
        <h3>Mừng ${label === 'bride' ? 'cô dâu' : 'chú rể'}</h3>
        <a class="qr-image" href="${bank.qrImage}" target="_blank" rel="noopener noreferrer" 
           aria-label="Xem QR Mừng ${label === 'bride' ? 'cô dâu' : 'chú rể'} nguyên bản">
          <img src="${bank.qrImage}" alt="Mã QR Mừng ${label === 'bride' ? 'cô dâu' : 'chú rể'}" draggable="false" loading="lazy">
        </a>
        <p class="bank-name">${bank.name}</p>
        <p class="account-number">${bank.accountNumber}</p>
        <strong class="account-holder">${bank.accountHolder}</strong>
        <a class="outline-button" href="${bank.qrImage}" download="${label}-qr.jpg">
          ${ICONS.download} Lưu QR
        </a>
      </article>`;
    }

    return `
    <div class="overlay gift-overlay" id="gift-modal" hidden role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <div class="gift-dialog">
        <header>
          <h2 id="gift-title">HỘP QUÀ MỪNG</h2>
          <button class="icon-button" data-close aria-label="Đóng hộp quà">${ICONS.close}</button>
        </header>
        <div class="gift-accounts">
          ${giftAccount(CONFIG.bride, 'bride')}
          ${giftAccount(CONFIG.groom, 'groom')}
        </div>
      </div>
    </div>`;
  }

  /* ─── Build Footer ─── */
  function buildFooter() {
    const lines = CONFIG.footerMessage.split('\n');
    return `
    <footer>
      <div class="ornament">❦</div>
      <p>${lines.join('<br>')}</p>
      <span>${CONFIG.bride.firstName} &amp; ${CONFIG.groom.firstName}</span>
    </footer>`;
  }

  /* ─── Build Petals ─── */
  function buildPetals() {
    const count = 12;
    const spans = Array.from({ length: count }, (_, i) => {
      const left = 3 + i * 8.3;
      const dur = 11000 + (i % 6) * 2600;
      const delay = -(i * 1.8);
      const size = 7 + (i % 4) * 3;
      const sway = i % 2 ? 38 : -28;
      return `<span style="--left:${left}%;--duration:${dur}ms;--delay:${delay}s;--size:${size}px;--sway:${sway}px"></span>`;
    }).join('');
    return `<div class="petal-layer" aria-hidden="true">${spans}</div>`;
  }

  /* ─── Build Floating Controls ─── */
  function buildFloatingControls() {
    return `
    <aside class="floating-controls" id="floating-controls" aria-label="Điều khiển thiệp" hidden>
      <button class="icon-button" id="scroll-toggle" aria-label="Bật tự động cuộn" aria-pressed="false">
        ${ICONS.chevronsDown}
      </button>
      <button class="icon-button" id="music-toggle" aria-label="Phát nhạc" aria-pressed="false">
        ${ICONS.musicOff}
      </button>
      <span id="music-status" class="control-status" role="status"></span>
    </aside>`;
  }

  /* ─── Build Lightbox ─── */
  function buildLightbox() {
    const thumbs = CONFIG.gallery.images.map((src, i) => `
      <button data-thumb="${i}" aria-label="Ảnh thu nhỏ ${i + 1}">
        <img src="${src}" alt="Ảnh cưới ${i + 1} của ${CONFIG.bride.firstName} và ${CONFIG.groom.firstName}" 
             draggable="false" loading="lazy">
      </button>`).join('');

    return `
    <div class="overlay lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Album ảnh cưới">
      <button class="overlay-close icon-button" data-close aria-label="Đóng album">${ICONS.close}</button>
      <p class="lightbox-counter" aria-live="polite"></p>
      <div class="lightbox-image-area">
        <div class="zoom-pan">
          <img class="lightbox-image" alt="" decoding="async" src="${CONFIG.gallery.images[0]}">
        </div>
      </div>
      <button class="lightbox-prev icon-button" aria-label="Ảnh trước">${ICONS.chevronLeft}</button>
      <button class="lightbox-next icon-button" aria-label="Ảnh sau">${ICONS.chevronRight}</button>
      <div class="lightbox-bottom">
        <div class="zoom-controls">
          <button class="icon-button" data-zoom="-1" aria-label="Thu nhỏ">${ICONS.minus}</button>
          <button class="zoom-reset" aria-label="Đặt lại thu phóng">100%</button>
          <button class="icon-button" data-zoom="1" aria-label="Phóng to">${ICONS.plus}</button>
        </div>
        <div class="thumbnails">${thumbs}</div>
      </div>
    </div>`;
  }

  /* ─── Set Page Metadata ─── */
  document.title = `${CONFIG.bride.firstName} & ${CONFIG.groom.firstName} · Thiệp Mời Cưới!`;
  $('meta[name="theme-color"]')?.setAttribute('content', CONFIG.themeColor);

  /* ─── Render All Sections ─── */
  $('#app').innerHTML = [
    buildCover(),
    `<main id="invitation" class="invitation" hidden inert>`,
    buildOpeningHero(),
    buildCeremony(),
    buildGallery(),
    buildReception(),
    buildVenue(),
    buildGuestbook(),
    buildGift(),
    buildFooter(),
    `</main>`,
    buildPetals(),
    buildFloatingControls(),
    buildLightbox(),
    buildGiftModal(),
  ].join('');

  /* ═══════════════════════════════════════════
     Interactive Features
     ═══════════════════════════════════════════ */

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Gallery Carousel ─── */
  const photos = $$('.gallery-photo');
  const dots = $$('.gallery-dots button');
  const total = photos.length;
  let current = 0;
  let autoGalleryTimer;

  function positionPhotos() {
    photos.forEach((el, i) => {
      const offset = i - current;
      const absOffset = Math.abs(offset);
      let tx, tz, ry, scale, opacity, z;

      if (absOffset === 0) {
        tx = 0; tz = 0; ry = 0; scale = 1; opacity = 1; z = 100;
      } else if (absOffset === 1) {
        tx = offset * 60; tz = -150; ry = offset * 45; scale = 0.85; opacity = 0.75; z = 99;
      } else if (absOffset === 2) {
        tx = offset * 60; tz = -300; ry = offset * 45; scale = 0.7; opacity = 0.5; z = 98;
      } else if (absOffset === 3) {
        tx = offset * 60; tz = -450; ry = offset * 45; scale = 0.7; opacity = 0.3; z = 97;
      } else {
        tx = offset * 60; tz = -600; ry = offset * 45; scale = 0.7; opacity = 0.3; z = 96;
      }

      el.style.transform = `translateX(${tx}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.zIndex = z;
      el.classList.toggle('active', i === current);
      el.tabIndex = i === current ? 0 : -1;
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-pressed', i === current);
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    positionPhotos();
  }

  // Arrow buttons
  $('.gallery-arrow.prev')?.addEventListener('click', () => goTo(current - 1));
  $('.gallery-arrow.next')?.addEventListener('click', () => goTo(current + 1));

  // Dot buttons
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.dot)));

  // Click on photo
  photos.forEach(p => p.addEventListener('click', () => {
    const idx = +p.dataset.photo;
    if (idx === current) openLightbox(current);
    else goTo(idx);
  }));

  // Touch swipe on gallery
  let touchStartX = 0;
  const stage = $('.gallery-stage');
  if (stage) {
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  // Auto-advance gallery
  function startAutoGallery() {
    stopAutoGallery();
    autoGalleryTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function stopAutoGallery() { clearInterval(autoGalleryTimer); }

  positionPhotos();

  /* ─── Lightbox ─── */
  const lightbox = $('#lightbox');
  const lightboxImg = $('.lightbox-image');
  const lightboxCounter = $('.lightbox-counter');
  const thumbButtons = $$('.thumbnails button');
  let lightboxIdx = 0;
  let zoomLevel = 1;

  function openLightbox(idx) {
    lightboxIdx = idx;
    updateLightbox();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('visible'));
    document.body.classList.add('modal-open');
    stopAutoGallery();
  }

  function closeLightbox() {
    lightbox.classList.remove('visible');
    setTimeout(() => { lightbox.hidden = true; }, 300);
    document.body.classList.remove('modal-open');
    resetZoom();
  }

  function updateLightbox() {
    const images = CONFIG.gallery.images;
    lightboxImg.src = images[lightboxIdx];
    lightboxCounter.textContent = `${lightboxIdx + 1} / ${images.length}`;
    thumbButtons.forEach((b, i) => b.classList.toggle('active', i === lightboxIdx));
    // Scroll active thumbnail into view
    const activeThumb = thumbButtons[lightboxIdx];
    activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function resetZoom() {
    zoomLevel = 1;
    lightboxImg.style.transform = '';
    $('.zoom-pan')?.classList.remove('zoomed');
    $('.zoom-reset').textContent = '100%';
  }

  // Lightbox navigation
  $('.lightbox-prev')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx - 1 + total) % total;
    updateLightbox(); resetZoom();
  });
  $('.lightbox-next')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx + 1) % total;
    updateLightbox(); resetZoom();
  });

  // Lightbox close
  lightbox?.querySelector('[data-close]')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Thumbnails
  thumbButtons.forEach(b => b.addEventListener('click', () => {
    lightboxIdx = +b.dataset.thumb;
    updateLightbox(); resetZoom();
  }));

  // Zoom controls
  $$('[data-zoom]').forEach(btn => btn.addEventListener('click', () => {
    const dir = +btn.dataset.zoom;
    zoomLevel = Math.max(0.5, Math.min(4, zoomLevel + dir * 0.5));
    lightboxImg.style.transform = `scale(${zoomLevel})`;
    $('.zoom-reset').textContent = Math.round(zoomLevel * 100) + '%';
    $('.zoom-pan')?.classList.toggle('zoomed', zoomLevel > 1);
  }));

  $('.zoom-reset')?.addEventListener('click', resetZoom);

  // Keyboard nav for lightbox
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lightboxIdx = (lightboxIdx - 1 + total) % total; updateLightbox(); resetZoom(); }
    if (e.key === 'ArrowRight') { lightboxIdx = (lightboxIdx + 1) % total; updateLightbox(); resetZoom(); }
  });

  /* ─── Gift Modal ─── */
  const giftModal = $('#gift-modal');

  function openGiftModal() {
    giftModal.hidden = false;
    requestAnimationFrame(() => giftModal.classList.add('visible'));
    document.body.classList.add('modal-open');
  }

  function closeGiftModal() {
    giftModal.classList.remove('visible');
    setTimeout(() => { giftModal.hidden = true; }, 300);
    document.body.classList.remove('modal-open');
  }

  $('#open-gift')?.addEventListener('click', openGiftModal);
  giftModal?.querySelector('[data-close]')?.addEventListener('click', closeGiftModal);
  giftModal?.addEventListener('click', e => { if (e.target === giftModal) closeGiftModal(); });

  /* ─── Auto Scroll ─── */
  let autoScrollActive = false;
  let autoScrollRAF;
  const SCROLL_SPEED = 0.8; // px per frame

  function autoScrollTick() {
    if (!autoScrollActive) return;
    window.scrollBy(0, SCROLL_SPEED);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll) {
      autoScrollActive = false;
      updateScrollButton();
      return;
    }
    autoScrollRAF = requestAnimationFrame(autoScrollTick);
  }

  function toggleAutoScroll() {
    autoScrollActive = !autoScrollActive;
    updateScrollButton();
    if (autoScrollActive) autoScrollRAF = requestAnimationFrame(autoScrollTick);
    else cancelAnimationFrame(autoScrollRAF);
  }

  function updateScrollButton() {
    const btn = $('#scroll-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', autoScrollActive);
    btn.setAttribute('aria-label', autoScrollActive ? 'Dừng tự động cuộn' : 'Bật tự động cuộn');
    btn.innerHTML = autoScrollActive ? ICONS.pause : ICONS.chevronsDown;
  }

  $('#scroll-toggle')?.addEventListener('click', toggleAutoScroll);

  // Pause auto-scroll on manual scroll
  let scrollTimeout;
  window.addEventListener('wheel', () => {
    if (autoScrollActive) {
      cancelAnimationFrame(autoScrollRAF);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (autoScrollActive) autoScrollRAF = requestAnimationFrame(autoScrollTick);
      }, 2000);
    }
  }, { passive: true });

  /* ─── Music Toggle ─── */
  const musicToggle = $('#music-toggle');
  const musicStatus = $('#music-status');
  let musicPlaying = false;
  let audio = null;

  function setupMusic() {
    if (!CONFIG.music.enabled || !CONFIG.music.src) return null;
    audio = new Audio(CONFIG.music.src);
    audio.loop = true;
    audio.volume = 0.5;
    return audio;
  }

  function playMusic() {
    if (!audio) setupMusic();
    if (!audio) {
      musicStatus.textContent = 'Không có nhạc';
      setTimeout(() => { musicStatus.textContent = ''; }, 2000);
      return;
    }
    audio.play().then(() => {
      musicPlaying = true;
      updateMusicButton();
    }).catch(() => {
      musicStatus.textContent = 'Không thể phát nhạc';
      setTimeout(() => { musicStatus.textContent = ''; }, 2000);
    });
  }

  function toggleMusic() {
    if (!audio && CONFIG.music.enabled) {
      playMusic();
      return;
    }
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
    } else {
      audio.play();
      musicPlaying = true;
    }
    updateMusicButton();
  }

  function updateMusicButton() {
    if (!musicToggle) return;
    musicToggle.setAttribute('aria-pressed', musicPlaying);
    musicToggle.setAttribute('aria-label', musicPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc');
    musicToggle.innerHTML = musicPlaying ? ICONS.musicOn : ICONS.musicOff;
  }

  musicToggle?.addEventListener('click', toggleMusic);

  /* ─── Open Invitation ─── */
  let opened = false;
  const openBtn = $('#open-invitation');
  const cover = $('#cover');
  const main = $('#invitation');
  const controls = $('#floating-controls');

  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  openBtn?.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;

    // Try playing music on open
    if (CONFIG.music.enabled) playMusic();

    cover.classList.add('opening');

    const delay = reduced ? 100 : 2100;
    setTimeout(() => {
      main.hidden = false;
      main.inert = false;
      document.body.classList.remove('is-closed');
      document.body.classList.add('is-open');
      window.scrollTo(0, 0);
      main.classList.add('revealed');
      if (controls) controls.hidden = false;
      cover.hidden = true;
      main.tabIndex = -1;
      main.focus({ preventScroll: true });

      // Start auto-scroll
      if (!reduced) {
        autoScrollActive = true;
        updateScrollButton();
        autoScrollRAF = requestAnimationFrame(autoScrollTick);
      }

      // Start gallery auto-advance
      startAutoGallery();
    }, delay);
  });

  /* ─── Guestbook (Local Storage) ─── */
  const guestbookForm = $('form', $('.guestbook'));
  const guestbookMessages = $('.guestbook-messages');
  const STORAGE_KEY = 'wedding_guestbook';

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  }

  function saveMessage(name, message) {
    const messages = loadMessages();
    messages.unshift({ name, message, time: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    renderMessages();
  }

  function renderMessages() {
    const messages = loadMessages();
    if (!messages.length) {
      guestbookMessages.innerHTML = '';
      return;
    }
    guestbookMessages.innerHTML = messages.map(m => {
      const date = new Date(m.time);
      const timeStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `
      <div class="message">
        <header>
          <strong>${escapeHtml(m.name)}</strong>
          <time>${timeStr}</time>
        </header>
        <p>${escapeHtml(m.message)}</p>
      </div>`;
    }).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  guestbookForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = guestbookForm.querySelector('[name="name"]').value.trim();
    const message = guestbookForm.querySelector('[name="message"]').value.trim();
    if (!name || !message) {
      const status = $('#guestbook-status');
      status.textContent = 'Vui lòng điền đầy đủ thông tin.';
      return;
    }
    saveMessage(name, message);
    guestbookForm.querySelector('[name="message"]').value = '';
    const status = $('#guestbook-status');
    status.textContent = 'Đã gửi lời chúc! Cảm ơn bạn ❤️';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });

  renderMessages();

})();
