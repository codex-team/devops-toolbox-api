import mongoose from 'mongoose';

const workspaceSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true },
  servers: [{
    name: { type: String, required: true },
    token: String,
    services: [{
      type: { type: String },
      payload: mongoose.Schema.Types.Mixed,
    }],
  }],
});

export default mongoose.model('Workspace', workspaceSchema);
