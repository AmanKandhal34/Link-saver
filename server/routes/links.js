const express = require("express");
const Link = require("../models/Link");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all links for logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add a new link
router.post("/", auth, async (req, res) => {
    try {
        const newLink = new Link({ url: req.body.url, user: req.user.id });
        const savedLink = await newLink.save();
        res.json(savedLink);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update a link
router.put("/:id", auth, async (req, res) => {
    try {
        const updatedLink = await Link.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { url: req.body.url },
            { new: true }
        );
        res.json(updatedLink);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a link
router.delete("/:id", auth, async (req, res) => {
    try {
        await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: "Link deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
