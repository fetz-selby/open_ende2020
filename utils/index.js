exports.secret = "thequickfoxjumpedoverthelazydog";
exports.getHash = function(password) {
  const crypto = require("crypto");
  const secret = "thequickfoxjumpedoverthelazydog";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
  return hash;
};
