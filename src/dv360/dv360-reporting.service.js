const logger = require('../../lib/logger').createLogger({ component: 'Dv360ReportingService' });
const { google } = require('googleapis');
// const _client = google.doubleclickbidmanager('v1.1');
const _client = google.doubleclickbidmanager('v2');

module.exports = class Dv360ReportingService {
  static async connect () {
    const auth = new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: ['https://www.googleapis.com/auth/doubleclickbidmanager']
    });

    // Acquire an auth client, and bind it to all future calls
    const auth_client = await auth.getClient();

    // logger.debug({ authClient: auth_client }, 'Auth client');

    google.options({ auth: auth_client });

    return _client;
  }

  static async getReport (params, options) {
    const requestBody = {
      metadata: {
        title: `Butelka ${new Date().toISOString()}`,
        dataRange: {
          range: 'CURRENT_DAY'
        }
      },
      params: {
        type: 'STANDARD',
        groupBys: ['FILTER_MEDIA_PLAN'],
        metrics: ['METRIC_IMPRESSIONS', 'METRIC_ACTIVE_VIEW_VIEWABLE_IMPRESSIONS', 'METRIC_BILLABLE_IMPRESSIONS', 'METRIC_GRP_CORRECTED_VIEWABLE_IMPRESSIONS','METRIC_CLICKS']
      },
      schedule: {
        frequency: 'ONE_TIME'
      }
    };

    logger.debug({ requestBody }, 'Create Report query');

    const { data: query } = await _client.queries.create({ requestBody })

    logger.debug({ query }, 'Created Report query');

    const { queryId } = query
    const { data: queryMetadata } = await _client.queries.run({ queryId })

    logger.debug({ queryMetadata, queryId }, 'Executed report query');

    const { data } = await _client.queries.reports.get(queryMetadata.key)

    logger.debug({ queryMetadata, data }, 'Getting report data');

    return data;
  }
}
