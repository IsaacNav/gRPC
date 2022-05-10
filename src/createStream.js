import express from 'express';
import createCSVStreamFile from './createCSVStreamFile';
import { writeData } from './asyncProcess';

const app = express();

app.get('/stream', async (req, res, next) => {
  const headers = ['firstName', 'lastName'];
  const reportName = 'reporteDeVentas';

  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment;filename=${reportName}.csv`);

  const streamFile = createCSVStreamFile({ readableStream: res, headers });
  writeData(streamFile.write)
    .then(() => {
      streamFile.done();
    })
    .catch((err) => {
      streamFile.done();
      next(err);
    });
});

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
