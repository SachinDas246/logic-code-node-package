const path = require('path');
const constants = require('./constants')

function ctranConfigureMake(workingDir,component) {

    let MakeConfig = {};
    let makeConfigFileName = path.join(workingDir,constants.path.MAKE_CONFIG)
    if (fs.existsSync(makeConfigFileName)) {
      MakeConfig = JSON.parse((await fs.readFile(makeConfigFileName)).toString().trim());
    }  
    MakeConfig[component] = {
      "target": component,
      "dependencies": [ path.join(constants.path.TEMP_DIR,`${component}.o`)],
      "action": `g++ ${path.join(constants.path.TEMP_DIR,`${component}.o`)}`,
      "outputfilename": path.join(constants.path.BUILD_DIR,component)
    }
    MakeConfig[path.join(constants.path.TEMP_DIR,`${component}.o`)] = {
      "target": path.join(constants.path.TEMP_DIR,`${component}.o`),
      "dependencies": [path.join(constants.path.GEN_DIR,`${component}.cpp`)],
      "action": `g++ -c ${path.join(constants.path.GEN_DIR,`${component}.cpp`)}`,
      "outputfilename": path.join(constants.path.TEMP_DIR,`${component}.o`)
    }
    return MakeConfig;
}

function genMakeFile(workingDir) {
  let inputfilename = path.join(workingDir,constants.path.MAKE_CONFIG);
  let outputfilename = path.join(workingDir,constants.path.MAKE_FILE);
  const conf = (await fs.readFile(inputfilename)).toString().trim();
  const confJson = await JSON.parse(conf);

  const keys = Object.keys(confJson);
  let code = [];
  keys.map(e => {
    let cd = `${confJson[e].target}: ${confJson[e].dependencies.join(" ")}\n\t${confJson[e].action}${(confJson[e].hasOwnProperty("outputfilename")) ? ` -o ${confJson[e].outputfilename}` : ""}`
    code.push(cd);
  })

  await fs.writeFile(outputfilename, code.join("\n"));

  //console.log(code.join("\n"));
}

module.exports = {ctranConfigureMake,genMakeFile}