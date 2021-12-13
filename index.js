const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const multer = require('multer');

/* include controllers */
const homeController = require("./controllers/homeController");
const todoController = require("./controllers/todoController");
const dotenv = require('dotenv');

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ dest: '/public/uploads/' }).any());

/* Routes */
app.get('/', homeController.home);
app.get('/about', homeController.about);
app.get('/todos', todoController.list);
app.get('/todosOrdered', todoController.listOrdered);
app.post('/todos', todoController.add);
app.get('/todos/delete/:id', todoController.delete);
app.get('/todos/update/:id/:state', todoController.update);

app.use(express.static("public"));
//app.listen(3000);

PORT = process.env.NODE_DOCKER_PORT || 8080;
//PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});