// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
//digital v 0.01
(function () {
function id(x) { return x[0]; }

const digitallexer = require("./lexer");
var grammar = {
    Lexer: digitallexer,
    ParserRules: [
    {"name": "components$ebnf$1$subexpression$1", "symbols": ["component"]},
    {"name": "components$ebnf$1", "symbols": ["components$ebnf$1$subexpression$1"]},
    {"name": "components$ebnf$1$subexpression$2", "symbols": ["component"]},
    {"name": "components$ebnf$1", "symbols": ["components$ebnf$1", "components$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "components", "symbols": ["components$ebnf$1"], "postprocess": 
        (data) =>{
            const repeatedPieces = data[0];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "component", "symbols": ["preprocessor"], "postprocess": id},
    {"name": "component", "symbols": ["module"], "postprocess": id},
    {"name": "component", "symbols": ["workspace"], "postprocess": id},
    {"name": "component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "workspace$ebnf$1$subexpression$1", "symbols": [(digitallexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "workspace$ebnf$1", "symbols": ["workspace$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "workspace$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "workspace", "symbols": [{"literal":"workspace"}, "_", {"literal":"("}, "_", "workspace_port_list", "_", (digitallexer.has("fatarrow") ? {type: "fatarrow"} : fatarrow), "_", "workspace_port_list", "_", {"literal":")"}, "_", "workspace$ebnf$1", "_", "workspace_body"], "postprocess": 
        (data)=>{
            return {
                type: "workspace_creation",
                line:data[0].line,
                col:data[0].col,
                input_portlist: data[4],
                output_portlist: data[8],
                workspace_body: data[14]
            }
        }
            },
    {"name": "workspace_port_list", "symbols": [(digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace)], "postprocess": 
        (data)=>{
            return [];
        }
            },
    {"name": "workspace_port_list$ebnf$1", "symbols": []},
    {"name": "workspace_port_list$ebnf$1$subexpression$1", "symbols": ["_", (digitallexer.has("comma") ? {type: "comma"} : comma), "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "_"]},
    {"name": "workspace_port_list$ebnf$1", "symbols": ["workspace_port_list$ebnf$1", "workspace_port_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "workspace_port_list", "symbols": [(digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "workspace_port_list$ebnf$1", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace)], "postprocess": 
        (data) =>{
            const repeatedPieces = data[3];
            const restParams = repeatedPieces.map(piece => piece[3]);
            return [data[2], ...restParams];
        }
            },
    {"name": "workspace_body$ebnf$1", "symbols": []},
    {"name": "workspace_body$ebnf$1$subexpression$1", "symbols": ["workspace_component"]},
    {"name": "workspace_body$ebnf$1", "symbols": ["workspace_body$ebnf$1", "workspace_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "workspace_body", "symbols": [{"literal":"{"}, "workspace_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data)=>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "workspace_component", "symbols": ["ws_contains"], "postprocess": id},
    {"name": "workspace_component", "symbols": ["ws_wire"], "postprocess": id},
    {"name": "workspace_component", "symbols": ["ws_init"], "postprocess": id},
    {"name": "workspace_component", "symbols": ["ws_process"], "postprocess": id},
    {"name": "workspace_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "ws_contains$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "ws_contains$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ws_contains", "symbols": ["_", {"literal":"contains"}, "ws_contains$ebnf$1", "ws_contains_body"], "postprocess": 
        (data)=>{
            return {
                type: "ws_contains_creation",                
                ws_contains_body: data[3]
            }
        }
            },
    {"name": "ws_contains_body$ebnf$1", "symbols": []},
    {"name": "ws_contains_body$ebnf$1$subexpression$1", "symbols": ["ws_contains_component"]},
    {"name": "ws_contains_body$ebnf$1", "symbols": ["ws_contains_body$ebnf$1", "ws_contains_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws_contains_body", "symbols": [{"literal":"{"}, "ws_contains_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "ws_contains_component", "symbols": ["ws_used_module_define"], "postprocess": id},
    {"name": "ws_contains_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "ws_used_module_define$ebnf$1", "symbols": []},
    {"name": "ws_used_module_define$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "ws_used_module_define$ebnf$1", "symbols": ["ws_used_module_define$ebnf$1", "ws_used_module_define$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws_used_module_define", "symbols": ["_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "__", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "ws_used_module_define$ebnf$1", "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            const repeatedPieces = data[4];
            const restParams = repeatedPieces.map(piece => piece[3]);
            return {
                type: "ws_used_module_define",
                ws_UsedModule: data[1],
                names: [data[3],...restParams]
            } 
        }
            },
    {"name": "ws_wire$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "ws_wire$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ws_wire", "symbols": ["_", {"literal":"wire"}, "ws_wire$ebnf$1", "ws_wire_body"], "postprocess": 
        (data)=>{
            return {
                type: "ws_wire_creation",                
                ws_wire_body: data[3]
            }
        }
            },
    {"name": "ws_wire_body$ebnf$1", "symbols": []},
    {"name": "ws_wire_body$ebnf$1$subexpression$1", "symbols": ["ws_wire_component"]},
    {"name": "ws_wire_body$ebnf$1", "symbols": ["ws_wire_body$ebnf$1", "ws_wire_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws_wire_body", "symbols": [{"literal":"{"}, "ws_wire_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "ws_wire_component", "symbols": ["ws_wire_definition"], "postprocess": id},
    {"name": "ws_wire_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "ws_wire_definition", "symbols": ["_", "ws_connector", "_", {"literal":"=>"}, "_", "ws_connector", "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type:"ws_wire_definition",
                left_connector: data[1],
                right_connector: data[5]
            }
        }
        
            },
    {"name": "ws_connector", "symbols": [(digitallexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data)=>{
            return {
                type:"ws_connector",
                connector_name:data[0].value,
                line:data[0].line,
                col:data[0].line
        
            }
        }
        
            },
    {"name": "ws_connector", "symbols": [(digitallexer.has("identifier") ? {type: "identifier"} : identifier), (digitallexer.has("dot") ? {type: "dot"} : dot), (digitallexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data)=>{
            return {
                type:"ws_child_connector",
                parent_name:data[0].value,
                connector_name:data[2].value,
                line:data[0].line,
                col:data[0].line
            }
        }
        
            },
    {"name": "ws_init$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "ws_init$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ws_init", "symbols": ["_", {"literal":"init"}, "ws_init$ebnf$1", "ws_init_body"], "postprocess": 
        (data)=>{
            return {
                type: "ws_init_creation",                
                init_body: data[3]
            }
        }
            },
    {"name": "ws_init_body$ebnf$1", "symbols": []},
    {"name": "ws_init_body$ebnf$1$subexpression$1", "symbols": ["ws_init_component"]},
    {"name": "ws_init_body$ebnf$1", "symbols": ["ws_init_body$ebnf$1", "ws_init_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws_init_body", "symbols": [{"literal":"{"}, "ws_init_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "ws_init_component", "symbols": ["ws_port_initilization"], "postprocess": id},
    {"name": "ws_init_component", "symbols": ["ws_upp_init"], "postprocess": id},
    {"name": "ws_init_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "ws_upp_init", "symbols": ["_", {"literal":"upp"}, "_", (digitallexer.has("equal") ? {type: "equal"} : equal), "_", (digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("number") ? {type: "number"} : number), "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace), "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data) =>{           
            return {
                type: "ws_upp_init",
                value: data[7]
            };
        }
            },
    {"name": "ws_port_initilization", "symbols": ["_", (digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", "ws_connector", "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace), "_", (digitallexer.has("equal") ? {type: "equal"} : equal), "_", (digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("number") ? {type: "number"} : number), "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace), "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data) =>{           
            return {
                type: "ws_port_initilization",
                port: data[3],
                value: data[11]
            };
        }
            },
    {"name": "ws_process", "symbols": ["_", {"literal":"process"}, "ws_process_body"], "postprocess": 
        (data)=>{
            return {
                type: "ws_process_creation",                
                process_body: data[2]
            }
        }
            },
    {"name": "ws_process_body$ebnf$1", "symbols": []},
    {"name": "ws_process_body$ebnf$1$subexpression$1", "symbols": ["ws_process_component"]},
    {"name": "ws_process_body$ebnf$1", "symbols": ["ws_process_body$ebnf$1", "ws_process_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws_process_body", "symbols": [{"literal":"{"}, "ws_process_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "ws_process_component", "symbols": ["ws_process_element"], "postprocess": id},
    {"name": "ws_process_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "ws_process_element", "symbols": ["_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type:"ws_process_element",
                module_name:data[1]
            }
        }
        
            },
    {"name": "preprocessor", "symbols": ["_", {"literal":"include"}, {"literal":"("}, (digitallexer.has("string") ? {type: "string"} : string), {"literal":")"}, (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type : "include",
                file : data[3]
            }
        }
            },
    {"name": "preprocessor", "symbols": ["_", {"literal":"copy"}, {"literal":"("}, (digitallexer.has("string") ? {type: "string"} : string), {"literal":")"}, (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type: "copy",
                file: data[3]
            }
        }
            },
    {"name": "module$ebnf$1$subexpression$1", "symbols": [(digitallexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "module$ebnf$1", "symbols": ["module$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "module$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "module", "symbols": [{"literal":"module"}, (digitallexer.has("WS") ? {type: "WS"} : WS), (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"("}, "_", "module_port_list", "_", (digitallexer.has("fatarrow") ? {type: "fatarrow"} : fatarrow), "_", "module_port_list", "_", {"literal":")"}, "_", "module$ebnf$1", "_", "module_body"], "postprocess": 
        (data)=>{
            return {
                type: "module_creation",
                module_name:data[2],
                input_portlist: data[6],
                output_portlist: data[10],
                module_body: data[16]
            }
        }
            },
    {"name": "module_port_list", "symbols": [(digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace)], "postprocess": 
        (data)=>{
            return [];
        }
            },
    {"name": "module_port_list$ebnf$1", "symbols": []},
    {"name": "module_port_list$ebnf$1$subexpression$1", "symbols": ["_", (digitallexer.has("comma") ? {type: "comma"} : comma), "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "_"]},
    {"name": "module_port_list$ebnf$1", "symbols": ["module_port_list$ebnf$1", "module_port_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "module_port_list", "symbols": [(digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "module_port_list$ebnf$1", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace)], "postprocess": 
        (data) =>{
            const repeatedPieces = data[3];
            const restParams = repeatedPieces.map(piece => piece[3]);
            return [data[2], ...restParams];
        }
            },
    {"name": "module_body$ebnf$1", "symbols": []},
    {"name": "module_body$ebnf$1$subexpression$1", "symbols": ["module_component"]},
    {"name": "module_body$ebnf$1", "symbols": ["module_body$ebnf$1", "module_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "module_body", "symbols": [{"literal":"{"}, "module_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data)=>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "module_component", "symbols": ["contains"], "postprocess": id},
    {"name": "module_component", "symbols": ["wire"], "postprocess": id},
    {"name": "module_component", "symbols": ["init"], "postprocess": id},
    {"name": "module_component", "symbols": ["process"], "postprocess": id},
    {"name": "module_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "contains$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "contains$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "contains", "symbols": ["_", {"literal":"contains"}, "contains$ebnf$1", "contains_body"], "postprocess": 
        (data)=>{
            return {
                type: "contains_creation",                
                contains_body: data[3]
            }
        }
            },
    {"name": "contains_body$ebnf$1", "symbols": []},
    {"name": "contains_body$ebnf$1$subexpression$1", "symbols": ["contains_component"]},
    {"name": "contains_body$ebnf$1", "symbols": ["contains_body$ebnf$1", "contains_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "contains_body", "symbols": [{"literal":"{"}, "contains_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "contains_component", "symbols": ["used_module_define"], "postprocess": id},
    {"name": "contains_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "used_module_define$ebnf$1", "symbols": []},
    {"name": "used_module_define$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "used_module_define$ebnf$1", "symbols": ["used_module_define$ebnf$1", "used_module_define$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "used_module_define", "symbols": ["_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "__", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "used_module_define$ebnf$1", "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            const repeatedPieces = data[4];
            const restParams = repeatedPieces.map(piece => piece[3]);
            return {
                type: "used_module_define",
                UsedModule: data[1],
                names: [data[3],...restParams]
            } 
        }
            },
    {"name": "wire$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "wire$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "wire", "symbols": ["_", {"literal":"wire"}, "wire$ebnf$1", "wire_body"], "postprocess": 
        (data)=>{
            return {
                type: "wire_creation",                
                wire_body: data[3]
            }
        }
            },
    {"name": "wire_body$ebnf$1", "symbols": []},
    {"name": "wire_body$ebnf$1$subexpression$1", "symbols": ["wire_component"]},
    {"name": "wire_body$ebnf$1", "symbols": ["wire_body$ebnf$1", "wire_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "wire_body", "symbols": [{"literal":"{"}, "wire_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "wire_component", "symbols": ["wire_definition"], "postprocess": id},
    {"name": "wire_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "wire_definition", "symbols": ["_", "connector", "_", {"literal":"=>"}, "_", "connector", "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type:"wire_definition",
                left_connector: data[1],
                right_connector: data[5]
            }
        }
        
            },
    {"name": "connector", "symbols": [(digitallexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data)=>{
            return {
                type:"connector",
                connector_name:data[0].value,
                line:data[0].line,
                col:data[0].col
            }
        }
        
            },
    {"name": "connector", "symbols": [(digitallexer.has("identifier") ? {type: "identifier"} : identifier), (digitallexer.has("dot") ? {type: "dot"} : dot), (digitallexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data)=>{
            return {
                type:"child_connector",
                parent_name:data[0].value,
                connector_name:data[2].value,
                line:data[0].line,
                col:data[0].col
            }
        }
        
            },
    {"name": "init$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "init$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "init", "symbols": ["_", {"literal":"init"}, "init$ebnf$1", "init_body"], "postprocess": 
        (data)=>{
            return {
                type: "init_creation",                
                init_body: data[3]
            }
        }
            },
    {"name": "init_body$ebnf$1", "symbols": []},
    {"name": "init_body$ebnf$1$subexpression$1", "symbols": ["init_component"]},
    {"name": "init_body$ebnf$1", "symbols": ["init_body$ebnf$1", "init_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "init_body", "symbols": [{"literal":"{"}, "init_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "init_component", "symbols": ["output_port_initilization"], "postprocess": id},
    {"name": "init_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "output_port_initilization", "symbols": ["_", (digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", "connector", "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace), "_", (digitallexer.has("equal") ? {type: "equal"} : equal), "_", (digitallexer.has("lsqbrace") ? {type: "lsqbrace"} : lsqbrace), "_", (digitallexer.has("number") ? {type: "number"} : number), "_", (digitallexer.has("rsqbrace") ? {type: "rsqbrace"} : rsqbrace), "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data) =>{           
            return {
                type: "output_port_initilization",
                output_port: data[3],
                value: data[11]
            };
        }
            },
    {"name": "process", "symbols": ["_", {"literal":"process"}, "process_body"], "postprocess": 
        (data)=>{
            return {
                type: "process_creation",                
                process_body: data[2]
            }
        }
            },
    {"name": "process_body$ebnf$1", "symbols": []},
    {"name": "process_body$ebnf$1$subexpression$1", "symbols": ["process_component"]},
    {"name": "process_body$ebnf$1", "symbols": ["process_body$ebnf$1", "process_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "process_body", "symbols": [{"literal":"{"}, "process_body$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        (data) =>{
            const repeatedPieces = data[1];
            const restParams = repeatedPieces.map(piece => piece[0]);
            return [...restParams];
        }
            },
    {"name": "process_component", "symbols": ["process_element"], "postprocess": id},
    {"name": "process_component", "symbols": ["empty_space"], "postprocess": id},
    {"name": "process_element", "symbols": ["_", (digitallexer.has("identifier") ? {type: "identifier"} : identifier), "_", (digitallexer.has("semicolen") ? {type: "semicolen"} : semicolen)], "postprocess": 
        (data)=>{
            return {
                type:"process_element",
                module_name:data[1]
            }
        }
        
            },
    {"name": "empty_space", "symbols": [(digitallexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  
        (data)=>{
            return {
                type: "unnecessary",
                value:"new_line_only",
                data:[data[0]]
                
            }
        }
        
             },
    {"name": "empty_space", "symbols": ["__", (digitallexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  
        (data)=>{
            return {
                type: "unnecessary",
                value:"white_space_with_new_line",
                data:[data[0],data[1]]                
            }
        }
        
             },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(digitallexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (digitallexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]}
]
  , ParserStart: "components"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
