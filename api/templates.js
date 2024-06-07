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

  // Combine the template arrays using the reduce method.
  var combinedTemplatesArray = results.reduce((acc, cur) => {
    return acc.concat(cur.templates);
  }, []);


 // Keep the first template with each unique image or include all templates without an image
const uniqueImages = combinedTemplatesArray.reduce((acc, cur) => {
  if (!acc.some(t => t.image === cur.image)) {
    acc.push(cur);
  } else if (cur.image === undefined) {
    acc.push(cur);
  }
  return acc;
}, []);

// Create a new object with the unique templates array
const singleObject = { version: '2', templates: uniqueImages };

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