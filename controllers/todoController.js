const TodoItem = require("../models/TodoItem");
const csv = require("csv-parser");
const { Readable } = require("stream");
const multer = require("multer");
const { format } = require("@fast-csv/format");

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.getTodos = async (req, res) => {
  try {
    const todos = await TodoItem.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await TodoItem.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTodo = async (req, res) => {
  try {
    const newTodo = new TodoItem(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await TodoItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTodo)
      return res.status(404).json({ message: "Todo item not found" });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await TodoItem.findByIdAndDelete(req.params.id);
    if (!deletedTodo)
      return res.status(404).json({ message: "Todo item not found" });
    res.status(200).json({ message: "Todo item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadTodos = async (req, res) => {
  try {
    const results = [];
    const fileBuffer = req.file.buffer;

    const readableFile = new Readable();
    readableFile._read = () => {};
    readableFile.push(fileBuffer);
    readableFile.push(null);

    readableFile
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          await TodoItem.insertMany(results);
          res.json({ msg: "Todos uploaded successfully" });
        } catch (insertError) {
          res.status(500).json({ message: insertError.message });
        }
      });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.downloadTodos = async (req, res) => {
  try {
    const todos = await TodoItem.find();
    const csvStream = format({ headers: true });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=todo_list.csv");

    csvStream.pipe(res).on("end", () => res.end());
    todos.forEach((todo) => {
      csvStream.write({ description: todo.description, status: todo.status });
    });
    csvStream.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterTodos = async (req, res) => {
  const { status } = req.query;
  try {
    if (!status) {
      return res
        .status(400)
        .json({ message: "Status query parameter is required" });
    }
    const todos = await TodoItem.find({ status });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
