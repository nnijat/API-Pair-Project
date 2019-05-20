'use strict';

require('dotenv').config();
const fetch = require("node-fetch");

const KEY = process.env.API_KEY;
const BASE_LINK = "https://sandbox-api.brewerydb.com/v2/";
const ENDPOINT = "beers/?key=";
const PARAMETER = "/&beerId=";

const readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your beer ID: ", function (beerID) {
    getBeerNameByID(beerID);
    rl.close();
});

// IDs you can user : c4f2KE/zTTWa2/zfP2fK/xwYSL2/
function getBeerNameByID(beerID) {
    const URL = BASE_LINK + ENDPOINT + KEY + PARAMETER + beerID;

    fetch(URL)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                console.log("Beer name: ", res.data.nameDisplay);
            } else {
                console.log("Please check your client errors!!!")
            }
        })

        .catch(error => console.log("oops, looks like we got an error: ", error))
        .finally(() => console.log("Did you get your beer?"))

}

