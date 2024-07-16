const {network} = require("hardhat");
const{verify} = require("../utils/verify");
const {developmentChains, networkConfig} = require("../helper-hardhat-config");
const {storeImages, storeTokenUriMetaData} = require("../utils/uploadToPinata");
const fs = require("fs");
const { networkInterfaces } = require("os");
require("dotenv").config();

const imagesLocation = "./images/randomNft";

const metaDataTemplate = {
    name: "",
    description: "",
    image: "",
    attribute: [
        {
        trait_type: "Cuteness",
        value: 100,
        },
    ],
};

let tokenUris = [
    'ipfs://QmdNGjPhhQ9HjGyGKDmwCXLRbzDNznsi5e2okf5vLcgFJy',
    'ipfs://QmaXvf8m6QHg1YXAE8qWLFAAsRKEKkyg2CkmtbaSJX4Pkf',
    'ipfs://QmeV4qvrHs6CD1TcSdBFQYG5TrFgwVRKt5n6umSJGjBHxZ'
  ];

const FUND_AMOUNT = "1000000000000000000000";

module.exports = async function({getNamedAccounts ,deployments}){
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    if(process.env.UPLOAD_TO_PINATA === "true"){
        tokenUris = await handleTokenUris();
    }

    let vrfCoordinatorV2Address, subscriptionId;

    if(developmentChains.includes(network.name)){
        const vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock");
        const vrfCoordinatorV2 = await ethers.getContractAt("VRFCoordinatorV2Mock",vrfCoordinatorV2Mock.address);
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const tx = await vrfCoordinatorV2.createSubscription();
        const txReceipt = await tx.wait(1);

        subscriptionId = txReceipt.logs[0].args.subId;
        await vrfCoordinatorV2.fundSubscription(subscriptionId, FUND_AMOUNT);
    }else{
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("-------------------");

    const args = [vrfCoordinatorV2Address, subscriptionId, networkConfig[chainId].gasLane, networkConfig[chainId].callbackGasLimit,  tokenUris,  networkConfig[chainId].mintFee];
    const randomIpfs = await deploy("RandomIpfsNft",{
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    });



    log("-----------------------------");
    
    if(!developmentChains.includes(network.name) && process.env.ETHER_API){
        log("Verifying");
        await verify(randomIpfs.address, args);
    }

}


async function handleTokenUris() {
    

    const {responses: imageUploadResponses, files} =await storeImages(imagesLocation);

    for(const imageUploadResponsesIndex in imageUploadResponses){
        let tokenUriMetaData = { ...metaDataTemplate};
        tokenUriMetaData.name = files[imageUploadResponsesIndex].replace(".png", "");
        tokenUriMetaData.description = `An adorable ${tokenUriMetaData.name}`;
        tokenUriMetaData.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;
        console.log(`Uploding ${tokenUriMetaData.name}`);

        const metaDataUploadResponse = await storeTokenUriMetaData(tokenUriMetaData);
        tokenUris.push(`ipfs://${metaDataUploadResponse.IpfsHash}`);
    }
    console.log("Token Uris uploaded");
    console.log(tokenUris);
    return tokenUris;
}

module.exports.tags = ["all", "randomIpfs", "main"]