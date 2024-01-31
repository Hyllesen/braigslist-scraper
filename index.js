const axios = require("axios");
const cheerio = require("cheerio");

async function getAllJobsFromIndexPages() {
  const allJobs = [];
  for (var i = 1; i < 14; i++) {
    const jobIndexPage = await axios.get(
      `https://braigslist.vercel.app/jobs/${i}/`
    );
    const $ = cheerio.load(jobIndexPage.data);
    const jobs = $(".title-blob")
      .map((i, el) => {
        const title = $(el).text();
        const url = $(el).children("a").attr("href");
        return { title, url };
      })
      .get();
    allJobs.push(...jobs);
  }

  return allJobs;
}

async function getAllJobDescriptions(allJobs) {
  const allJobsWithDescriptionsPromises = allJobs.map(async (job) => {
    const jobpageResp = await axios.get(
      "https://braigslist.vercel.app/" + job.url
    );
    const $ = cheerio.load(jobpageResp.data);
    const description = $("div").text();
    job.description = description;
    return job;
  });
  const allJobsWithDescriptions = await Promise.all(
    allJobsWithDescriptionsPromises
  );
  console.log(allJobsWithDescriptions);
}

async function main() {
  const allJobs = await getAllJobsFromIndexPages();
  console.log(allJobs.length);
  getAllJobDescriptions(allJobs);
}

main();
