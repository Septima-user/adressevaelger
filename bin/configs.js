import * as esbuild from "esbuild";

export const ctxESM = await esbuild.context({
  entryPoints: ["index.js"],
  bundle: true,
  outfile: "dist/adressevaelger.esm.js",
  format: "esm",
  minify: true,
  keepNames: true,
});

export const ctxIIFE = await esbuild.context({
  entryPoints: ["index.js"],
  bundle: true,
  outfile: "dist/adressevaelger.iife.js",
  globalName: "adressevaelger",
  format: "iife",
  minify: true,
  keepNames: true,
});

export const ctxCJS = await esbuild.context({
  entryPoints: ["index.js"],
  bundle: true,
  outfile: "dist/adressevaelger.cjs.js",
  format: "cjs",
  minify: true,
  keepNames: true,
});

export const ctxCSS = await esbuild.context({
  entryPoints: ["src/style.css"],
  bundle: true,
  outfile: "dist/adressevaelger.css",
  minify: true,
});
