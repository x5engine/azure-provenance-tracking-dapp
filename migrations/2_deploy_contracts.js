var MemoryBook = artifacts.require("MemoryBook");
var Arg = "Hello Azure Blockchain!";
module.exports = deployer => {
    deployer.deploy(MemoryBook, Arg);
};