module.exports = {
  plugins: [
    require("postcss-sort-media-queries")({
      sort: "mobile-first", // default value
    }),
    require('cssnano')({
      preset: 'default',
    }),
    require("autoprefixer"),
  ],
};
