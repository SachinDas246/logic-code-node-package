const moo = require("moo");
const { fs } = require("mz");

let lexer = moo.compile({
  WS: /[ \t]+/,
  number: /0|[1-9][0-9]*/,
  lparen: "(",
  rparen: ")",
  lbrace: "{",
  rbrace: "}",
  lsqbrace: "[",
  rsqbrace: "]",
  identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
  semicolen: ";",
  comma: ",",
  fatarrow: "=>",
  dot: ".",
  equal: "=",
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  NL: { match: /\n/, lineBreaks: true },
});

module.exports = lexer;