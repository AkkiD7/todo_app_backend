const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Operations related to todos
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the todo
 *                   description:
 *                     type: string
 *                     description: The description of the todo
 *                   status:
 *                     type: string
 *                     description: The status of the todo
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the todo
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The last update date of the todo
 *       500:
 *         description: Internal server error
 */
router.get("/", todoController.getTodos);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Add a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the todo
 *                 example: "Buy groceries"
 *               status:
 *                 type: string
 *                 description: The status of the todo
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the todo
 *                 description:
 *                   type: string
 *                   description: The description of the todo
 *                 status:
 *                   type: string
 *                   description: The status of the todo
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the todo
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the todo
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/", todoController.addTodo);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the todo to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the todo
 *               status:
 *                 type: string
 *                 description: The status of the todo
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request, invalid input data
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", todoController.updateTodo);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the todo to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", todoController.deleteTodo);

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload todos from a CSV file
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file containing todos
 *     responses:
 *       200:
 *         description: Todos uploaded successfully
 *       500:
 *         description: Internal server error
 */
router.post("/upload", upload.single("file"), todoController.uploadTodos);

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download todos as a CSV file
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: A CSV file containing the list of todos
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
router.get("/download", todoController.downloadTodos);

/**
 * @swagger
 * /filter:
 *   get:
 *     summary: Filter todos by status
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         description: The status to filter todos by
 *         schema:
 *           type: string
 *           example: "completed"
 *     responses:
 *       200:
 *         description: A list of todos filtered by status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request, status query parameter is required
 *       500:
 *         description: Internal server error
 */
router.get("/filter", todoController.filterTodos);

module.exports = router;
