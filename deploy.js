//compile the contract
async function main() {
    console.log("Hello World");
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exitCode = 1;
});