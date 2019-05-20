"use strict";

const puppeteer = require("puppeteer");
const randomString = require("randomstring");
const fs = require("fs");

(async () => {
  try {
    const browser = await initializeBrowser();
    const page = await browser.page();

    while (true) {
      const url = generateUrl();
      console.log(`[~] Opening: ${url}`);
      await page.goto(url, {timeout: 200000, waitUntil: "networkidle2"});

      if (await validateEndpoint(page)) {
        /* In case the url contains download button/link */
        fs.appendFileSync("scraped.txt", url);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

/**
 * Checks if download button exists
 * @param page
 * @returns {Promise<any>}
 */
const validateEndpoint = page =>
  new Promise(async (resolve, reject) => {
    try {
      const exists = await page.evaluate(() => {
        return !!document.querySelector("input[class=\"form-button\"]");
      });

      return resolve(exists);
    } catch (e) {
      return reject(e);
    }

  });

/**
 * Generates random link endpoint
 * @returns {string}
 */
const generateUrl = () => {
  const baseUrl = "http://dl.free.fr/getfile.pl?file=/";
  const randomStr = randomString.generate({ length: 8,  charset: 'alphabetic' });

  return baseUrl + randomStr;
};

/**
 * Creates instance if pupppeteer browser
 * @returns {Promise<any>}
 */
const initializeBrowser = () =>
  new Promise(async (resolve, reject) => {
    try {
      /* TODO Tor socks proxy for dark web pages option */
      const browser = await puppeteer.launch({
        headless: false
      });
    } catch (e) {
      return reject(e);
    }
  });
