import fs from 'fs';
import YAML from 'yaml';
import mongoose from 'mongoose';
import Config from './config';
import ConfigData from './types/workspaceConfig';
import WorkspaceModel from './database/models/workspace';
import Workspace from './types/workspace';

/**
 * Connecting to mongodb
 *
 * @param url - Url of database with workspaces
 */
async function start(url: string = Config.dbUrl): Promise<void> {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Send workspace information to database
 *
 * @param workspace - Object, contain information of workspace
 */
function saveWorkspace(workspace: Workspace): void {
  try {
    workspace.save();
  } catch (e) {
    console.log(e);
  }
}

/**
 * Get information from workspaces configuration-file
 */
function getWorkspaces(): void {
  const file = fs.readFileSync(Config.workspacesConfigPath, 'utf-8');
  const workspaces = (YAML.parse(file) as ConfigData).workspaces;

  workspaces.forEach((item) => {
    const workspace = new WorkspaceModel({
      name: item.name,
      authToken: item.authToken,
      servers: item.servers,
    });

    saveWorkspace(workspace);
  });
}

start().then(() => getWorkspaces());
