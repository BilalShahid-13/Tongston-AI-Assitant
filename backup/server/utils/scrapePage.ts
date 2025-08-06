

// export const scrapePage = async (url: string) => {

//   const loader = new PuppeteerWebBaseLoader(url, {
//     launchOptions: {
//       headless: true,
//     },{
//     gotoOptions: {
//       waitUntil: "domcontentloaded"
//     }
//   },
//     evaluate: async (page, browser) => {
//       const result = await page.evaluate(() => document.body.innerHTML);
//       await browser.close();
//       return result;
//     }
//   });

// return (await loader.scrape())?.replace(/<[^>]*>/g, "").trim() || "";

// }