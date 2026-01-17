const express = require("express");
const auth = require("../middleware/auth");
const { getMessages, postMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/:jobId/:applicantId/messages", auth, getMessages);
router.post("/:jobId/:applicantId/messages", auth, postMessage);

module.exports = router;
