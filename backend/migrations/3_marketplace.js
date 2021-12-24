const TigerCore = artifacts.require("TigerCore");
const MarketPlace = artifacts.require("MarketPlace");

module.exports = function(deployer) {
  deployer.deploy(MarketPlace, TigerCore.address);
};