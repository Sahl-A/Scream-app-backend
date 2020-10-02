const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }
  // Decode token
  try {
    const decodedToken = jwt.verify(
      token,
      "SECRET KEY TO GENERATEE THE TOKEN<, SHOULD BE COMPLICATED"
    );
    if (!decodedToken)
      return res.status(403).json({ error: "Authorization Error" });
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Error while verifying token");
    res.status(403).json({ error: "Wrong Token" });
  }
};
