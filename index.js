// index.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000; // You can change the port number if needed

const { Auth } = require("@vonage/auth");
const { NumberInsights } = require("@vonage/number-insights");

require("dotenv").config(); // Load environment variables from .env file

const credentials = new Auth({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});
const options = {};
const niClient = new NumberInsights(credentials, options);

// Middleware to parse JSON requests
app.use(express.json());

// Basic Lookup endpoint
app.get("/basiclookup", async (req, res) => {
  const phoneNumber = req.query.phonenumber;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  try {
    const response = await niClient.basicLookup(phoneNumber);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Standard Lookup endpoint
app.get("/standardlookup", async (req, res) => {
  const phoneNumber = req.query.phonenumber;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  try {
    const response = await niClient.standardLookup(phoneNumber);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Advanced Lookup endpoint
app.get("/advancedlookup", async (req, res) => {
  const phoneNumber = req.query.phonenumber;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  try {
    const response = await niClient.advancedLookup(phoneNumber);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Serve the UI HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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
