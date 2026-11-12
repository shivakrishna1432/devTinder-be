const userAuth = (req, res, next) => {
  const getToken = "xyz";
  const isToken = req.query.name === getToken;
  if (!isToken) {
    return res.status(401).send("User unauthorized!!");
  }
  next();
};

module.exports = { userAuth };
