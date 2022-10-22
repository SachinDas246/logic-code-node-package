const path = require('path');
const constants = require('../core/constants')
const grammar = require("../core/lang/digital");
const fs = require("mz/fs");
const template = require("./template");
const nearley = require("nearley");


let copiedfiles = []; //to keep track of copied files to the program
let definedModuleArray = {}; // to keep tack of modules currently defined and its i/o
let includestatements = []; // to keep track of all include statements

let worksapce_defined = false; // to check if workspace has been alreaddy defined

let MakeConfig = {}; // sotre make config

function parse(code,filename) {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	parser.feed(code);
	let json_code;
	if (parser.results.length > 1) {
	  ErrorExit(`Error: ambigous grammer detected in ${filename}.\n`);
	} else if (parser.results.length == 1) {
	  json_code = parser.results[0];
	} else {
	  ErrorExit("Error: no parse found in  ${filename}.\n ");
	}
	return json_code;
}



async function getInclude(filename,workingDir,componentName) {
	
	filename = path.join(workingDir,'gen',"lib",filename.replace(/"/g, ""))+".json";// to remove "
	
	//filename = filename.replace(/\/\//g, "/") + ".json";
	
	if(fs.existsSync(filename))
	{
		
		let json;
		json = (await fs.readFile(filename)).toString().trim();

		json = JSON.parse(json);
		const include = json.include;

		if(!includestatements.includes(include))
	  	{
		
			//makefile
			file = componentName
			//let file = programName.replace(".lc", "");

			json.dependencies.map(e => {
			MakeConfig[file].dependencies.push(e.target);
			MakeConfig[file].action = MakeConfig[file].action + " " + e.outputfilename;
			MakeConfig[e.target] = e;
			})
		
			// include
			
			json.modules.map((e) => {
			AddtoDefinedModuleArray(e.name, e.outputs, e.inputs, "externalincludefile", "externalincludefile");
			})
		}


		return include;
	}else{
		ErrorExit(`Unable to find library ${filename}. please make sure the library exists.`);
	}
}

async function initMake(workingDir,component) {
    
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
}

async function genMakeFile(workingDir) {	
	let inputfilename = path.join(workingDir,constants.path.MAKE_CONFIG);

	if(!fs.existsSync(inputfilename))
	{
		console.error("Make config File doesn't exist.");
		return 0;
	}

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
  
	console.log("Makefile successfully generated");
  }

const transpileFromLC = async function (lcFilePath,workingDir){
	let componentName = lcFilePath.replace(workingDir,"").replace(".lc","");
	copiedfiles.push(lcFilePath);
	initMake(workingDir,componentName);

	const lcCode = (await fs.readFile(lcFilePath)).toString().trim();
	const jsonlc =  parse(lcCode,lcFilePath);
	processJSONCode(jsonlc,workingDir,componentName);

}


const transpileFromJSON = async function (jsonFilePath,workingDir){
    let componentName = jsonFilePath.replace(workingDir,"").replace(".json","");
	copiedfiles.push(jsonFilePath);
	initMake(workingDir,componentName);
    
    
    const jsonlc = JSON.parse((await fs.readFile(jsonFilePath)).toString().trim());
    processJSONCode(jsonlc,workingDir,componentName)
}


async function processJSONCode(jsonCode,workingDir,componentName)
{
    jsonCode = await preprocess(jsonCode,workingDir); // add copy command files
    let CPPCode = await getComponents(jsonCode,workingDir,componentName); // component name is same as file used

	// Write cpp code to outputfile
    let outputFileName = path.join(workingDir,constants.path.GEN_DIR,componentName+".cpp")
	await fs.writeFile(outputFileName,CPPCode);

    // Make Config
    await fs.writeFile(path.join(workingDir,constants.path.MAKE_CONFIG), JSON.stringify(MakeConfig,null,4));
    
    // Generate Make
    await genMakeFile(workingDir)
	
	console.log("Generation Completed")
}



async function preprocess(components,workingDir)
{
    const fnl_component = [];  
    for (let i = 0; i < components.length; i++)
	{
    	if (components[i].type === "copy")
		{
        	ar = await copyLC(components[i].file.value,workingDir);
        	fnl_component.push(...ar);
      	}else
		{
        	fnl_component.push(components[i]);
      	}
    }  
    return fnl_component;
}

async function copyLC(copyFileName,workingDir)
{
	copyFileName = copyFileName.replace(/\"/g, "");
    fileToCopyPath = path.join(workingDir,copyFileName)
    //filename = (working_dir + filename.replace(/\"/g, ""));
    if (!copiedfiles.includes(fileToCopyPath))
	{
    	copiedfiles.push(fileToCopyPath);
		if(fs.existsSync(fileToCopyPath))
		{

		
			const code = ((await fs.readFile(fileToCopyPath)).toString()).trim();
			const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
			parser.feed(code);
			let json_code;
			if (parser.results.length > 1)
			{
				ErrorExit(`Error: ambigous grammer detected in ${filename}.\n`);
			}else if (parser.results.length == 1)
			{
				json_code = parser.results[0];
			}else
			{
				ErrorExit("Error: no parse found in  ${filename}.\n");
			}  
			const cde = await preprocess(json_code); // to copy any additional copy in the codied file  
			return cde;
		}else{
			ErrorExit(`${fileToCopyPath} doesn't exit.`);
		}
    }
    Warn(`Skipped duplication of file: ${filename}\n`);
    return [];
}

function getInitialLines() {
    let lines = [];
    // required headers for builtin process
    includestatements.push(`#include<iostream>`);
    includestatements.push(`#include<fstream>`);
    includestatements.push(`#include<sstream>`);
  
    lines.push(`using namespace std;`);
    lines.push(`\nint upp = 5;\n`);
    lines.push(`int StrToNum(string n)
  {
      stringstream str(n);
      int x = 0;
      str>>x;
      return x;
  }
  
  `);
  
    return lines;
  }

async function getComponents(Components,workingDir,componentName)
{
  	let lines = getInitialLines();

	for (let component of Components) {
		const line = await getComponent(component,workingDir,componentName);
		if (line != ``) {
		lines.push(line);
		}
	}
	lines = includestatements.concat(lines);
	return lines.join("\n");
}

function getModulePortList(PortList)
{
	return PortList.map((port) => {
	  return port.value;
	});
}
function isModuleDefined(name)
{
	return definedModuleArray.hasOwnProperty(name);
}
function isModuleGoodtoUSE(currentmodulename, checkname, l, c)
{
	if (currentmodulename == checkname)
	{
		ErrorExit(`Module ${currentmodulename} cannot be child of its own at line: ${l}, col: ${l}.\n`);
	} else if (!isModuleDefined(checkname))
	{
	  	console.log(`Modules defined till now`);
	  	console.log(definedModuleArray);
	  	ErrorExit(`Module ${checkname} is not defined before using in ${currentmodulename} at line: ${l}, col: ${c}.\n`);
	} else {
	  	return true;
	}
}
function getModuleContain(modulehead, body, containedmds)
{
	let code = [];
	let containedModules = {};
	for (let i = 0; i < body.length; i++)
	{
		type = body[i].type;
	  	if (type === "used_module_define")
		{ 
			let module = body[i].UsedModule.value;
			let names;
			if (isModuleGoodtoUSE(modulehead, module, body[i].UsedModule.line, body[i].UsedModule.col))
			{
		  		names = body[i].names.map((e) => 
				{  
					if (containedModules.hasOwnProperty(e.value) || containedmds.hasOwnProperty(e.value))
					{
			  			ErrorExit(`module name "${e.value}" is used multiple times.+  at line: ${e.line}, col: ${e.col}.\n`);
			 			return 0;
					}
  
					containedModules[`${e.value}`] = {
						"inputs": definedModuleArray[module].inputs,
						"outputs": definedModuleArray[module].outputs
					}
					return e.value;
  
		  		});

			}///No need of else as isModuleGoodtoUSE take care of those
  
			code.push(`${module} ${names.join(",")};`);  
  
	  	} else if (type === "unnecessary")
		{

		}else
		{
			ErrorExit(`Undefined contain component"${type}" \n`);
		}
  
	}  
	return {
	  "containedModules": containedModules,
	  "code": code,
	};
}

function ErrorExit(message)
{
	console.error(`Error: ` + message);
	process.exit();
}
function Warn(message) {
	console.warn(`Warning: ` + message);
}
function getModuleWire(body, input_ports, output_ports, containedmds, decl_vars)
{
	//left side ports are input and right side inputs are outputs
  
	let inputDeclaration = [];
	let outputDeclaration = [];
  
  
	let moduleoutputTOmoduleinput = [];
	let moduleoutputTooutput = [];// uses reference
	let inputTOmoduleInput = [];
	let inputTooutput = []; // uses reference
  
  
	let declared_variables = [...decl_vars];
	let new_declared_vars = [];
  
  
	for (let i = 0; i < body.length; i++)
	{
		type = body[i].type;
	  	if (type === "wire_definition")
		{
			// first check left connection 
			if (body[i].left_connector.type === "connector")
			{
		  		if (input_ports.includes(body[i].left_connector.connector_name))
				{
					// for right connections
					if (body[i].right_connector.type === "connector")
					{
			  			if (output_ports.includes(body[i].right_connector.connector_name))
						{
							// r => q condition where both are ports of module, r - refpointer,q is pointer
							if (!declared_variables.includes(body[i].left_connector.connector_name))
							{
				  				inputDeclaration.push(`bool *${body[i].left_connector.connector_name};`);
				  				new_declared_vars.push(body[i].left_connector.connector_name);
				  				declared_variables.push(body[i].left_connector.connector_name);
							}
							if (!declared_variables.includes(body[i].right_connector.connector_name))
							{
				  				outputDeclaration.push(`bool*& ${body[i].right_connector.connector_name};`);
				  				new_declared_vars.push(body[i].right_connector.connector_name);
				  				declared_variables.push(body[i].right_connector.connector_name);
							}
							inputTooutput.push(`${body[i].right_connector.connector_name}(${body[i].left_connector.connector_name})`);
			  			} else
						{
							ErrorExit(`output port : ${body[i].right_connector.connector_name} not defined +  at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
			  			}
					} else
					{
						// right child connector
			  			if (containedmds.hasOwnProperty(body[i].right_connector.parent_name))
						{
							if (containedmds[body[i].right_connector.parent_name].inputs.includes(body[i].right_connector.connector_name))
							{
				  				// r => nand1.a;
				  				if (!declared_variables.includes(body[i].left_connector.connector_name))
								{
									inputDeclaration.push(`bool *${body[i].left_connector.connector_name};`);
									new_declared_vars.push(body[i].left_connector.connector_name);
									declared_variables.push(body[i].left_connector.connector_name);
				  				}
				  				// no need to declare module here.
  
				  				inputTOmoduleInput.push(`${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name} = ${body[i].left_connector.connector_name};`);
							} else
							{  
				  				ErrorExit(`Port : "${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name}" is not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
							}
			  			}else
						{
							ErrorExit(`Module : ${body[i].right_connector.parent_name} is not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
			  			}
  
					}
  
				}else
				{
					ErrorExit(`input port : ${body[i].left_connector.connector_name} not defined at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
		  		}
			}else
			{	//for left child connector
				if (containedmds.hasOwnProperty(body[i].left_connector.parent_name))
				{
					if (containedmds[body[i].left_connector.parent_name].outputs.includes(body[i].left_connector.connector_name))
					{  
						// for right connections
						if (body[i].right_connector.type === "connector")
						{
							if (output_ports.includes(body[i].right_connector.connector_name))
							{
								//nand.o => q;
								// no need of declaration for modules
								if (!declared_variables.includes(body[i].right_connector.connector_name))
								{
									outputDeclaration.push(`bool*& ${body[i].right_connector.connector_name};`);
									new_declared_vars.push(body[i].right_connector.connector_name);
									declared_variables.push(body[i].right_connector.connector_name);
								}  
								moduleoutputTooutput.push(`${body[i].right_connector.connector_name}(${body[i].left_connector.parent_name}.${body[i].left_connector.connector_name})`);

							}else
							{
								ErrorExit(`output port : ${body[i].right_connector.connector_name} not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
							}
						}else
						{
							// right child connector  
							if (containedmds.hasOwnProperty(body[i].right_connector.parent_name))
							{
								if (containedmds[body[i].right_connector.parent_name].inputs.includes(body[i].right_connector.connector_name))
								{
									// nand2.o => nand1.b;
				
									// no need to declare module here.
									// no need to declare module here.
									moduleoutputTOmoduleinput.push(`${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name} = ${body[i].left_connector.parent_name}.${body[i].left_connector.connector_name};`);
								}else
								{
									ErrorExit(`input port : "${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name}" does not exist. at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
								}
							}else
							{
								ErrorExit(`Module : ${body[i].right_connector.parent_name} not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
							}

						}

					}else
					{
						ErrorExit(`input port : "${body[i].left_connector.connector_name}.${body[i].left_connector.connector_name}" does not exist at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
					}
				}else
				{
					ErrorExit(`Module : ${body[i].left_connector.parent_name} not defined at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
				}
			}
		} else if (type === "unnecessary")
		{}else 
		{
			ErrorExit(`Undefined wire component"${type}" \n`);
		}
	}
  
  
	return {
	  "inputDeclaration": inputDeclaration,
	  "outputDeclaration": outputDeclaration,
	  "moduleoutputTOmoduleinput": moduleoutputTOmoduleinput,
	  "moduleoutputTooutput": moduleoutputTooutput,
	  "inputTOmoduleInput": inputTOmoduleInput,
	  "inputTooutput": inputTooutput,
	  "new_declared_vars": new_declared_vars
	};
}

function getModuleInit(body, output_ports, containedmds, decl_vars)
{
	let outputDeclaration = [];  
	let initilizations = [];  
  
	let declared_variables = [...decl_vars];
	let new_declared_vars = [];  
  
	for (let i = 0; i < body.length; i++) {
	  	type = body[i].type;
	  	if (type === "output_port_initilization") {
			// first check output port 
			if (body[i].output_port.type === "connector") {
		  		if (output_ports.includes(body[i].output_port.connector_name)) {  
					// for value
					if (body[i].value.value === "1" || body[i].value.value === "0") {
  
			  			if (!declared_variables.includes(body[i].output_port.connector_name)) {
							outputDeclaration.push(`bool*& ${body[i].output_port.connector_name};`);
							new_declared_vars.push(body[i].output_port.connector_name);
							declared_variables.push(body[i].output_port.connector_name);
			  			}  
			  			initilizations.push(`*${body[i].output_port.connector_name} = ${body[i].value.value};`);
  
					} else {
			  			ErrorExit(`initilized value for: ${body[i].output_port.connector_name} should be 1 or 0 at line: ${body[i].output_port.line}, col: ${body[i].output_port.col}.\n`);
					}
		  		} else {
					ErrorExit(`output port : ${body[i].output_port.connector_name} not defined or is an Input port ( not allowed ) at line: ${body[i].output_port.line}, col: ${body[i].output_port.col}.\n`);
		  		}
			} else {//for output child connector
		  		if (containedmds.hasOwnProperty(body[i].output_port.parent_name)) {
					if (containedmds[body[i].output_port.parent_name].outputs.includes(body[i].output_port.connector_name)) {
			  			// for value
			  			if (body[i].value.value === "1" || body[i].value.value === "0") {  
							initilizations.push(`*${body[i].output_port.parent_name}.${body[i].output_port.connector_name} = ${body[i].value.value};`);
  
			  			} else {
							ErrorExit(`initilized value for: ${body[i].output_port.parent_name}.${body[i].output_port.connector_name} should be 1 or 0 at line: ${body[i].output_port.line}, col: ${body[i].output_port.col}.\n`);
			  			}  
					} else {
			  			ErrorExit(`output port : "${body[i].output_port.parent_name}.${body[i].output_port.connector_name}" does not exist at line: ${body[i].output_port.line}, col: ${body[i].output_port.col}.\n`);
					}
		 		} else {
					ErrorExit(`Module : ${body[i].output_port.parent_name} not defined at line: ${body[i].output_port.line}, col: ${body[i].output_port.col}.\n`);
		  		}
			}
	  	} else if (type === "unnecessary") {
	  	} else {
			ErrorExit(`Undefined init component"${type}" \n`);
	  	}
  
	}  
  
	return {
	  "outputDeclaration": outputDeclaration,
	  "initilizations": initilizations,
	  "new_declared_vars": new_declared_vars
	};
  
}

function getModuleProcess(body, containedmds) {

	let prs = [];
	let wireOrder = [];
  
	for (let i = 0; i < body.length; i++) {
	  type = body[i].type;  
	  if (type === "process_element") {
		// first check if port is defined
		if (containedmds.hasOwnProperty(body[i].module_name.value)) {
		  prs.push(`${body[i].module_name.value}.process();`);
		  wireOrder.push(`${body[i].module_name.value}.wire();`);
		} else {
		  ErrorExit(`Module : ${body[i].module_name.value} not defined at line: ${body[i].module_name.line}, col: ${body[i].module_name.col}.\n`);
		}
	  } else if (type === "unnecessary") {
	  } else {
		ErrorExit(`Undefined process component"${type}" \n`);
	  }
  
	}
	return {
	  "process": prs,
	  "wireOrder": wireOrder
	};
  
}

function AddtoDefinedModuleArray(name, outputs, inputs, l, c) {
	if (!isModuleDefined(name)) {
		definedModuleArray[name] = {
	  		"outputs": outputs,
	  		"inputs": inputs
		};
	
	}
	/*if (isModuleDefined(name)) {
	  ErrorExit(`Module with name "${name}" is alread defined at line: ${l}, col: ${c}.\n`);
	}
  
	definedModuleArray[name] = {
	  "outputs": outputs,
	  "inputs": inputs
	};*/
}

function getWorkSpaceContain(body, containedmds) {
	let code = [];
	let containedModules = {};
	for (let i = 0; i < body.length; i++) {
	  type = body[i].type;
	  if (type === "ws_used_module_define") {
		let module = body[i].ws_UsedModule.value;
		let defs;
  
		if (isModuleGoodtoUSE("workspace", module, body[i].ws_UsedModule.line, body[i].ws_UsedModule.col)) {
		  defs = body[i].names.map((e) => {
			if (containedModules.hasOwnProperty(e.value) || containedmds.hasOwnProperty(e.value)) {
			  ErrorExit(`module name "${e.value}" is used multiple times at line: ${e.line}, col: ${e.col}.\n`);
			  return 0;
			}
			containedModules[`${e.value}`] = {
			  "inputs": definedModuleArray[module].inputs,
			  "outputs": definedModuleArray[module].outputs
			}
			return `${module} ${e.value} = ${module}();`;
  
		  });
		}///No need of else as isModuleGoodtoUSE take care of those
  
		code.push(`${defs.join("\n\t")}`);
  
	  } else if (type === "unnecessary") {
	  } else {
		ErrorExit(`Undefined workspace contain component"${type}" \n`);
	  }
  
	}
  
  
	return {
	  "containedModules": containedModules,
	  "code": code,
	};
  
  
}

function getWorkSpaceWire(body, input_ports, output_ports, containedmds, decl_vars) {
	//left side ports are input and right side inputs are outputs
  
	let inputDeclaration = [];
	let outputDeclaration = [];
  
  
	let moduleoutputTOmoduleinput = [];
	let moduleoutputTooutput = [];// uses reference
	let inputTOmoduleInput = [];
	let inputTooutput = []; // uses reference
  
  
	let declared_variables = [...decl_vars];
	let new_declared_vars = [];
  
  
	for (let i = 0; i < body.length; i++) {
	  type = body[i].type;
	  if (type === "ws_wire_definition") {
		// first check left connection 
		if (body[i].left_connector.type === "ws_connector") {
		  if (input_ports.includes(body[i].left_connector.connector_name)) {
  
			// for right connections
			if (body[i].right_connector.type === "ws_connector") {
			  if (output_ports.includes(body[i].right_connector.connector_name)) {
				// S => O condition where both are ports of workspace, r - refpointer,q is pointer
				if (!declared_variables.includes(body[i].left_connector.connector_name)) {
				  inputDeclaration.push(`bool ${body[i].left_connector.connector_name};`);
				  new_declared_vars.push(body[i].left_connector.connector_name);
				  declared_variables.push(body[i].left_connector.connector_name);
				}
				if (!declared_variables.includes(body[i].right_connector.connector_name)) {
				  outputDeclaration.push(`bool *${body[i].right_connector.connector_name};`);
				  new_declared_vars.push(body[i].right_connector.connector_name);
				  declared_variables.push(body[i].right_connector.connector_name);
				}
				inputTooutput.push(`${body[i].right_connector.connector_name} = &${body[i].left_connector.connector_name};`);
			  } else {
				ErrorExit(`output port : ${body[i].right_connector.connector_name} not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
			  }
			} else {// right child connector
  
			  if (containedmds.hasOwnProperty(body[i].right_connector.parent_name)) {
				if (containedmds[body[i].right_connector.parent_name].inputs.includes(body[i].right_connector.connector_name)) {
				  // r => nand1.a; ip to mip
				  if (!declared_variables.includes(body[i].left_connector.connector_name)) {
					inputDeclaration.push(`bool ${body[i].left_connector.connector_name};`);
					new_declared_vars.push(body[i].left_connector.connector_name);
					declared_variables.push(body[i].left_connector.connector_name);
				  }
				  // no need to declare module here.
  
				  inputTOmoduleInput.push(`${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name} = &${body[i].left_connector.connector_name};`);
				} else {
  
				  ErrorExit(`Module input port : "${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name}" is not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
				}
			  } else {
				ErrorExit(`Module : ${body[i].right_connector.parent_name} is not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
			  }
  
			}
  
		  } else {
			ErrorExit(`input port : ${body[i].left_connector.connector_name} not defined at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
		  }
		} else {//for left child connector
		  if (containedmds.hasOwnProperty(body[i].left_connector.parent_name)) {
			if (containedmds[body[i].left_connector.parent_name].outputs.includes(body[i].left_connector.connector_name)) {
  
			  // for right connections
			  if (body[i].right_connector.type === "ws_connector") {
				if (output_ports.includes(body[i].right_connector.connector_name)) {
				  //nand.o => q; mop to op
				  // no need of declaration for modules
				  if (!declared_variables.includes(body[i].right_connector.connector_name)) {
					outputDeclaration.push(`bool *${body[i].right_connector.connector_name};`);
					new_declared_vars.push(body[i].right_connector.connector_name);
					declared_variables.push(body[i].right_connector.connector_name);
				  }
  
				  moduleoutputTooutput.push(`${body[i].right_connector.connector_name} = ${body[i].left_connector.parent_name}.${body[i].left_connector.connector_name};`);
  
				} else {
				  ErrorExit(`output port : ${body[i].right_connector.connector_name} not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
				}
			  } else {// right child connector
  
				if (containedmds.hasOwnProperty(body[i].right_connector.parent_name)) {
				  if (containedmds[body[i].right_connector.parent_name].inputs.includes(body[i].right_connector.connector_name)) {
					// nand2.o => nand1.b;
  
					// no need to declare module here.
					// no need to declare module here.
					moduleoutputTOmoduleinput.push(`${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name} = ${body[i].left_connector.parent_name}.${body[i].left_connector.connector_name};`);
				  } else {
					ErrorExit(`Module input port : "${body[i].right_connector.parent_name}.${body[i].right_connector.connector_name}" does not exist at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
				  }
				} else {
				  ErrorExit(`Module : ${body[i].right_connector.parent_name} not defined at line: ${body[i].right_connector.line}, col: ${body[i].right_connector.col}.\n`);
				}
  
			  }
  
			} else {
			  ErrorExit(`input port : "${body[i].left_connector.connector_name}.${body[i].left_connector.connector_name}" does not exist at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
			}
		  } else {
			ErrorExit(`Module : ${body[i].left_connector.parent_name} not defined at line: ${body[i].left_connector.line}, col: ${body[i].left_connector.col}.\n`);
		  }
		}
	  } else if (type === "unnecessary") {
	  } else {
		ErrorExit(`Undefined wire component"${type}" \n`);
	  }
  
	}
  
  
	return {
	  "inputDeclaration": inputDeclaration,
	  "outputDeclaration": outputDeclaration,
	  "moduleoutputTOmoduleinput": moduleoutputTOmoduleinput,
	  "moduleoutputTooutput": moduleoutputTooutput,
	  "inputTOmoduleInput": inputTOmoduleInput,
	  "inputTooutput": inputTooutput,
	  "new_declared_vars": new_declared_vars
	};
}

function getWorkSpaceInit(body, input_ports, containedmds, decl_vars) {

	let inputDeclaration = [];
  
	let initilizations = [];
  
	let upp_init = ``;
  
  
	let declared_variables = [...decl_vars];
	let new_declared_vars = [];
  
  
	for (let i = 0; i < body.length; i++) {
	  type = body[i].type;
	  if (type === "ws_port_initilization") {
		// first check input port 
		if (body[i].port.type === "ws_connector") {
		  if (input_ports.includes(body[i].port.connector_name)) {
  
			// for value
			if (body[i].value.value === "1" || body[i].value.value === "0") {
  
			  if (!declared_variables.includes(body[i].port.connector_name)) {
				inputDeclaration.push(`bool ${body[i].port.connector_name};`);
				new_declared_vars.push(body[i].port.connector_name);
				declared_variables.push(body[i].port.connector_name);
			  }
  
			  initilizations.push(`${body[i].port.connector_name} = ${body[i].value.value};`);
  
			} else {
			  ErrorExit(`initilized value for: ${body[i].port.connector_name} should be 1 or 0 at line: ${body[i].port.line}, col: ${body[i].port.col}.\n`);
			}
  
  
		  } else {
			ErrorExit(`Input port : ${body[i].port.connector_name} not defined or is an output port ( not allowed ) at line: ${body[i].port.line}, col: ${body[i].port.col}.\n`);
		  }
		} else {//for output child connector
		  if (containedmds.hasOwnProperty(body[i].port.parent_name)) {
			if (containedmds[body[i].port.parent_name].outputs.includes(body[i].port.connector_name)) {
			  // for value
			  if (body[i].value.value === "1" || body[i].value.value === "0") {
  
				initilizations.push(`*${body[i].port.parent_name}.${body[i].port.connector_name} = ${body[i].value.value};`);
  
			  } else {
				ErrorExit(`initilized value for: ${body[i].port.parent_name}.${body[i].port.connector_name} should be 1 or 0 at line: ${body[i].port.line}, col: ${body[i].port.col}.\n`);
			  }
  
  
			} else {
			  ErrorExit(`Module output port : "${body[i].port.parent_name}.${body[i].port.connector_name}" does not exist or is a input port at line: ${body[i].port.line}, col: ${body[i].port.col}.\n`);
			}
		  } else {
			ErrorExit(`Module : ${body[i].port.parent_name} not defined at line: ${body[i].port.line}, col: ${body[i].port.col}.\n`);
		  }
		}
	  } else if (type === "ws_upp_init") {
  
		upp_init = `upp = ${body[i].value.value};`
  
	  } else if (type === "unnecessary") {
	  } else {
		ErrorExit(`Undefined workspace init component"${type}" \n`);
	  }
  
	}
  
  
	return {
	  "inputDeclaration": inputDeclaration,
	  "initilizations": initilizations,
	  "new_declared_vars": new_declared_vars,
	  "upp_init": upp_init
	};
  
}

function getWorkSpaceProcess(body, containedmds) {

	let prs = [];
	let wireOrder = [];
  
	for (let i = 0; i < body.length; i++) {
	  type = body[i].type;
  
	  if (type === "ws_process_element") {
		// first check if port is defined
		if (containedmds.hasOwnProperty(body[i].module_name.value)) {
		  prs.push(`${body[i].module_name.value}.process();`);
		  wireOrder.push(`${body[i].module_name.value}.wire();`);
		} else {
		  ErrorExit(`Module : ${body[i].module_name.value} not defined at line: ${body[i].module_name.line}, col: ${body[i].module_name.col}.\n`);
		}
	  } else if (type === "unnecessary") {
	  } else {
		ErrorExit(`Undefined process component"${type}" \n`);
	  }
  
	}
	return {
	  "process": prs,
	  "wireOrder": wireOrder
	};
  
  }


async function getComponent(component,workingDir,componentName)
{
	
	if (component.type === "module_creation")
	{
	  	const ModuleName 	= component.module_name.value;
	  	const InputPortList = getModulePortList(component.input_portlist);
	  	const OutputPortList = getModulePortList(component.output_portlist);
  
	  	const ModuleBody = component.module_body;
  
		let containedModules = {};
		let declaredVariables = [];
  
		let contains = [];
		let init = [];
		let process = [];
		let wire_order = [];
  
  
		let inputDeclaration;
		let outputDeclaration;
		let moduleoutputTOmoduleinput;
		let moduleoutputTooutput;// uses reference
		let inputTOmoduleInput;
		let inputTooutput;// uses reference
  
  
	  	for (let i = 0; i < ModuleBody.length; i++)
		{
			const type = ModuleBody[i].type;  
			if (type === "contains_creation")
			{
		  		const t = getModuleContain(ModuleName, ModuleBody[i].contains_body, containedModules);
		  		containedModules = Object.assign(containedModules, t.containedModules);
		  		contains = t.code;
			} else if (type === "wire_creation")
			{  
		  		const t = getModuleWire(ModuleBody[i].wire_body, InputPortList, OutputPortList, containedModules, declaredVariables);
  
		  		inputDeclaration = t.inputDeclaration;
		  		outputDeclaration = t.outputDeclaration;
		  		moduleoutputTOmoduleinput = t.moduleoutputTOmoduleinput;
		  		moduleoutputTooutput = t.moduleoutputTooutput;
		  		inputTOmoduleInput = t.inputTOmoduleInput;
		  		inputTooutput = t.inputTooutput;
		  		declaredVariables.push(...t.new_declared_vars);
  
			}else if (type === "init_creation")
			{
		  		const t = getModuleInit(ModuleBody[i].init_body, OutputPortList, containedModules, declaredVariables);
		  		outputDeclaration.push(...t.outputDeclaration);
		  		init.push(...t.initilizations);
		  		declaredVariables.push(...t.new_declared_vars);
			}else if (type === "process_creation")
			{
		  		const t = getModuleProcess(ModuleBody[i].process_body, containedModules);
		  		process = t.process;
		  		wire_order = t.wireOrder;  
			} else if (type === "unnecessary") {
			} else {
				ErrorExit(`Unrecoganized module component: ${type}`);
			}
	  	}  
  
	  	let FullCode = `class ${ModuleName}
  {
	public:
	//modules
	${contains.join("\n")}
	//output
	${outputDeclaration.join("\n  ")}
	//input
	${inputDeclaration.join("\n  ")}
	//constructor():m_o/p to o/p, i/p to o/p
	${ModuleName}():${(moduleoutputTooutput.concat(inputTooutput)).join(",")}
	{
	\t${init.join("\n\t")}
	}
	//wire method
	void wire()
	{  
	\t// i/p to m_i/p 
	\t${inputTOmoduleInput.join("\n\t")}
	\t// m_o/p to m_i/p
	\t${moduleoutputTOmoduleinput.join("\n\t")}
	\t// wire fun call
	\t${wire_order.join("\n\t")}     
	}
	//process
	void process()
	{
	\t${process.join("\n\t")}
	}
  };`
  
  
	  AddtoDefinedModuleArray(ModuleName, OutputPortList, InputPortList, component.module_name.line, component.module_name.col); 
	  return FullCode;

	} else if (component.type === "include") {
	  const filename = component.file.value;
	  let t = await getInclude(filename,workingDir,componentName);
	  if(!includestatements.includes(t))
	  {
		includestatements.push(t);
	  }
	  
	  return ``;
	} else if (component.type === "workspace_creation") {
  
	  if (worksapce_defined) {
		ErrorExit(`Multiple workspace definition found at line: ${component.line}, col: ${component.col}.\n`)
	  }  
	  worksapce_defined = true;  
  
	  const InputPortList = getModulePortList(component.input_portlist);
	  const OutputPortList = getModulePortList(component.output_portlist);
  
	  const WorkspaceBody = component.workspace_body;
  
	  let containedModules = {};
	  let declaredVariables = [];
  
	  let contains = [];
	  let init = [];
	  let process = [];
	  let wire_order = [];
	  let upp_init = [];
  
	  let inputDeclaration;
	  let outputDeclaration;
	  let moduleoutputTOmoduleinput;
	  let moduleoutputTooutput;// uses reference
	  let inputTOmoduleInput;
	  let inputTooutput;// uses reference
  
  
  
	  for (let i = 0; i < WorkspaceBody.length; i++) {
		const type = WorkspaceBody[i].type;
  
		if (type === "ws_contains_creation") {
		  const t = getWorkSpaceContain(WorkspaceBody[i].ws_contains_body, containedModules);
		  containedModules = Object.assign(containedModules, t.containedModules);
		  contains = t.code;
		} else if (type === "ws_wire_creation") {
  
		  const t = getWorkSpaceWire(WorkspaceBody[i].ws_wire_body, InputPortList, OutputPortList, containedModules, declaredVariables);
  
		  inputDeclaration = t.inputDeclaration;
		  outputDeclaration = t.outputDeclaration;
		  moduleoutputTOmoduleinput = t.moduleoutputTOmoduleinput;
		  moduleoutputTooutput = t.moduleoutputTooutput;
		  inputTOmoduleInput = t.inputTOmoduleInput;
		  inputTooutput = t.inputTooutput;
		  declaredVariables.push(...t.new_declared_vars);
  
		} else if (type === "ws_init_creation") {
		  const t = getWorkSpaceInit(WorkspaceBody[i].init_body, InputPortList, containedModules, declaredVariables);
		  inputDeclaration.push(...t.inputDeclaration);
		  init.push(...t.initilizations);
		  declaredVariables.push(...t.new_declared_vars);
		  upp_init.push(t.upp_init);
  
		} else if (type === "ws_process_creation") {
		  const t = getWorkSpaceProcess(WorkspaceBody[i].process_body, containedModules);
		  process = t.process;
		  wire_order = t.wireOrder;
  
		} else if (type === "unnecessary") {
		} else {
		  ErrorExit(`Unrecoganized module component: ${type}`);
		}
	  }
  
	  let fileNameWithOutExt = componentName;
	  let JoinedPortList = InputPortList.concat(OutputPortList);
  
	  let FullCode = `int main(int argc,char** argv)
  {  
	//contained modules
	\t${contains.join("\n\t")}
	\t//input
	\t${inputDeclaration.join("\n\t")}
	\t//output
	\t${outputDeclaration.join("\n\t")}
	
	\t// WIRE
	\t// i/p to o/p 
	\t${inputTooutput.join("\n\t")}
  
	\t// i/p to m_i/p 
	\t${inputTOmoduleInput.join("\n\t")}
  
	\t// m_o/p to m_i/p
	\t${moduleoutputTOmoduleinput.join("\n\t")}
  
	\t// m_o/p to o/p
	\t${moduleoutputTooutput.join("\n\t")}
  
	\t// wire fun call
	\t${wire_order.join("\n\t")}
  
	\t//INIT
	\t${init.join("\n\t")} 
  
  
	int argumentnumber = 1;
	string MODE = "u";
	int inpNo = ${InputPortList.length};
	int OutNo = ${OutputPortList.length};
	bool outfiledefined = 0;
	int inp[inpNo];
	string inputfilename="${fileNameWithOutExt}_input.csv";
	string outputfilename = "${fileNameWithOutExt}_output.csv";
	string totaltime = "";
	string interval = "";
	string printprocess = "n";
	string filename="${fileNameWithOutExt}";
	
	while(argumentnumber<argc)
	{   
		
		if(string(argv[argumentnumber])=="-m"){
			argumentnumber++;
			if(argumentnumber<argc)
			{
				MODE = string(argv[argumentnumber]);  
				argumentnumber++;    
			}else{
				cout<<"Input Error: value not provided for mode flag\\n";
				return 0;
			}
			
		}else if(string(argv[argumentnumber])=="-upp")
		{   argumentnumber++;
			if(argumentnumber<argc)
			{
				upp = StrToNum(string(argv[argumentnumber]));  
				argumentnumber++;    
			}else{
				cout<<"Input Error: value not provided for upp flag.\\n";
				return 0;
			}
  
		}else if(string(argv[argumentnumber])=="-i")
		{   
			argumentnumber++;        
			if(argc-argumentnumber>=inpNo)
			{   int i = 0;
				while(i<inpNo)
				{   
					inp[i] = StrToNum(string(argv[argumentnumber]));
					i++;
					argumentnumber++;
				}                      
			}else{
				cout<<"Input Error: Number of inputs doesn't match with workspace inputs.\\n";
				return 0;
			}
  
		}else if(string(argv[argumentnumber])=="-f")
		{   
			argumentnumber++; 
			if(argumentnumber<argc)
			{
				inputfilename = string(argv[argumentnumber]);  
				argumentnumber++;    
			}else{
				cout<<"Input Error: Input csv file name not provided for input file flag.\\n";
				return 0;
			}          
  
		}else if(string(argv[argumentnumber])=="-p")
		{   
			argumentnumber++;        
			if(argumentnumber<argc)
			{   
				printprocess = string(argv[argumentnumber]);
				argumentnumber++;    
			}else{
				cout<<"Input Error: Value not provided for print process flag.\\n ";
				return 0;
			}
  
		}
		else if(string(argv[argumentnumber])=="-o")
		{   
			argumentnumber++; 
			if(argumentnumber<argc)
			{   
				outputfilename = string(argv[argumentnumber]);
				outfiledefined = 1;
				argumentnumber++;    
			}else{
				cout<<"Input Error: Value not provided for output csv file flag.\\n";
				return 0;
			}          
  
		}else{
			argumentnumber++;
		}
		
	}
  
  if(MODE == "d")
  {
	\t${InputPortList.map((e, i) => {
		return `${e}= inp[${i}]`
	  }).join(";\n\t")}; 
  
	  cout<<"current state:"${OutputPortList.map((e) => {
		return `<<"\\t ${e} : "<<*${e}`
	  }).join("")}<<"\\n";
	
	while(upp>0)
	{   
	\t${process.join("\n\t")}
	  upp--;
	}
	cout${InputPortList.map((e, i) => {
		if (i == 0) {
		  return `<<"${e}: "<<${e}`
		}
		return `<<"\\t ${e}: "<<${e}`
	  }).join("")}${OutputPortList.map(e => {
		return `<<"\\t ${e}: "<<*${e}`
	  }).join("")}<<"\\n";
	
  }else if(MODE == "i")
  {
	cout<<"processing at upp = "<<upp<<". Ctrl + c to exit.\\n${InputPortList.map(e => {
		return `${e}\\t`
	  }).join("")}${OutputPortList.map(e => {
		return `${e}\\t`
	  }).join("")}\\n";
	
	cout${InputPortList.map(e => {
		return `<<${e}<<"\\t"`
	  }).join("")}${OutputPortList.map(e => {
		return `<<*${e}<<"\\t"`
	  }).join("")}<<"\\n";
	  
	
	int ttt = 0;
	 while(1)
	 { 
	  ${InputPortList.map(e => {
		return `cin>>${e};`
	  }).join("\n\t")}
  
		ttt = 0;
		while(ttt < upp)
		{        
		\t${process.join("\n\t\t")} 
		  ttt++;      
		}     
	 
		cout<<"\\33[A"<<"\\33[2K";
  ;
	  
		cout${InputPortList.map(e => {
		return `<<${e}<<"\\t"`
	  }).join("")}${OutputPortList.map(e => {
		return `<<*${e}<<"\\t"`
	  }).join("")}<<"\\n";  
  
	 }
  
  }else if(MODE == "f")
  {
	int inpsNo = 0;
	ifstream inputcsv;
	ofstream outputcsv;    
	inputcsv.open(inputfilename);
	if(!inputcsv.good())
	{
		cout<<"Input File Error: unable to read input file. make sure provided file exists or valid filename is given.\\n";
		return 0;
	}
  
	while(inputcsv.good())
	{
		string type;
		string value;
		getline(inputcsv,type,':');
		getline(inputcsv,value,'\\n');
		if(type == "output_file_name")
		{
			if(!outfiledefined){
			  outputfilename = value;
			}
			
		}else if (type=="name")
		{
		  filename =  value;
		}else if (type=="upp")
		{
			upp = StrToNum(value);
		}else if (type=="totaltime")
		{
			totaltime = value;
		}else if (type=="interval")
		{
			interval = value;
		}else if (type=="end")
		{    
			inpsNo = StrToNum(value);
			if(!(inpsNo==inpNo))
			{
				cout<<"Input File Error: Number of inputs in the csv file doesn't match with workspace inputs.\\n";
				return 0;
			}   
			break;
		}else{
			cout<<"Input File Error: Input file is poorly formatted.\\n";
			return 0;
		}
  
	}
	outputcsv.open(outputfilename);
	outputcsv<<"name:"<<filename<<endl;
	outputcsv<<"output_file_name:"<<outputfilename<<endl;
	outputcsv<<"upp:"<<upp<<endl;
	outputcsv<<"totaltime:"<<totaltime<<endl;
	outputcsv<<"interval:"<<interval<<endl;
	outputcsv<<"end:"<<inpsNo<<endl;
  
	string tempstringval = "";
	int ttt;
	cout<<"processing at upp = "<<upp<<"\\n";
	if(printprocess=="y")
	{
	  cout<<"\\n${InputPortList.map(e => {
		return `${e}\\t`
	  }).join("")}${OutputPortList.map(e => {
		return `${e}\\t`
	  }).join("")}\\n";
	}
	while(inputcsv.good())
	{   
	  ${InputPortList.map((e, i) => {
		if (i == InputPortList.length - 1) {
		  return `getline(inputcsv,tempstringval,'\\n');\n\t${e} = StrToNum(tempstringval);`
		}
		return `getline(inputcsv,tempstringval,',');\n\t${e} = StrToNum(tempstringval);`
	  }).join("\n\t")
		}
		ttt = 0;
		while(ttt < upp)
		{
		  ${process.join("\n\t\t")}
		  ttt++;
		}
		outputcsv${InputPortList.map((e, i) => {
		  if (i == InputPortList.length - 1) {
			return `<<${e}<<","`
		  }
		  return `<<${e}`
		}).join(`<<","`)}${OutputPortList.map(e => {
		  return `<<*${e}`
		}).join(`<<","`)}<<endl;
		if(printprocess=="y")
		{   
			cout${InputPortList.map((e, i) => {
		  if (i == InputPortList.length - 1) {
			return `<<${e}<<"\\t"`
		  }
		  return `<<${e}`
		}).join(`<<"\\t"`)}${OutputPortList.map(e => {
		  return `<<*${e}`
		}).join(`<<"\\t"`)}<<"\\n"; 
		}    
	}  
	outputcsv.close();
	inputcsv.close();
  }else{
	cout<<"Input Error: Mode not provided or undefined value is given.\\n";
	return 0;
  }
  };`
  
  
	  return FullCode;
	} else if (component.type === "unnecessary") {
	  return ``;
	} else {
	  ErrorExit(`Unrecoganized component of type: ${component.type} `);
	}
  }



module.exports = {transpileFromLC,transpileFromJSON,genMakeFile}
