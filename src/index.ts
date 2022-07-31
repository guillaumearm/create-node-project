#!/usr/bin/env node
import { Command } from 'commander';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import * as packageJson from '../package.json';

// const REPO_URL = 'git clone -b master https://github.com/guillaumearm/node-skeleton.git my-node-project'
const REPO_URL = 'https://github.com/guillaumearm/node-skeleton.git';

const runCommand = (cmd: string) => {
  console.log(cmd);
  return execSync(cmd);
};

const gitClone = (givenBranch: string, dest: string) => {
  const branch = givenBranch === 'base' ? 'master' : givenBranch;
  const cmd = `git clone -b "${branch}" "${REPO_URL}" "${dest}"`;

  return runCommand(cmd);
};

const program = new Command();

program
  .showHelpAfterError()
  .name(packageJson.cliName)
  .description('CLI skeleton description')
  .version(packageJson.version)
  .argument('<path>', 'new path of the project')
  .argument('[name]', 'project name')
  .option(
    '-t, --type [type]',
    "create a new node project - possible values are 'base', 'express', 'react' and 'cli'",
    'base',
  );

program.parse();

const dirPath: string = path.resolve(program.args[0] as string); // because it's mandatory
const projectName: string = program.args[1] ?? path.basename(dirPath);
const projectType = program.opts().type;

if (fs.existsSync(dirPath)) {
  console.error(`Error: '${dirPath}' already exists!`);
  process.exit(1);
}

// 1. Clone the project
try {
  gitClone(projectType, dirPath);
} catch (e) {
  console.error('Error: cannot git clone!');
  process.exit(1);
}

// 2. Remove .git folder
fs.rmSync(`${dirPath}/.git`, { recursive: true, force: true });

// 3. Update 'package.json' fields
const packageJsonPath = `${dirPath}/package.json`;
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const newPackageData = {
  ...packageData,
  name: projectName,
  version: '0.0.0',
  private: undefined,
  description: '',
  repository: undefined,
  bugs: undefined,
  homepage: undefined,
};

if (projectType === 'cli') {
  newPackageData.cliName = projectName;
  newPackageData.bin = { [projectName]: 'dist/index.js' };
}

fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageData, undefined, 2));
console.log(`> Updated package.json for project '${projectName}'`);

const originalCwd = process.cwd();
process.chdir(dirPath);

runCommand('npm install');
runCommand('npm run prettier');

process.chdir(originalCwd);
