import fs from 'fs';
import path from 'path';

const dataPath = (filename) => path.join(process.cwd(), 'data', `${filename}.json`);

export const getData = (filename) => {
  try {
    const data = fs.readFileSync(dataPath(filename), 'utf8');
    return JSON.parse(data)[filename];
  } catch (err) {
    console.error(`Error reading ${filename}.json:`, err.message);
    return [];
  }
};

export const saveData = (filename, data) => {
  try {
    const jsonData = JSON.stringify({ [filename]: data }, null, 2);
    fs.writeFileSync(dataPath(filename), jsonData, 'utf8');
  } catch (err) {
    console.error(`Error saving to ${filename}.json:`, err.message);
  }
};
