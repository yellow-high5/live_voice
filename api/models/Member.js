let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let MemberSchema = new Schema({
  name: {
    type: String,
    require: [true, "name required"]
  },
  socket: {
    type: String
  }
});

MemberSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Member", MemberSchema);
