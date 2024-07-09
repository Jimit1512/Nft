const {network} = require("hardhat");
const{verify} = require("../utils/verify");
const {developmentChains} = require("../helper-hardhat-config");

module.exports = async function({getNamedAccounts ,deployments}){
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    
    log("--------------------------")
    const args= []
    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHER_API){
        log("Verifying");
        await verify(basicNft.address, args)
    }
    log("----------------------------")
}

module.exports.tags = ["all", "basicnft", "main"]