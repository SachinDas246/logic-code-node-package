#!/usr/bin/env node
const path = require('path');
var init = require('../core/init')
var Ctrans =  require('../ctrans/cppTranspiler')
const parser = require('../core/lang/parse')

async function main() {

    nodePath  = process.argv[0];
    parameters = process.argv.slice(2);
    index = 0;

    // defined to prevent error due to redeclare
    let inputFile=undefined;


    while(index < parameters.length){
        word = parameters[index];
        switch(word){
            case "init":
                init.init(process.cwd(),parameters[index+1])
                index = parameters.length;
                break;
                return 0;

            case "parse":
                inputFile = parameters[index+1]
                if(inputFile == undefined){
                    console.error("Input file cannot be empty")
                    index = parameters.length;
                    break;
                }                
                let outputFile = path.join(process.cwd(),inputFile.replace(/^.*[\\\/]/,'').replace('.lc','.json'))
                if(parameters[index+2] == '-o'){
                    outputFile = parameters[index+3]
                    if(outputFile == undefined){
                        console.error("Output file cannot be empty")
                        index = parameters.length;
                        break;
                    }
                }
                parser.parse(inputFile,outputFile)                
                index = parameters.length;
            break;

            case "remake":
                await Ctrans.genMakeFile(process.cwd())                
                index = parameters.length;
                break

            case "-j":
                inputFile = parameters[index+1];
                Ctrans.transpileFromJSON(inputFile,process.cwd());
                index = parameters.length;
                break;
            

            
            
            default:
                Ctrans.transpileFromLC(word,process.cwd());
                index = parameters.length;
                return 0;
                break;

        }
    }



}

main().catch((err) => console.log(err.stack));
