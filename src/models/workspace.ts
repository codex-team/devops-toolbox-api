import mongoose, { Schema, model } from 'mongoose';

const workspace = new Schema({
  name: { type: String, required: true },
  authToken: { type: String, required: true },
  servers: [{
    name: { type: String, required: true },
    token: String,
    services: [{
      type: { type: String },
      payload: mongoose.Schema.Types.Mixed,
    }],
  }],
});

module.exports = model('Workspace', workspace);
