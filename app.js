'use strict';

require('dotenv').config();
const fetch = require("node-fetch");
const assert = require('assert');

const KEY = process.env.API_KEY;
const BASE_LINK = "https://sandbox-api.brewerydb.com/v2/";
const ENDPOINT = "beers/?key=";
const PARAMETER = "&beerId=";

const readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your beer ID: ", function (beerID) {
    getBeerNameByID(fetch, beerID);
    rl.close();
});

// IDs you can use : c4f2KE/zTTWa2/zfP2fK/xwYSL2/
function getBeerNameByID(fetch, beerID) {

    const URL = BASE_LINK + ENDPOINT + KEY + PARAMETER + beerID;
    return fetch(URL)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success") {
                console.log("Beer name: ", res.data.nameDisplay);
            } else {
                console.log("Cheers!!!")
            }
        })

        .catch(error => console.log("oops, looks like we got an error: ", error))
        .finally(() => console.log("Cheers!!!!"))

}

//TESTING
describe('getBeerNameByID', () => {

    // Misstyped address
    it('1. uses the right address', () => {
        const testURL = url => {
            assert.deepEqual(url, BASE_LINK + ENDPOINT + KEY + PARAMETER + "c4f2KE");
            return new Promise(function () { })
        }
        getBeerNameByID(testURL, 'c4f2KE')
    });

    // Out of range request (ex what the max request number is)
    it('2. keeps all requests in range', () => {
        const testRange = () => {
            assert.equal(BASE_LINK + ENDPOINT + KEY + "&totalResults=" + "10000");
            return new Promise(function () { })
        }
        getBeerNameByID(testRange, 'c4f2KE')
    });

    // Wrong api key (if key does not equal the exact api key)
    it('3. uses correct api key', () => {
        const testKEY = () => {
            assert.equal(process.env.API_KEY, "b65e450716eea9201350284a25e5652a")
            return new Promise(function () { })
        }
        getBeerNameByID(testKEY, 'c4f2KE')
    });

    //  Return wrong name
    it('parses the response of fetch correctly', (done) => {
        const fakeFetch = () => {
            return Promise.resolve({
                data: { name: "'Murican Pilsner" }
            })
        }
        getBeerNameByID(fakeFetch, 'c4f2KE')
            .then(result => {
                assert.equal(result.data.name === "'Murican Pilsner");
                done()
            })
    })
});

