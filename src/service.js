const logger = require('../lib/logger').createLogger({ component: 'Service' });
const Platform = require('./platform');
const Dv360 = require('./dv360/dv360.service');
const Dv360Reporting = require('./dv360/dv360-reporting.service');

const DV360_PARTNER_ID = 6151232;

class Service {
  static async execute () {
    logger.debug('Executing...');

    const platform = new Platform(Dv360);

    await platform.connect();

    // await platform.getAdvertisers()
    const campaigns = await platform.getAdvertisersCampaigns(DV360_PARTNER_ID);

    Service.printInfoAboutAdvertisersCampaigns(campaigns);


    // await platform.getCampaign(52609656);

    // await platform.getInsertionOrder(1008862747);

    // await platform.getLineItem(18084492886);
    // await platform.getLineItem(18142496104);
    // await platform.getTargetingOptions('TARGETING_TYPE_GEO_REGION');

    // await platform.searchGeoTargetingOptions('Netherlands')

    // await platform.createLineItemTargetingOptions(18142496104, 'TARGETING_TYPE_ENVIRONMENT')
    // await platform.createLineItemTargetingOptions(18145603645, 'TARGETING_TYPE_GEO_REGION')
    // await platform.getLineItemTargetingOptions(18142496104, 'TARGETING_TYPE_DEVICE_TYPE')
    // await platform.getLineItemTargetingOptions(18145603645, 'TARGETING_TYPE_GEO_REGION')

    // await platform.createCreative();

    // await platform.getCreative(439570491);

    // await Dv360Reporting.connect();
    // await Dv360Reporting.getReport();



    logger.debug('Executed.');

    return { ok: true };
  }

  static printInfoAboutAdvertisersCampaigns (campaigns) {
    const stats = campaigns.reduce((_, { entityStatus, campaignFlight }) => {
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

    logger.debug({ stats }, 'Advertiser Campaigns Info')
  }
}

module.exports = Service;
