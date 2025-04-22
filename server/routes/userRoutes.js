const express = require("express");
const { deleteUser,updateUserProfile,getUserLessons,getUserStats } = require("../controllers/userController");
const router = express.Router();

router.delete("/deleteprofile", deleteUser);
router.put("/updateprofile",updateUserProfile);
router.get("/lessons",getUserLessons);
router.get("/stats", getUserStats);


module.exports = router;
