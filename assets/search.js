(function () {
  var input = document.getElementById("search-input");
  var status = document.getElementById("search-status");
  var results = document.getElementById("search-results");
  var filterBox = document.getElementById("search-filter");
  if (!input || !status || !results || typeof lunr === "undefined") return;

  var posts = {};
  var allPosts = [];
  var index = null;
  var activeFilter = null;
  var indexUrl = window.SEARCH_INDEX_URL || "/search.json";
  var pageUrl = window.SEARCH_PAGE_URL || "/search.html";

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function decode(text) {
    var element = document.createElement("textarea");
    element.innerHTML = text || "";
    return element.value;
  }

  function setStatus(text) {
    status.textContent = text;
  }

  function matchesFilter(post) {
    if (!activeFilter) return true;
    var values = post[activeFilter.field] || [];
    return values.some(function (value) {
      return normalize(value) === normalize(activeFilter.value);
    });
  }

  function filterLabel() {
    return activeFilter.field === "categories" ? "categoria" : "tag";
  }

  function renderPosts(list, message) {
    results.textContent = "";

    if (!list.length) {
      setStatus("Nessun risultato.");
      return;
    }

    setStatus(message || (list.length + (list.length === 1 ? " risultato" : " risultati")));

    list.slice(0, 30).forEach(function (post) {
      var article = document.createElement("article");
      article.className = "post-preview";

      var link = document.createElement("a");
      link.href = post.url;

      var title = document.createElement("h2");
      title.className = "post-title";
      title.textContent = decode(post.title);
      link.appendChild(title);

      var excerpt = document.createElement("h3");
      excerpt.className = "post-subtitle";
      excerpt.textContent = decode(post.excerpt);
      link.appendChild(excerpt);

      article.appendChild(link);

      var meta = document.createElement("p");
      meta.className = "post-meta";
      meta.textContent = post.date +
        (post.categories && post.categories.length ? " · " + post.categories.join(", ") : "");
      article.appendChild(meta);

      results.appendChild(article);
      results.appendChild(document.createElement("hr"));
    });
  }

  function renderMatches(matches) {
    var list = matches
      .map(function (match) { return posts[match.ref]; })
      .filter(Boolean)
      .filter(matchesFilter);
    renderPosts(list);
  }

  function renderFilterNotice() {
    if (!filterBox || !activeFilter) return;

    filterBox.classList.remove("d-none");
    filterBox.textContent = "Filtro: " + filterLabel() + " \"" + activeFilter.value + "\". ";

    var link = document.createElement("a");
    link.href = pageUrl;
    link.textContent = "Mostra tutti";
    filterBox.appendChild(link);
  }

  function renderFiltered(message) {
    var filtered = allPosts.filter(matchesFilter);
    renderPosts(
      filtered,
      message || (filtered.length + " post con " + filterLabel() + " \"" + activeFilter.value + "\".")
    );
  }

  fetch(indexUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      allPosts = data;

      var docs = data.map(function (post) {
        posts[post.url] = post;
        return {
          url: post.url,
          title: post.title || "",
          categories: (post.categories || []).join(" "),
          tags: (post.tags || []).join(" "),
          excerpt: post.excerpt || ""
        };
      });

      index = lunr(function () {
        this.ref("url");
        this.field("title", { boost: 10 });
        this.field("tags", { boost: 5 });
        this.field("categories", { boost: 3 });
        this.field("excerpt");
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);
        docs.forEach(function (doc) {
          this.add(doc);
        }, this);
      });

      var params = new URLSearchParams(window.location.search);
      var category = params.get("category");
      var tag = params.get("tag");

      if (category) {
        activeFilter = { field: "categories", value: category };
      } else if (tag) {
        activeFilter = { field: "tags", value: tag };
      }

      renderFilterNotice();

      if (activeFilter) {
        renderFiltered();
      } else {
        setStatus(docs.length + " post indicizzati.");
      }
    })
    .catch(function (error) {
      setStatus("Ricerca non disponibile: " + error.message);
    });

  input.addEventListener("input", function () {
    var query = input.value.trim();
    if (!index) return;

    if (query.length < 2) {
      if (activeFilter) {
        renderFiltered();
      } else {
        results.textContent = "";
        setStatus("Scrivi almeno 2 caratteri.");
      }
      return;
    }

    var terms = query.split(/\s+/).map(function (term) {
      return term + "*";
    }).join(" ");

    try {
      renderMatches(index.search(terms));
    } catch (error) {
      renderPosts([]);
    }
  });
})();
