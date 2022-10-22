var test = require('./core/test')

async function main() {

  const action = process.argv[2];
  const filename = process.argv[3];
  let outputfilename = process.argv[4];

  test.print(process.argv[0])


}

main().catch((err) => console.log(err.stack));

