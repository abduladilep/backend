const JWT = require("jsonwebtoken");

const validateUserToken = async (req, res, next) => {
  try {
    if (req.headers["x-custom-header"]) {
      const token = req.headers["x-custom-header"];
      try {
        const decode = JWT.verify(token, "secret123");
        const userId = decode.id;
        if (userId) {
          // Attach the userId to the request object for future use
          req.userId = userId;
          next();
        } else {
          return res.status(401).send({ errormsg: "Invalid user ID" });
        }
      } catch (err) {
        console.log(err);
        return res.status(401).send({ errormsg: "Invalid token" });
      }
    } else {
      return res.status(401).send({ errormsg: "Missing token" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ errormsg: "Internal server error" });
  }
};

module.exports = { validateUserToken };

module.exports={validateUserToken}