import fs from 'fs';
import YAML from 'yaml';

/**
 * Get information from workspaces configuration-file
 */
function getWorkspaces(): void {
  const file = fs.readFileSync('./workspaces.yml', 'utf-8');
  YAML.parse(file);
}
