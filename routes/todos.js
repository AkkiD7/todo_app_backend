const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", todoController.getTodos);
router.get("/filter", todoController.filterTodos);
router.get('/:id', todoController.getTodoById);
router.post("/", todoController.addTodo);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.post("/upload", upload.single("file"), todoController.uploadTodos);
router.get("/download", todoController.downloadTodos);

module.exports = router;
