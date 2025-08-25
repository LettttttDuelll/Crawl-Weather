import puppeteer from "puppeteer";
import fs from "fs";

const url = "https://nchmf.gov.vn/kttvsite/vi-VN/1/thoi-tiet-dat-lien-24h-12h2-15.html";
let data = [];

const run = async () => {

    const brower = await puppeteer.launch({
        headless: true,
    })

    const page = await brower.newPage();

    await page.goto(url, {waitUntil:"networkidle2"});

    const title = await page.evaluate(() => document.querySelector("h1.tt-news")?.textContent || "");
    const safeTitle = (title || "weather").replace(/[<>:"/\\|?*]+/g, "_");
    data.push({title:safeTitle});

    const listWeather = await page.$$eval(".uk-width-expand", els => (els.map ( el => {//eval return array
        const city = el.querySelector(".text-weather-location a")?.textContent || "";   
        const description = el.querySelector(".text-weather-location p")?.textContent || "";
        return {
            city:city,  
            description:description,
        };
    })))

    data.push(...listWeather);
   // console.log(data);  
    await fs.writeFile(`${data[0]['title']}.json`, JSON.stringify(data),"utf-8", (err) => {
        if (err) throw err;
        console.log("File created");
    });
    await brower.close();
    //return data;  

}
run()
//fs.writeFile("data.json", JSON.stringify(data),"utf-8")