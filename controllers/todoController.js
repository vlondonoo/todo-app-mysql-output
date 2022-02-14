const { TodoModel } = require('../db/sequelize');
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');

const serviceKey = path.join(__dirname, '../todoapp-340315-afea0b69e558.json');
let gcStorage = new Storage({
  keyFilename: serviceKey,
  projectId: 'todoapp-340315'
});
const bucket = gcStorage.bucket('todo-images');
let fileName = '';

exports.list = async function (req, res) {
  const todos = await TodoModel.findAll();
  res.render("todo/list", { todos: todos });
}

exports.listOrdered = async function (req, res) {
  const todos = await TodoModel.findAll({ order: [['message', 'ASC'],], });
  res.render("todo/list", { todos: todos });
}

exports.add = async (req, res) => {
  const newTodo = await TodoModel.create({
    message: req.body.message,
    state: "OPEN",
    image: "",
  });

  const fileToUpload = req.files[0];

  // GCP Storage
  fileToUpload.buffer = fs.readFileSync(fileToUpload.path);
  const { originalname, buffer } = fileToUpload;

  const blob = bucket.file(originalname.replace(/ /g, "_"));
  const blobStream = blob.createWriteStream({
    resumable: false
  });
  console.log('Name to be saved ', blob.name);
  this.fileName = blob.name;
  blobStream.on('finish', () => {
    const bucketUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    console.log('finish sucess', bucketUrl);
  })
    .on('error', e => {
      console.log('Error ', e);
    })
    .end(buffer);

  // Local save
  if (fileToUpload) {
    const oldpath = fileToUpload.path;
    const dirPath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
    newpath = dirPath + newTodo.id + ".jpg";
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    newTodo.image = newTodo.id + ".jpg";
    await newTodo.save({ fields: ['image'] });
  }

  return res.redirect("/todos");
};

exports.delete = async (req, res) => {
  // bucket
  // const fileName = 'Screenshot_2022-01-30_021753.png';

  bucket.file(this.fileName)
    .delete()
    .catch(console.error);

  console.log(`gs://${bucket.name}/${this.fileName} deleted`);


  // local save
  const id = req.params.id;
  await TodoModel.destroy({ where: { id: id } });
  const imagePath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
  newpath = imagePath + id + ".jpg";
  try {
    fs.unlinkSync(newpath) //file removed
  } catch (err) {
    //nothing
  }

  res.redirect("/todos");
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const state = req.params.state;
  const updatedTodo = {
    state
  };

  await TodoModel.update(updatedTodo, { where: { id: id } });
  res.redirect("/todos");
};
