const dotenv = require("dotenv");
const googleImages = require("google-images");
const asciifyImage = require("asciify-image");
const path = require("path");

const downloadImageUtils = require("./utils/downloadImage");

dotenv.config();

const localImagePath = path.resolve(__dirname, "images", "downloaded_image");

const searchClient = new googleImages(
  process.env.SEARCH_ENGINE_ID,
  process.env.GOOGLE_API_KEY
);

const asciifyOptions = {
  fit: "box",
  width: 80,
  height: 60
};

const searchTerm = process.argv[2];

let imageUrl = null;

if (!searchTerm) {
  console.log(
    `Please give a search term as argument, e.g. 'node index.js "ponies in space"'`
  );
} else {
  return searchClient
    .search(searchTerm)
    .then(searchResults => {
      if (searchResults.length && searchResults[0].url) {
        return searchResults[0].url;
      }
      throw new Error("No images found");
    })
    .then(async resultImageUrl => {
      imageUrl = resultImageUrl;
      await downloadImageUtils.downloadImage(resultImageUrl, localImagePath);
    })
    .then(() => {
      return asciifyImage(localImagePath, asciifyOptions);
    })
    .then(asciiImage => {
      console.log(asciiImage);
    })
    .catch(error => {
      console.log(error.message, error);
    });
}
