const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { initializeDBConnection } = require("./db/db.connect.js")
const PORT = 4000 || 5000
const multer  = require('multer')
const {apiServerErrors} = require("./middleware/api-server-errors.js")
const {routeNotFound} = require("./middleware/404Handler.js")
const path = require('path')
const app = express();

initializeDBConnection();
  
app.use("/", express.static(path.join(__dirname, "public/images")))

app.use(cors());
app.use(express.json()); // for POST
app.use(morgan("common"));


const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, "public/images")
  },
  filename: (req, file, cb) => {
    cb(null, "astroconnect-image-"+file.originalname)
  }
})


const upload = multer({storage});
app.post("/upload", upload.single('file'), (req, res) => {
  try{
    return res.status(200).json("File uploaded successfully!")
  }
  catch(error){
    console.log("From here", error)
  }
})

app.get('/', (req, res) => {
  res.send('Welcome to AstroConnect API!')
});

app.use('/posts', require('./routes/posts.route'))
app.use('/user', require('./routes/user.route'))
app.use('/auth', require('./routes/auth.route'))

// Error Handler
app.use(apiServerErrors)
app.use(routeNotFound)

app.listen(PORT, () => {
  console.log(`AstroConnect API is listening at port ${PORT}`);
});