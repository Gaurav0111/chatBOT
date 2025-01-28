const express = require("express");
const router = express.Router();
const axios = require("axios");

// Fetch meta-description
router.post("/meta", async (req, res) => {
  const { website } = req.body;

  try {
    const response = await axios.get(website);
    const metaDescription = response.data.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
    res.status(200).json({ description: metaDescription || "No meta-description found." });
  } catch (error) {
    console.error("Error fetching meta-description:", error.message);
    res.status(500).send("Failed to fetch meta-description.");
  }
});

module.exports = router;
