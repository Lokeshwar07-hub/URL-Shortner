const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoose } = require("./connect");
const { restrictedToLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const URL = require("./models/url");

const staticRoute = require("./router/staticRouter");
const urlRoute = require("./router/url");
const userRoute = require("./router/user");

const app = express();
const PORT = 8001;

connectToMongoose("mongodb://localhost:27017/short-url").then(() =>
    console.log("MongoDB connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/url", restrictedToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    );
    if (!entry) return res.status(404).send("Short URL not found");
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));