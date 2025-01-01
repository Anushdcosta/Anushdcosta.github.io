const express = require("express");
const { JSDOM } = require('jsdom');
const axios = require('axios');
function countEpisodes(url) {
  // Dynamically import `node-fetch` and fetch the page content
  return import('node-fetch')
    .then(({ default: fetch }) => fetch(url))
    .then((response) => response.text())
    .then((htmlText) => {
      // Use JSDOM to parse the HTML
      const dom = new JSDOM(htmlText);
      const document = dom.window.document;

      // Select all anchor elements (excluding navigation links like "../")
      const episodeLinks = Array.from(document.querySelectorAll('a')).filter((link) => {
        const href = link.getAttribute('href');
        return href && !href.startsWith('../') && /\.(mp4|mkv|avi)$/i.test(href);
      });

      // Count the number of episodes
      const episodeCount = episodeLinks.length;

      console.log(`Number of episodes: ${episodeCount}`);
      return episodeCount;
    })
    .catch((error) => {
      console.error('Error fetching or parsing the page:', error);
    });
}
function countFoldersFromURL(url) {
  // Dynamically import `node-fetch` and fetch the page content
  return import('node-fetch')
    .then(({ default: fetch }) => fetch(url))
    .then((response) => response.text())
    .then((htmlText) => {
      // Use JSDOM to parse the HTML
      const dom = new JSDOM(htmlText);
      const document = dom.window.document;

      // Select all anchor elements (excluding navigation links like "../")
      const episodeLinks = Array.from(document.querySelectorAll('a')).filter((link) => {
        const href = link.getAttribute('href');
        return href && href.endsWith('/');
      });

      // Count the number of episodes
      const episodeCount = episodeLinks.length;

      console.log(`Number of episodes: ${episodeCount}`);
      return episodeCount;
    })
    .catch((error) => {
      console.error('Error fetching or parsing the page:', error);
    });
}

const app = express();
const port = 3000;

app.listen(port, () => console.log(`listening on port ${port}`));


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/flash", (req, res) => {
  const season = req.query.season || 1;
  
  const url = `https://dl3.raycamovie.com/Serial/1401/07/The.Flash/S0${season}/`;
  const link = `https://dl3.raycamovie.com/Serial/1401/07/The.Flash/`;
  countEpisodes(url).then((thisthing) => {
    console.log(thisthing);
    countFoldersFromURL(link).then((foldersFrom) => {
      res.render("episode", { season: season, name: "flash", numofepisodes: thisthing, folders: foldersFrom-1});
    });
  });
});
