let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let Voice = require("./Voice");
let Member = require("./Member");

let LiveSchema = new Schema({
  channel: {
    type: String,
    require: [true, "channel required"],
    unique: true
  },
  title: {
    type: String,
    require: [true, "title required"]
  },
  voices: [
    {
      type: Schema.ObjectId,
      ref: "Voice",
      index: true
    }
  ],
  performer: {
    type: Schema.ObjectId,
    ref: "Member",
    require: [true, "performer required"],
    default: null
  }
});

LiveSchema.plugin(uniqueValidator);

LiveSchema.methods.addVoice = async function(voice_id) {
  await this.voices.push(voice_id);
  return this.save();
};

LiveSchema.methods.definePerformer = async function(member_id) {
  this.performer = await member_id;
  return this.save();
};

module.exports = mongoose.model("Live", LiveSchema);
