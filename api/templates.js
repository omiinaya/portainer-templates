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


  const uniqueImages = combinedTemplatesArray.reduce((acc, cur) => {
    if (cur.image !== undefined) {  // If the template has an image
      if (!acc.some(t => t.image === cur.image)) {  // Check for a unique combination of 'image' and 'name'
        acc.push(cur);  // Add it to the array
      }
    } else {  // If the template doesn't have an image
      if (!acc.some(t => t.name === cur.name)) {  // Check for a unique 'name'
        acc.push(cur);  // Add it to the array
      }
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