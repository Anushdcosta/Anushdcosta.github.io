const axios = require('axios');
const { JSDOM } = require('jsdom');

function countFoldersFromURL(url) {
  // Make an HTTP request to fetch the HTML content
  axios.get(url)
    .then((response) => {
      // Parse the HTML content using JSDOM
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Select all <a> elements (links)
      const links = document.querySelectorAll('a');

      // Filter and count only the folder links (those ending with "/")
      const folderLinks = Array.from(links).filter(link => link.href.endsWith('/'));

      // Log the number of folders
      console.log(`Number of folders: ${folderLinks.length-1}`);
    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    });
}

// Call the function to count the folders
countFoldersFromURL();
