const logger = require('../lib/logger').createLogger({ component: 'Service' });
const Platform = require('./platform');
const Dv360 = require('./dv360/dv360.service');
const Dv360Reporting = require('./dv360/dv360-reporting.service');

class Service {
  static async execute () {
    logger.debug('Executing...');

    // Service.createCorsRegExp('https://console.360yielddev.com/')
    // Service.createCorsRegExp('https://console-api.360yielddev.com/')

    const platform = new Platform(Dv360);

    await platform.connect();

    // const advertiser = await platform.getAdvertisers();
    //
    // logger.debug(`Advertiser: ${advertiser.length} rows`);
    // const campaigns = await platform.getAdvertisersCampaigns(6151232);

    // Service.printInfoAboutAdvertisersCampaigns(campaigns);


    // await platform.getCampaign(52609656);
    // await platform.getCampaigns(999718697);

    // await platform.getInsertionOrder(1008862747);

    // await platform.getLineItems(52701690, 999718697);

    // await platform.getLineItem(18372456133);
    // await platform.getLineItemAssignedTargetingOptions(18372456133, ['TARGETING_TYPE_APP'])
    // await platform.createLineItemAppTargetingOptions(18372456133, 362732592462)
    // await platform.getLineItem(18142496104);
    await platform.getTargetingOptions('TARGETING_TYPE_DEVICE_TYPE');

    // await platform.searchGeoTargetingOptions('Poland')

    // await platform.createLineItemTargetingOptions(18142496104, 'TARGETING_TYPE_ENVIRONMENT')
    // await platform.createLineItemTargetingOptions(18145603645, 'TARGETING_TYPE_GEO_REGION')
    // await platform.getLineItemTargetingOptions(18142496104, 'TARGETING_TYPE_DEVICE_TYPE')
    // await platform.getLineItemTargetingOptions(18145603645, 'TARGETING_TYPE_GEO_REGION')

    // await platform.createCreative();

    // await platform.getCreative(439570491);

    // REPORTING

    // await Service.buildReport()

    // await Dv360Reporting.connect();
    // const { key } = await Dv360Reporting.createReport();

    // const key = {
    //   queryId: 1002164793,
    //   reportId: 3847277868
    // }

    // const key = {
    //   queryId: 1001932101,
    //   reportId: 3846496078
    // }

    // let url = ''
    // let is_done = false
    // for (let i = 0; i < 10 && is_done === false; i++) {
    //   const { metadata } = await Dv360Reporting.getReport(key)
    //
    //   is_done = metadata?.status?.state === 'DONE'
    //
    //   logger.debug({ key, metadata, isDone: is_done, i }, 'getReport')
    //
    //   url = is_done ? metadata?.googleCloudStoragePath : url
    // }

    // let url = 'https://storage.googleapis.com/dfa_-b8d7cf41be5eb53420e455d913fdfab19a164cc3/Butelka_2022-09-21T115129099Z_20220921_115130_1002291240_3847549476.csv?GoogleAccessId=573983893819-acfst5i6ba5a02rsdrjlpcfbq9k169sm@developer.gserviceaccount.com&Expires=1668945093&Signature=aDb4yPESkfl%2BqOmWYpxFF4UsYhbdQdgiCW8JDMgHrwrvSRH5SXbQfWvSFNVRq8gnSe9nVdk6E11Q4WGAFYL3fM%2B4UC0huAO5eWU%2BQgatJ10yiC9LpaoO3%2B%2FjmqbKaz4XuX3vv3Vwn0EnDkwMoeeygiwI1wcq8al%2F6S326%2BY%2BQN8%3D'

    // if (url && url.length) {
    //   await Dv360Reporting.downloadReportData(url)
    // }
    // const url = 'https://storage.googleapis.com/dfa_-b8d7cf41be5eb53420e455d913fdfab19a164cc3/Butelka_2022-09-20T143352138Z_20220920_143354_1001919569_3846478130.csv?GoogleAccessId=573983893819-acfst5i6ba5a02rsdrjlpcfbq9k169sm@developer.gserviceaccount.com&Expires=1668868436&Signature=R9iJQfrXfHz%2B5ZY3Trnzlq5WyZcusWSeLLbJmD0nWJUGewGxKtGqvbu7HBIs9iY1QVSLYtmjmwy1%2Bz7DAIkZpN6hUp%2BXea%2FGRf72iCxR9B5rucdx5eVZsO6mMH%2BjbyEqh7w1Su8RKh2v8t%2BmljnEEMav86IK68oJjuS4hAxYxCc%3D'
    // await Dv360Reporting.downloadReportData(metadata.googleCloudStoragePath)

    logger.debug('Executed.');

    return { ok: true };
  }

  static async buildReport () {
    await Dv360Reporting.connect();
    const { key } = await Dv360Reporting.createReport();

    let url = ''
    let is_done = false
    for (let i = 0; i < 10 && is_done === false; i++) {
      const { metadata } = await Dv360Reporting.getReport(key)

      is_done = metadata?.status?.state === 'DONE'

      logger.debug({ key, metadata, isDone: is_done, i }, 'getReport')

      url = is_done ? metadata?.googleCloudStoragePath : url
    }

    if (url && url.length) {
      await Dv360Reporting.downloadReportData(url)
    }
  }

  static printInfoAboutAdvertisersCampaigns (campaigns) {
    const stats = campaigns.reduce((_, { entityStatus, campaignFlight } = {}) => {
      _.status[entityStatus] = _.status[entityStatus] || 0;
      _.status[entityStatus]++;

      if (campaignFlight && campaignFlight.plannedDates && campaignFlight.plannedDates.startDate) {
        const { year, month, day } = campaignFlight.plannedDates.startDate;

        _.dates.push(new Date(`${year}-${month}-${day}`));
      }

      if (campaignFlight && campaignFlight.plannedDates && campaignFlight.plannedDates.endDate) {
        const { year, month, day } = campaignFlight.plannedDates.endDate;

        _.dates.push(new Date(`${year}-${month}-${day}`));
      }

      return _;
    }, { status: {}, dates: [] })

    if (stats.dates && stats.dates.length) {
      stats.min_date = new Date(Math.min.apply(null, stats.dates));
      stats.max_date = new Date(Math.max.apply(null, stats.dates));
    }

    stats.campaigns_amount = campaigns.length;

    logger.debug({ stats }, 'Advertiser Campaigns Info');
  }

  static createCorsRegExp(domain) {
    const term = domain.replace(/\./gi, '\\.');
    const regex = new RegExp(`https?:\/\/(([^/]+\.)?${term})\/?$`, 'gi');

    logger.debug({ domain, term, regex }, `createCorsRegExp = " ${regex.toString()} "`);
  }
}

module.exports = Service;
