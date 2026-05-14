const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortID = shortid.generate();

    await URL.create({
        shortId: shortID,
        redirectURL: url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    // Only fetch URLs belonging to the logged-in user
    const allUrls = await URL.find({ createdBy: req.user._id });

    return res.render("home", {
        id: shortID,
        urls: allUrls,
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };