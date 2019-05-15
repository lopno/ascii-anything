const fs = require("fs");
const axios = require("axios");

async function downloadImage(imageUrl, saveToPath) {
  const writer = fs.createWriteStream(saveToPath);

  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports = {
  downloadImage
};
