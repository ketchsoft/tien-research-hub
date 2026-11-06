/* Rewind: linh vật Rewi, icon nét vẽ tay và hình doodle cho thumbnail. Chỉ trang trí, không gọi mạng. */
(function () {
  var INK = '#1C1B29';
  var ICONS = {
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    card: '<rect x="4" y="7" width="13" height="13" rx="2.5"/><path d="M8 4h9a3 3 0 0 1 3 3v9"/>',
    library: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    rewind: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/>',
    loop: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    bell: '<path d="M6 10a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7h-17S6 16 6 10M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z"/>',
    speed: '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4M9 3h6"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    flame: '<path d="M12 3c1 4 6 5.5 6 11a6 6 0 0 1-12 0c0-3.5 2.2-4.8 2.2-8 1.3 1.2 2.6 2.4 3.8 2.4 0-2.2 0-3.6 0-5.4z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    sparkle: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
    vibrate: '<rect x="8" y="4" width="8" height="16" rx="2"/><path d="M4 9v6M20 9v6"/>',
    note: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    restore: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4M12 8v4l3 2"/>'
  };
  function icon(name, size) {
    var s = size || 22;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  document.querySelectorAll('i[data-ico]').forEach(function (el) {
    el.outerHTML = icon(el.dataset.ico, +el.dataset.size || 22);
  });

  /* Rewi: chú băng cassette, hai cuộn băng là đôi mắt */
  function rewi(mood) {
    var mouth = mood === 'wow' ? '<ellipse cx="60" cy="76" rx="5" ry="4" fill="' + INK + '"/>'
      : '<path d="M52 74q8 7 16 0" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
    var arms = mood === 'wave'
      ? '<path d="M8 50q-10-8-6-22" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="2" cy="26" r="5" fill="#FFC94D" stroke="' + INK + '" stroke-width="3"/>'
      : mood === 'yay'
        ? '<path d="M8 46q-12-10-4-24M112 46q12-10 4-24" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>'
        : '';
    return '<svg viewBox="-6 0 132 96" width="100%" height="100%" aria-hidden="true">' + arms +
      '<rect x="6" y="10" width="108" height="78" rx="16" fill="#FFC94D" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="20" y="20" width="80" height="16" rx="6" fill="#FFF7EA" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M28 28h40" stroke="#FF7A5C" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="28" y="44" width="64" height="26" rx="13" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="45" cy="57" r="9" fill="' + INK + '"/><circle cx="75" cy="57" r="9" fill="' + INK + '"/>' +
      '<circle cx="42" cy="54" r="3" fill="#FFFFFF"/><circle cx="72" cy="54" r="3" fill="#FFFFFF"/>' +
      '<circle cx="20" cy="66" r="5" fill="#FFA9CF"/><circle cx="100" cy="66" r="5" fill="#FFA9CF"/>' + mouth + '</svg>';
  }
  document.querySelectorAll('[data-rewi]').forEach(function (el) { el.innerHTML = rewi(el.dataset.rewi); });

  /* Doodle cho thumbnail: nét nguệch ngoạc trắng và mực trên nền màu */
  var ART = {
    a: '<path d="M-5 60q20-25 40-5t40 0 40-10" stroke="#FFF7EA" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="88" cy="16" r="9" fill="#FFF7EA" stroke="' + INK + '" stroke-width="2.5"/><path d="M10 14l5 5M15 14l-5 5" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>',
    b: '<rect x="62" y="40" width="34" height="34" rx="8" fill="#FFF7EA" stroke="' + INK + '" stroke-width="2.5" transform="rotate(14 79 57)"/><path d="M6 20q12-12 24 0t24 0" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="56" r="6" fill="' + INK + '"/>',
    c: '<path d="M80 6l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#FFF7EA" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M-4 52q16 14 32 0t32 0" stroke="#FFF7EA" stroke-width="7" fill="none" stroke-linecap="round"/>',
    d: '<circle cx="18" cy="18" r="14" fill="#FFF7EA" stroke="' + INK + '" stroke-width="2.5"/><path d="M60 64q10-20 30-14" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M70 14h20M80 4v20" stroke="#FFF7EA" stroke-width="5" stroke-linecap="round"/>'
  };
  document.querySelectorAll('[data-art]').forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 104 72" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + (ART[el.dataset.art] || '') + '</svg>';
  });
})();
