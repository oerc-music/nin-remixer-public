// Copied from: https://www.tutorialkart.com/nodejs/node-js-command-line-arguments/
//
// process.argv is the array that contains command line arguments
// print all arguments using forEach

process.argv.forEach(
    (val, index) => {
        console.log(`${index}: ${val}`);
        }
    );
