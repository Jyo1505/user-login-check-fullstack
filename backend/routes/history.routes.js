const router = require("express").Router();
const { getHistory } = require("../controllers/historyController");

router.get("/:userId", getHistory);

module.exports = router;
