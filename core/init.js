const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

let initialWorkspaceFile = `
include("stdcomp/stdcomp");

workspace([]=>[])
{
    contains{

    }
    wire{

    }
    init{
    
    }
    process{

    }
}
`

function constrain_ask(qn,answers,deflt=null)
{    
    let ans = null;
    while(1)
    {
        ans = prompt(qn);
        if(answers.includes(ans))
        {
            break;
        }        
        if(ans.length==0 && deflt !=null)
        {
           ans = deflt; 
           break;
        }
    }
    return ans;
      
}

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function copyStdlib(toLocation)
{
    
    copyFolderRecursiveSync(path.join(__dirname,'..','userLibs','stdcomp'),toLocation)


}

var init = function(dir,projectName)
{   
    if(projectName != undefined)
    {
        let prjDir = path.join(dir,projectName);
        let genDir = path.join(prjDir,'gen')
        let libDir = path.join(genDir,'lib');
        let buildDir = path.join(genDir,'build')
        let tmpDir = path.join(genDir,'tmp');
        let configDir = path.join(genDir,'config');

        if (!fs.existsSync(prjDir)){

            // create project dir
            fs.mkdirSync(prjDir);
            // create gen dir
            fs.mkdirSync(genDir);
            // create lib dir
            fs.mkdirSync(libDir);
            // create build dir
            fs.mkdirSync(buildDir);
            // create tmp dir
            fs.mkdirSync(tmpDir);
            // create config dir
            fs.mkdirSync(configDir);
                    
            // create and write project config
            let config = {
                "name":projectName,
                "description":"",
                "scripts":{
                    "g++":"g++ ${filename}"
                },
                "installedLib":[]
            }

            fs.writeFileSync(path.join(prjDir,'config.json'), JSON.stringify(config,null,4), 'utf8');
            fs.writeFileSync(path.join(prjDir,'workspace.lc'), initialWorkspaceFile, 'utf8');

            // install stdlib
            an = constrain_ask("Install stdcomp(c++ sim) library (default yes)? [ yes/no ]:",['yes','no'],'yes');
            if(an=="yes")
            {
                copyStdlib(libDir);
                config.installedLib.push(
                    {
                        "name":"stdcomp",
                        "location":path.join('stdcomp','stdcomp')
                    })
                fs.writeFileSync(path.join(prjDir,'config.json'), JSON.stringify(config,null,4), 'utf8');                
            }

            console.log(`
Successfully created project  ${projectName} .

---------------------------------------------

Thanks for trying out logic code. keep in mind logic code is still in not stable and might have bugs.

For docs go to https://sachindas246.github.io/logic-code-docs/

To get started :
cd ${projectName}
`)
        }else{
            console.error(`Error: Dir \" ${projectName} \" already in exist in ${dir}.`)
        }
    }else{
        console.error("Error: Cannot init a project without \"Project Name\"")
    }
   
}


module.exports = {init}