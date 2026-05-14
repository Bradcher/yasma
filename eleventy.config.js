module.exports = function (eleventyConfig) {
  // Existing pages — copied verbatim, excluded from Eleventy template processing
  // via .eleventyignore so they land at _site/[name].html, not _site/[name]/index.html.
  // Nav links use .html hrefs, so this keeps them working without redirects.
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("about.html");
  eleventyConfig.addPassthroughCopy("services.html");
  eleventyConfig.addPassthroughCopy("gallery.html");
  eleventyConfig.addPassthroughCopy("privacy-policy.html");
  eleventyConfig.addPassthroughCopy("terms-of-service.html");

  // Static assets
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("mailbox.jpg");
  eleventyConfig.addPassthroughCopy("pavers.jpg");

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
