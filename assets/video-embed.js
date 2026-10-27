(function () {
  document.querySelectorAll('.video-embed').forEach(function (box) {
    var button = box.querySelector('.video-embed-play');
    if (!button) return;

    button.addEventListener('click', function () {
      var src = box.getAttribute('data-src');
      if (!src) return;

      var joiner = src.indexOf('?') === -1 ? '?' : '&';
      var iframe = document.createElement('iframe');
      iframe.src = src + joiner + 'autoplay=1';
      iframe.title = 'Video YouTube';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.maxWidth = box.style.maxWidth || '100%';
      iframe.style.aspectRatio = box.style.aspectRatio || '16 / 9';
      iframe.style.height = 'auto';
      iframe.style.border = '0';
      iframe.style.display = 'block';
      iframe.style.margin = '1.5rem auto';
      box.replaceWith(iframe);
    });
  });
})();
