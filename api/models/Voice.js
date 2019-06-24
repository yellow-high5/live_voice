let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let VoiceSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'content required'],
    },
    emitter: {
      type: String,
      required: [true, 'emitter required'],
    },
    position_x: {
      type: Number,
      required: [true, 'position_x required'],
    },
    position_y: {
      type: Number,
      required: [true, 'position_y required'],
    },
    timestamp: {
      type: String,
      required: [true, 'timestamp required'],
    }
  }
)

VoiceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Voice', VoiceSchema);
