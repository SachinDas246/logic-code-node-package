
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

module.exports = { getInitialLines}