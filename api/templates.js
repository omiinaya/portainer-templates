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

  //merging all unique templates
  const resultObject = results.reduce((acc, obj) => {
    acc['templates'] = [...(acc['templates'] || []), ...obj['templates']]
    return acc;
  }, {});


  const templates = await resultObject.templates

  const crafted = {
    "version": "2",
    templates
  }
  
   const directoryPath = './output/'; // The directory where you want to save the file.
   const filename = 'templates.json';  // The name of the JSON file.
 
   fs.writeFileSync(directoryPath + filename, JSON.stringify(crafted, null, 4));
 
  try {
    res.json(crafted)
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }

});

module.exports = router;