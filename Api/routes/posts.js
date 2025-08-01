const express = require("express");
const {
  postWithImagesController_V3,
  postWithImagesController_V2,
} = require("../controllers/postController");
const router = express.Router();

router.post("/V3-model/:userId", postWithImagesController_V3);
router.post("/V2-model/:userId", postWithImagesController_V2);

module.exports = router;
