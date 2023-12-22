const puppeteer = require( "puppeteer")
const filterWriter = require( "./helpers/fileWriter.js")
const services = require( "./data/services.js")
const path = require( "path")
const categories = require("./output/categories.json")
const realData = require("./output/services.json")

let categoryDescriptions = [];
const url = "https://www.fredsbrakeandalignment.com/Automotive-Services/cat/a-c-repair"
const serinfoInfoSelector = "div.CategoryDescriptionText#big-climate-control-1"
// let categories = services.map(service => service.replace("&", "").replace("/", "-").split(" ").filter(word => word).join("-").toLocaleLowerCase());


// filterWriter(JSON.stringify(categories), path.join(__dirname, "output", "categories.json"))

const scrapper = async (url, name) => {
    try {
        console.log(name)
        console.log("Trying to launch browser...")
        const browser = await puppeteer.launch();
        console.log("Browser launched successfully...")
        console.log("Creating a new page...")
        const page = await browser.newPage()
        console.log("New page created successfully...")
        console.log("Navigating to a url...")
        await page.goto(url)
        console.log("Url navigation successful..")
        // const serviceInfoContainer = await page.waitForSelector("div.CategoryDescriptionText#big-climate-control-1")
        // const innerHTML = await serviceInfoContainer.evaluate(() => serviceInfoContainer.get)
        // Use page.evaluate() to read the innerHTML of the target element
        let serviceInfoSelector = "div.CategoryDescriptionText[id*=big]";
        await page.waitForSelector(serviceInfoSelector)
        console.log("Successfully targeted element")
        const innerHTML = await page.evaluate((serviceInfoSelector) => {
            const element = document.querySelector(serviceInfoSelector);
            return element.innerHTML;
        }, serviceInfoSelector);

        let newData = {name, innerHTML};

        categoryDescriptions.push(newData);
        let toSave = [...categoryDescriptions, newData]
        let success = await filterWriter(JSON.stringify(toSave), path.join(__dirname, "output", "services.json"))

        await browser.close();
    } catch (error) {
        console.log("Error in puppeteer: ", error)
    }
}
// console.log("Hello World!")
// // scrapper()
// // for (let word of categories) {
// //     let url = `https://www.fredsbrakeandalignment.com/Automotive-Services/cat/${word}`;
// //     scrapper(url, word).then()
// // }
let index = 2;

const runLoop = async (categories) => {
    let firstWord = categories[0]
    let url = `https://www.fredsbrakeandalignment.com/Automotive-Services/cat/${firstWord}`;
    let done = await scrapper(url, firstWord);
    return runLoop(categories.slice(1))
}  

// runLoop(categories).then(() => console.log(categoryDescriptions))

runLoop(categories)