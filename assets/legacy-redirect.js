(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("p") || params.get("page_id");
  if (!id) return;

  fetch("/redirects.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (map) {
      var target = map[id];
      if (target) {
        window.location.replace(target);
      }
    })
    .catch(function () {
      /* nessun redirect: la pagina resta visibile */
    });
})();
