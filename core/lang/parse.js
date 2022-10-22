const nearley = require("nearley");
const grammar = require("./digital.js");
const fs = require("mz/fs");


async function parse(inputFile,outputFile){ 
  if(!fs.existsSync(inputFile))
  {
    console.error(`File ${inputFile} doesn't exist.`)
  }
  const lcCode = (await fs.readFile(inputFile)).toString().trim();
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(lcCode);
  if (parser.results.length > 1) {
    console.log("Error: ambigous grammer detected, writing all possible jsons.");
    const ast = parser.results;
    await fs.writeFile(outputFile, JSON.stringify(ast, null, " "));
    console.log(`Wrote ${outputFile}.`);
  } else if (parser.results.length == 1) {
    const ast = parser.results[0];
    await fs.writeFile(outputFile, JSON.stringify(ast, null, " "));
    console.log("Parse Completed Sucessfully.");
    console.log(`Wrote ${outputFile}.`);
  } else {
    console.error("Error: no parse found.");
  }
}



module.exports = {parse}


//module.exports.getJSON = getJSONFronLC;