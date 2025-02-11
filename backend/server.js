require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const TwitterStrategy = require("passport-twitter").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
    twitterId: String,
    facebookId: String,
    username: String,
    profileImage: String,
    role: { type: String, default: "writer" }
});
const User = mongoose.model("User", UserSchema);

// Article Schema
const ArticleSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    profileImage: String,
    upvotes: { type: Number, default: 0 }
});
const Article = mongoose.model("Article", ArticleSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    user: String,
    text: String,
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model("Comment", CommentSchema);

// Upvote Tracking Schema (To prevent multiple upvotes per IP)
const UpvoteTracker = new mongoose.Schema({
    ipAddress: String,
    articleId: mongoose.Schema.Types.ObjectId,
});
const Upvote = mongoose.model("Upvote", UpvoteTracker);

// Twitter Authentication
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://your-backend-url.onrender.com/auth/twitter/callback"
}, async (token, tokenSecret, profile, done) => {
    let user = await User.findOne({ twitterId: profile.id });
    if (!user) {
        user = new User({
            twitterId: profile.id,
            username: profile.username,
            profileImage: profile.photos[0].value
        });
        await user.save();
    }
    return done(null, user);
}));

// Facebook Authentication
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://your-backend-url.onrender.com/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
        user = new User({
            facebookId: profile.id,
            username: profile.displayName,
            profileImage: profile.photos[0].value
        });
        await user.save();
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Authentication Routes
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get("/auth/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/dashboard");
});
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
});

// Articles API
app.post("/articles", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description } = req.body;
    const newArticle = new Article({
        title,
        description,
        author: req.user.username,
        profileImage: req.user.profileImage,
        upvotes: 0
    });

    await newArticle.save();
    res.json({ message: "Article added!" });
});

app.get("/articles", async (req, res) => {
    const articles = await Article.find().sort({ upvotes: -1 }).limit(10);
    res.json(articles);
});

// Upvote API with IP Tracking
const upvoteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 1, // Only 1 upvote per article per hour
    message: { error: "You can only upvote once per hour." }
});

app.post("/articles/:id/upvote", upvoteLimiter, async (req, res) => {
    const ipAddress = req.ip;
    const articleId = req.params.id;

    const existingVote = await Upvote.findOne({ ipAddress, articleId });
    if (existingVote) {
        return res.status(400).json({ message: "You've already upvoted this article." });
    }

    await Upvote.create({ ipAddress, articleId });

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.upvotes += 1;
    await article.save();
    res.json({ upvotes: article.upvotes });
});

// Writer Rankings API
app.get("/writers/rankings", async (req, res) => {
    const writers = await User.aggregate([
        { 
            $lookup: { 
                from: "articles", 
                localField: "twitterId", 
                foreignField: "author", 
                as: "articles" 
            } 
        },
        { 
            $addFields: { 
                totalUpvotes: { $sum: "$articles.upvotes" } 
            } 
        },
        { $sort: { totalUpvotes: -1 } }
    ]);

    const totalWriters = writers.length;
    writers.forEach((writer, index) => {
        const percentile = ((index + 1) / totalWriters) * 100;
        if (percentile <= 1) writer.rank = "🥇 Top 1%";
        else if (percentile <= 5) writer.rank = "🥈 Top 5%";
        else if (percentile <= 10) writer.rank = "🥉 Top 10%";
        else if (percentile <= 50) writer.rank = "🔹 Top 50%";
        else writer.rank = "🔸 Top 75%";
    });

    res.json(writers);
});

// Comments API
app.post("/articles/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { text } = req.body;
    const comment = new Comment({
        articleId: req.params.id,
        user: req.user.username,
        text,
        upvotes: 0
    });

    await comment.save();
    res.json(comment);
});

app.get("/articles/:id/comments", async (req, res) => {
    const comments = await Comment.find({ articleId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
});

app.listen(5000, () => console.log("Server running on port 5000"));
