import fs from 'fs';
import YAML from 'yaml';
import mongoose from 'mongoose';
import Config from './config';
import Workspace from './database/models/workspace';
import { type } from "os";

/**
 * Connecting to mongodb
 * @param url
 */
function start(url = Config.dbUrl): void {
  try {
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
    saveWorkspace(workspace);
  });
}

/**
 * Send workspace information to database
 * @param workspace
 */
function saveWorkspace(workspace: any): void {
  try {
    workspace.save();
  } catch (e) {
    console.log(e);
  }
}

start();
