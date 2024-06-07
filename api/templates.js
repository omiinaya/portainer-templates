const express = require("express");
const router = express.Router();
const list = require('./links')
const fs = require('fs')

router.get("/", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')

  const requests = list.map(async link => {
    const response = await fetch(link)
    const data = await response.json();
    return data
  });

  const results = await Promise.all(requests);

  //merging all unique templates
  const templates = results.reduce((acc, obj) => {
    const valuesSet = new Set(acc['templates'] || []);
    valuesSet.add(obj['templates']);
    acc['templates'] = [...valuesSet];
    return acc.templates[0];
  }, {});

  const crafted = {
    "version": "2",
    templates
  }

  const directoryPath = './output/'; // The directory where you want to save the file.
  const filename = 'templates.json';  // The name of the JSON file.

  fs.writeFileSync(directoryPath + filename, JSON.stringify(crafted, null, 4));

  /*
  try {
    res.json(crafted)
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
    */

});

module.exports = router;