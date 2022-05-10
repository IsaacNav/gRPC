import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import es from 'event-stream';
import { doOperation, getContract, composeNewData } from './doOperation';

const filePath = path.join(process.cwd(), 'src', '/ReadFile/file.csv');

const streamFile = fs.createReadStream(filePath);
const rows = [];
const MAX_SIZE_BATCH = 50;

const saveBatch = (data) => {
  const config = {
    params: data,
    getContract,
    composeNewData,
  };
  return config;
};

const dispatchParallelPorcess = async (rowsConfig) => {
  const chunks = rowsConfig.splice(0, MAX_SIZE_BATCH);
  const chunkPromise = await chunks.map(doOperation);
  await Promise.all(chunkPromise);
  console.log(`Process ${MAX_SIZE_BATCH} contract`);
};

streamFile.pipe(csv()).pipe(
  es.through(function (row) {
    const esStream = this;
    const params = saveBatch(row);
    rows.push(params);
    if (rows.length === MAX_SIZE_BATCH) {
      esStream.pause();
      dispatchParallelPorcess(rows)
        .then(() => {
          esStream.resume();
        })
        .catch((error) => {
          console.log(error);
          esStream.resume();
        });
    }
  })
);
