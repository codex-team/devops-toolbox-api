import fs from 'fs';
import YAML from 'yaml';
import mongoose from 'mongoose';
const Workspace = require('./models/workspace');

/**
 * Connecting to mongodb
 */
function start(url = Config.dbUrl): void {
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
  const file = fs.readFileSync(Config.wsUrl, 'utf-8');
  const workspaces = (YAML.parse(file)).workspaces;

  workspaces.forEach((item: any) => {
    const workspace = new Workspace({
      name: item.name,
      authToken: item.authToken,
      servers: item.servers,
    });
    saveWorkspace(workspaces);
  });
}

/**
 * @param workspace
 * Send workspace information to database
 */
function saveWorkspace(workspace: any): void {
  try {
    workspace.save();
  } catch (e) {
    console.log(e);
  }
}

start();
