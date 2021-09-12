function routeNotFound(req, res, next) {
  res.status(404).json({success: false, message:"Couldn't find the requested data"})
}

module.exports = {routeNotFound}