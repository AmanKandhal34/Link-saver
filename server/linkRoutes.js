const express = require("express");
const router = express.Router();
const Link = require("./link");
const auth = require("./middleware/auth");

// Save a new link
router.post("/", auth, async (req, res) => {
    try {
        const newLink = new Link({ user: req.user.id, url: req.body.url });
        await newLink.save();
        res.json(newLink);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all links for the user
router.get("/", auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a link by ID
router.delete("/:id", auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await link.deleteOne();
        res.json({ message: "Link deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a link by ID
router.put("/:id", auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        link.url = req.body.url || link.url;
        await link.save();
        res.json(link);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});



module.exports = router;
