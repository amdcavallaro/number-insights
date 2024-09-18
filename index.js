// index.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000; // You can change the port number if needed

const { Auth } = require("@vonage/auth");
const { NumberInsights } = require("@vonage/number-insights");

require("dotenv").config(); // Load environment variables from .env file

const credentials = new Auth({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});
const options = {};
const niClient = new NumberInsights(credentials, options);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Unified Lookup endpoint
app.get("/lookup", async (req, res) => {
  const phoneNumber = req.query.phonenumber;
  const lookupType = req.query.type;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  if (!lookupType) {
    return res.status(400).send("Lookup type is required");
  }

  try {
    let response;
    switch (lookupType.toLowerCase()) {
      case "basic":
        response = await niClient.basicLookup(phoneNumber);
        break;
      case "standard":
        response = await niClient.standardLookup(phoneNumber);
        break;
      case "advanced":
        response = await niClient.advancedLookup(phoneNumber);
        break;
      default:
        return res.status(400).send("Invalid lookup type");
    }
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/basiclookup", async (req, res) => {
  const phoneNumber = req.query.phonenumber;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  try {
    const basicResponse = await fetch(
      `/basiclookup?phonenumber=${phoneNumber}`
    );
    const basicData = await basicResponse.json();
    document.getElementById("basicResponse").innerText = JSON.stringify(
      basicData,
      null,
      2
    );

    const standardResponse = await fetch(
      `/standardlookup?phonenumber=${phoneNumber}`
    );
    const standardData = await standardResponse.json();
    document.getElementById("standardResponse").innerText = JSON.stringify(
      standardData,
      null,
      2
    );

    const advancedResponse = await fetch(
      `/advancedlookup?phonenumber=${phoneNumber}`
    );
    const advancedData = await advancedResponse.json();
    document.getElementById("advancedResponse").innerText = JSON.stringify(
      advancedData,
      null,
      2
    );
  } catch (error) {
    console.error("Error performing lookup:", error);
    alert("Error performing lookup. Please check the console for details.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
