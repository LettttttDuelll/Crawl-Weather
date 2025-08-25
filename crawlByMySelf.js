import puppeteer from "puppeteer";

const url = "https://thanhnien.vn/";

let data = [];

const run = async () => {
    //open the browser with no haead
    const brower = await puppeteer.launch({ headless: false });
    // Create a new page
    const page = await brower.newPage();
    // Navigate to the URL
    //await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.goto(url, { waitUntil: "networkidle2" });


    const listNews = await page.$$eval(".box-category-item", els => (els.map ( el => {//eval return array
        const title = el.querySelector(".box-title-text a")?.textContent || "";
        const description = el.querySelector("a.box-category-sapo")?.textContent || "";//lỗi
        const link = el.querySelector(".box-title-text a")?.href || "";
        const image = el.querySelector(".box-category-avatar")?.src || ""; 
        return {
            title:title,
            description:description,
            link:link,
            image:image
        };
    })))

    data.push(...listNews);

    console.log(data);
    // Close the browser    
    await brower.close();
}
run()