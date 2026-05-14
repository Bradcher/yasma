module.exports = function (eleventyConfig) {
  // ─── Passthrough copies ────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("about.html");
  eleventyConfig.addPassthroughCopy("services.html");
  eleventyConfig.addPassthroughCopy("gallery.html");
  eleventyConfig.addPassthroughCopy("privacy-policy.html");
  eleventyConfig.addPassthroughCopy("terms-of-service.html");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("robots.txt");
  // sitemap.xml intentionally omitted — replaced by dynamic sitemap.njk
  eleventyConfig.addPassthroughCopy("mailbox.jpg");
  eleventyConfig.addPassthroughCopy("pavers.jpg");
  eleventyConfig.addPassthroughCopy("admin");

  // ─── Filters ──────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("dateDisplay", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());

  eleventyConfig.addFilter("dateRFC822", (date) =>
    new Date(date).toUTCString()
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  });

  // Return first n items from an array
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Return all posts except the one with the given URL (used for Recent Posts)
  eleventyConfig.addFilter("except", (posts, url) =>
    posts.filter((p) => p.url !== url)
  );

  // Filter out drafts and future-dated posts (for Eleventy's auto tag collections)
  eleventyConfig.addFilter("livePosts", (posts) => {
    const now = new Date();
    return posts.filter((p) => !p.data.draft && p.date <= now);
  });

  // ─── Collections ──────────────────────────────────────────────────────────
  // Published posts, newest first. Excludes drafts and future dates.
  eleventyConfig.addCollection("posts", (api) => {
    const now = new Date();
    return api
      .getFilteredByGlob("posts/*.md")
      .filter((p) => !p.data.draft && p.date <= now)
      .sort((a, b) => b.date - a.date);
  });

  // Category archive: array of { name, posts[] } objects, sorted A–Z.
  // Only includes live posts. Shared with blog/category.njk via pagination.
  eleventyConfig.addCollection("allCategories", (api) => {
    const now = new Date();
    const posts = api
      .getFilteredByGlob("posts/*.md")
      .filter((p) => !p.data.draft && p.date <= now);

    const catMap = new Map();
    posts.forEach((post) => {
      (post.data.categories || []).forEach((cat) => {
        if (!catMap.has(cat)) catMap.set(cat, { name: cat, posts: [] });
        catMap.get(cat).posts.push(post);
      });
    });

    return Array.from(catMap.values()).map((cat) => ({
      ...cat,
      posts: cat.posts.sort((a, b) => b.date - a.date),
    }));
  });

  return {
    htmlTemplateEngine: false,
    markdownTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
