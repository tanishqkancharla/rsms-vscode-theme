import { hsla, parseToHsla, toHex } from "color2k";

function setSaturation(colorString: string, saturation: number) {
  const [h, s, l, a] = parseToHsla(colorString);
  return hsla(h, saturation, l, a);
}

function setLightness(colorString: string, lightness: number) {
  const [h, s, l, a] = parseToHsla(colorString);
  return hsla(h, s, lightness, a);
}

function setAlpha(colorString: string, alpha: number) {
  const [h, s, l, a] = parseToHsla(colorString);
  return hsla(h, s, l, alpha);
}

const variables = {
  red: "hsl(5, 100%, 50%)",
  green: "hsl(150, 100%, 43%)",
  blue: "hsl(210, 100%, 50%)",
  orange: "hsl(27, 100%, 50%)",
  yellow: "hsl(60, 100%, 50%)",
  cyan: "hsl(180, 100%, 50%)",
  // "transparent": "#ff000000",  // note: ff needed to force transparency

  fg: "#fff",
  bg: "hsl(50, 3%, 10%)",
  unimportant: "color(var(fg) alpha(0.4))",
  cursor: "hsl(320, 90%, 70%)",
  accent: "var(cursor)",
  selection: "hsl(204, 100%, 70%)",
  type: "var(orange)",
  keyword: "var(blue)",
  data: "var(green)",
  meta: "color(var(data) saturation(15%) lightness(50%))",
  metaKeyword: "color(var(data) saturation(20%) lightness(60%))",
  header: "color(var(keyword) saturation(80%) lightness(70%))",

  fgBase: "color(var(fg) alpha(0.8))",
  typeRef: "color(var(type) saturation(100%) lightness(87%))",
  keywordBase: "color(var(keyword) saturation(40%) lightness(70%))",
  dataBase: "color(var(data) saturation(40%) lightness(70%))",
};

const colors = {
  red: toHex(variables.red),
  green: toHex(variables.green),
  blue: toHex(variables.blue),
  orange: toHex(variables.orange),
  yellow: toHex(variables.yellow),
  cyan: toHex(variables.cyan),

  fg: toHex("#fff"),
  bg: toHex(variables.bg),
};

const derived = {
  unimportant: toHex(setAlpha(colors.fg, 0.4)),
  cursor: toHex(variables.cursor),
  accent: toHex(variables.cursor),
  selection: toHex(variables.selection),
  type: toHex(colors.orange),
  keyword: toHex(colors.blue),
  data: toHex(colors.green),
  meta: toHex(setLightness(setSaturation(colors.green, 0.15), 0.5)),
  metaKeyword: toHex(setLightness(setSaturation(colors.green, 0.2), 0.6)),
  header: toHex(setLightness(setSaturation(colors.green, 0.8), 0.7)),

  fgBase: toHex(setAlpha(colors.fg, 0.8)),
  typeRef: toHex(setLightness(setSaturation(colors.orange, 1), 0.7)),
  keywordBase: toHex(setLightness(setSaturation(colors.blue, 0.4), 0.7)),
  dataBase: toHex(setLightness(setSaturation(colors.green, 0.4), 0.7)),
};

import fs from "fs/promises";

fs.writeFile(
  `${__dirname}/colors.json`,
  JSON.stringify({ colors, derived }, undefined, 2)
);

import Teg from "teg-parser";

type ColorDef = {
  var: string;
  hue?: string;
  saturation?: string;
  lightness?: string;
  alpha?: string;
};

const number = Teg.oneOrMore(Teg.digit).map((numTokens) =>
  Number(numTokens.join(""))
);

const percent = Teg.sequence([number, Teg.str("%")]).map(
  ([number]) => number / 100
);

type HslDef = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

const hsl = Teg.sequence([
  Teg.str("hsl("),
  number,
  Teg.str(", "),
  percent,
  Teg.str(", "),
  percent,
  Teg.str(")"),
]);
