import fs from 'fs';
import { join } from 'path';

const dataDirectory = join(process.cwd(), '_data');

function getFilePath(fileName: string) {
  return join(dataDirectory, `${fileName}.json`);
}

function getFilePaths() {
  return fs
    .readdirSync(join(dataDirectory))
    .filter((path) => /\.json$/.test(path));
}

export function getFileSlugs() {
  const filePaths = getFilePaths();
  return filePaths.map((filePath) => filePath.replace(/\.json$/, ''));
}

export function getData(fileName: string) {
  const filePath = getFilePath(fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function addData(fileName: string, data: any) {
  const filePath = getFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

export function renameFile(fileName: string, newFileName: string) {
  const filePath = getFilePath(fileName);
  const newFilePath = getFilePath(newFileName);
  fs.renameSync(filePath, newFilePath);
}

export function deleteData(fileName: string) {
  const filePath = getFilePath(fileName);
  fs.unlinkSync(filePath);
}
