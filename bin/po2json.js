#!/usr/bin/env node

// This node script will generate an /locales/json/{lang}.json file of translations
//  _per_ /locales/po/{lang}.po file of translations it locates.

const path = require("path");
const fs = require("fs");
const glob = require("glob");
const po2json = require("po2json");
const chalk = require("chalk");

const poSrc = path.resolve(__dirname, "../public/locales/po");
const jsonDest = path.resolve(__dirname, "../public/locales");

const printFilePath = (filePath) =>
  chalk.bold(path.relative(process.cwd(), filePath));

const jsonForFilename = (filename) =>
  po2json.parseFileSync(filename, {
    stringify: true,
    fuzzy: true,
    pretty: true,
    format: "mf",
  });

glob.sync(path.join(poSrc, "*.po")).forEach((poFilePath) => {
  const language = path.basename(poFilePath).replace(/\.po$/, "");
  const languagePath = path.join(jsonDest, language);
  const jsonFilePath = path.join(languagePath, "translation.json");

  process.stdout.write(
    `Generating ${printFilePath(jsonFilePath)} from ${printFilePath(
      poFilePath
    )}... `
  );

  const jsonTranslations = jsonForFilename(poFilePath);
  fs.writeFileSync(jsonFilePath, jsonTranslations);

  process.stdout.write(`${chalk.bold.green("OK")}\n`);
});
