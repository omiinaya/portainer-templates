const express = require("express");
const router = express.Router();
const list = require('./links')
const fs = require('fs')

router.get("/", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*' /*'https://econ-project.vercel.app/'*/)

  const requests = list.map(async link => {
    const response = await fetch(link)
    const data = await response.json();
    return data
  });

  const results = await Promise.all(requests);

  var imageMap = {};
  results.forEach(obj => {
    obj.templates.forEach(template => {
      // Add the template only if the image name is not already present in the map.
      if (!imageMap[template.image]) imageMap[template.image] = template;
    });
  });

  // Create a new object with the combined templates array.
  var singleObject = { version: "2", templates: Object.values(imageMap) };


  const directoryPath = './output/'; // The directory where you want to save the file.
  const filename = 'templates.json';  // The name of the JSON file.

  fs.writeFileSync(directoryPath + filename, JSON.stringify(singleObject, null, 4));


  try {
    //res.json(templates)
    res.json(singleObject)
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }

});

module.exports = router;