import fs from 'fs';
import YAML from 'yaml';
import mongoose from 'mongoose';
const Workspace = require('./models/workspace');

/**
 * Connecting to mongodb
 */
function start(): void {
  try {
    const url = 'mongodb+srv://xema:wCyPjqzoe7JRiGUX@cluster0.nxtjs.mongodb.net/workspaces';

    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log(e);
  }

  getWorkspaces();
}

/**
 * Get information from workspaces configuration-file
 */
function getWorkspaces(): void {
  const file = fs.readFileSync('./workspaces.yml', 'utf-8');
  YAML.parse(file);
}
