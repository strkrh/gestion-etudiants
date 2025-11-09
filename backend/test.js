const bcrypt = require("bcrypt");

const plainPassword = "rehys";

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log("Hash généré :", hash);
});
