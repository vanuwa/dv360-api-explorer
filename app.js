const logger = require('./lib/logger');
const Service = require('./src/service');

(async function () {
  // await Service.connect();

  const start_time = process.hrtime();

  try {
    const data = await Service.execute();

    logger.debug({ data }, 'Result');
  } catch (err) {
    logger.error({ err }, 'Oops');
  } finally {
    const end_time = process.hrtime(start_time);
    const seconds = end_time[0];
    const milliseconds = end_time[1] / 1000000;

    logger.info('Execution time: %ds %dms', seconds, milliseconds);
  }
}());
