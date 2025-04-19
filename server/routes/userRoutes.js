const express = require("express");
const { deleteUser,updateUserProfile,getUserLessons } = require("../controllers/userController");

const router = express.Router();


router.delete("/deleteprofile", deleteUser);
router.put("/updateprofile",updateUserProfile);
router.get("/lessons",getUserLessons);
// router.get("/profile", authenticateJWT, getUserProfile);


module.exports = router;
