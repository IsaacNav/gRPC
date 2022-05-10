import csvWriter from 'csv-write-stream';

module.exports = function createCsvStreamFile({ readableStream, headers }) {
  if (!readableStream || !headers)
    throw new Error('readableStream and headers are required');

  const csvStream = csvWriter({ headers });
  csvStream.pipe(readableStream);

  const write = (data) => {
    csvStream.write(data);
  };

  const done = () => {
    csvStream.end();
    csvStream.destroy();
  };

  return {
    stream: csvStream,
    write,
    done,
  };
};
