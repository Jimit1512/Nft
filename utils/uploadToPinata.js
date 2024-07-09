const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();


const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imageFilePath){
    const fullImagePath = path.resolve(imageFilePath);
    const files = fs.readdirSync(fullImagePath);
    let responses = [];
    for(const fileIndex in files){
        const readableStreamForFile = fs.createReadStream(`${fullImagePath}/${files[fileIndex]}`);
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        };
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    }
    return{responses, files}
}

async function storeTokenUriMetaData(metaData){
    const options = {
        pinataMetadata: {
            name: metaData.name,
        },
    };
    try{
        const response = await pinata.pinJSONToIPFS(metaData, options);
        return response;
    }catch (error){
        console.log(error);
    }
    return null;
}
module.exports = {storeImages, storeTokenUriMetaData}