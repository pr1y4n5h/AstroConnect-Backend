const mongoose = require("mongoose");
const mySecret = process.env['myDBuri']
const moment = require("moment");

var curTime = moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')

function initializeDBConnection() {
mongoose.connect(mySecret, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useFindAndModify: false,
  // useCreateIndex: true,

})
.then(() => console.log("Successfully Connected at", curTime) )
.catch(error => console.error("mongoose connection failed", error))
}

module.exports = { initializeDBConnection }