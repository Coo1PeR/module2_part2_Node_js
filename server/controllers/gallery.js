const fs = require("fs").promises;
const path = require("path");
const querystring = require("querystring");
const url = require("url");

const BASE_DIR = "./gallery";
const TOTAL_PAGES = 5;

exports.getGallery = async (req, res) => {
  try {
    if (req.headers.authorization !== 'token') {
      return res.status(401).send(JSON.stringify({ errorMessage: "Server error" }))
    }
    const reqUrl = url.parse(req.url, true);
    const page = parseInt(reqUrl.query.page || 1);

    if (isNaN(page) || page > TOTAL_PAGES || page < 1) {
      res.alert(page)
      res.end(
        JSON.stringify({ errorMessage: "Page not found" })
      );
    }

    const galleryDir = path.join(BASE_DIR, String(page))
    const imgFiles = await fs.readdir(galleryDir);
    //const imgUrls = imgFiles.map((file) => path.join(`/gallery/${page}`, file));
    //const imgUrls = imgFiles.map((file) => path.join(`./gallery/${page}`, file));
    const imgUrls = imgFiles.map((file) => `http://${req.headers.host}/gallery/${page}/${file}`);

    const response = {
      objects: imgUrls,
      page: page,
      total: TOTAL_PAGES,
    };

    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(response)
    );
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ errorMessage: "Server error" }));
  }
};
