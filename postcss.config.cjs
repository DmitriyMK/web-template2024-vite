module.exports = {
  plugins: [
    require("postcss-sort-media-queries")({
      sort: "mobile-first", // default value
    }),
    require('cssnano')({
      "preset": [
        "advanced",
        {"discardComments": {"removeAll": true}}
      ]
    }),
    require("autoprefixer"),
  ],
};
