const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*' /*'https://econ-project.vercel.app/'*/)

  try {
    const response = `y r u here?`
    res.json({
      status: 200,
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;