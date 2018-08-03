/**
 * Created by mamingjuan on 2018/1/2.
 */
module.exports = function (req, res, next) {
  req.method = "GET";
  next();
}
