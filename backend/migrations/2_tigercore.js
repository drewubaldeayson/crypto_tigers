const TigerCore = artifacts.require("TigerCore");

module.exports = function(deployer) {
  deployer.deploy(TigerCore);
};
