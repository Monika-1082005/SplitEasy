const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

router.get("/api/contacts", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: req.user.accessToken });

  const people = google.people({ version: "v1", auth: oauth2Client });

  try {
    let allContacts = [];
    let pageToken = null;

    do {
      const response = await people.people.connections.list({
        resourceName: "people/me",
        personFields: "names,emailAddresses,phoneNumbers",
        pageSize: 100,
        pageToken: pageToken,
      });

      allContacts = allContacts.concat(response.data.connections);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    console.log("Fetched all contacts:", allContacts);
    res.json(allContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Error fetching contacts");
  }
});

module.exports = router;
