import {readFile} from 'fs/promises';

const readFileThatMayNotExist = async function(path, options) {
  try {
    return await readFile(path, options);
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

const readJsonFileThatMayNotExist = async function(path, options) {
  const fileContents = await readFileThatMayNotExist(path, options);

  if (!fileContents) {
    return null;
  }

  const parsedFileContents = JSON.parse(fileContents);

  return parsedFileContents;
};

export {
  readFileThatMayNotExist,
  readJsonFileThatMayNotExist,
};
