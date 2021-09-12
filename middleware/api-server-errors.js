function apiServerErrors(err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({success: false, message: "Some error occured", errMessage: err.message})
}

module.exports = {apiServerErrors}