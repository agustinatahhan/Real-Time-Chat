import express from "express";
import controller from "../controllers/message.js";

const router = express.Router();

router.post("/save", controller.save);
router.get("/messages", controller.getMessage);
router.delete('/messages', controller.deleteAllMessages);

export default router;