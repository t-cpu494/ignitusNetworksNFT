const Migration = artifacts.require("ignitusNetworksNFTmarketplace")

module.exports = function(deployer) {
    deployer.deploy(Migration, "0x91B771C9069D052e9E7543fa7133084DC5D8F58c")
};