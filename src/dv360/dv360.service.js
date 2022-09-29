const logger = require('../../lib/logger').createLogger({ component: 'Dv360Service' });
const { google } = require('googleapis');
const _client = google.displayvideo('v1');

const DEFAULT_CREATIVE_SCHEMA = require('./models/creative.dv360.default');
const DEFAULT_CAMPAIGN_SCHEMA = require('./models/campaign.dv360.default');
const DEFAULT_INSERTION_ORDER_SCHEMA = require('./models/insertion-order.dv360.default');
const { partnerRevenueModel } = require("./models/line-item.dv360.default");

const PARTNER_ID = 6151232; // Inskin
const ADVERTISER_ID = 999718697; // Inskin

const TARGETING_TYPES = ['TARGETING_TYPE_APP', 'TARGETING_TYPE_URL', 'TARGETING_TYPE_DEVICE_TYPE', 'TARGETING_TYPE_ENVIRONMENT', 'TARGETING_TYPE_GEO_REGION', 'TARGETING_TYPE_GEO_REGION']

// const CAMPAIGN_ID = 52536685;
const CAMPAIGN_ID = 52537115;
const INSERTION_ORDER_ID = 1008571120;

// Azerion
// const PARTNER_ID = 1743072; // Azerion
// const ADVERTISER_ID = 1071649918; // Azerion

// End of Azerion

module.exports = class Dv360Service {
  static async connect () {
    const auth = new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: [
        'https://www.googleapis.com/auth/display-video',
        'https://www.googleapis.com/auth/display-video-mediaplanning'
      ]
    });

    // Acquire an auth client, and bind it to all future calls
    const auth_client = await auth.getClient();

    // logger.debug({ authClient: auth_client }, 'Auth client');

    google.options({ auth: auth_client });

    return _client;
  }

  static async test () {

    const campaign_id = 52561183 || CAMPAIGN_ID;

    await Dv360Service.getAdvertiser();
    // await Dv360Service.createAdvertiserCreative();
    await Dv360Service.getAdvertiserCreatives();


    // const campaign = Dv360Service.modelCampaign('2022-08-05', '2022-08-20', 1);
    // const created_campaign = await Dv360Service.createCampaign(campaign);
    //
    // logger.debug({ created_campaign }, 'Created campaign');

    // const insertion_order = await Dv360Service.createInsertionOrder(campaign_id, 1, '2022-08-05', '2022-08-20');

    // logger.debug({ insertion_order }, 'Insertion Order');

    // const line_item = await Dv360Service.createLineItem(campaign_id);

    // logger.debug({ line_item }, 'Line Item');

    // const line_items = await Dv360Service.getLineItems(campaign_id);

    // logger.debug({ line_items }, 'Line Items');

    // logger.debug({ campaigns: await Dv360Service.getCampaigns(ADVERTISER_ID) }, 'Campaigns BEFORE deleting');
    //
    // const archived_campaign = await Dv360Service.archiveCampaign(campaign_id);
    //
    // logger.debug({ archived_campaign }, 'Archived Campaign');
    //
    // const deleted_campaign = await Dv360Service.deleteCampaign(campaign_id);
    //
    // logger.debug({ deleted_campaign }, 'Deleted Campaign');

    // logger.debug({ campaigns: await Dv360Service.getCampaigns(ADVERTISER_ID) }, 'Campaigns');

    return { ok: true };
  }

  static async getAdvertisers (partner_id = PARTNER_ID) {
    let pageToken = null
    let advertisers = []

    do {
      const { data } = await _client.advertisers.list({
        partnerId: PARTNER_ID,
        ...(pageToken ? { pageToken } : {})
      });

      pageToken = data.nextPageToken

      logger.debug({ PARTNER_ID, data }, 'DATA');

      advertisers = advertisers.concat(data.advertisers)
    } while (pageToken)

    logger.debug({ PARTNER_ID, advertisers }, 'Advertisers');

    return advertisers;
  }

  static async getAdvertiser (advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.get({ advertiserId: advertiser_id });

    logger.debug({ advertiser_id, advertiser: data }, 'Advertiser');

    return data;
  }

  static async getAdvertisersCampaigns (partner_id = PARTNER_ID) {
    logger.debug({ partner_id }, '[ getAdvertisersCampaigns ]');

    const advertisers = await Dv360Service.getAdvertisers(partner_id);

    logger.debug({ partner_id, advertisers }, '[ getAdvertisersCampaigns ] Advertisers detected');

    const ids = advertisers.map(({ advertiserId }) => advertiserId);
    let campaigns = []

    for (let i = 0; i < ids.length; i++) {
      campaigns = campaigns.concat((await Dv360Service.getCampaigns(ids[i])) || []);
    }

    logger.debug({ partner_id, campaigns }, '[ getAdvertisersCampaigns ]');

    return campaigns;
  }

  static async getAdvertiserCreatives (advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.creatives.list({ advertiserId: advertiser_id });

    logger.debug({ advertiser_id, creatives: data }, 'Creatives');

    return data;
  }

  static createCreative (dto = {}) {
    return this.createAdvertiserCreative();
  }

  static async getCreative (creative_id, advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.creatives.get({
      advertiserId: advertiser_id,
      creativeId: creative_id
    });

    logger.debug({ advertiser_id, creative_id, creative: data }, 'Creative');

    return data;
  }

  static async createAdvertiserCreative (advertiser_id = ADVERTISER_ID) {
    const entity = { ... DEFAULT_CREATIVE_SCHEMA };

    const { data } = await _client.advertisers.creatives.create({
      advertiserId: ADVERTISER_ID,
      requestBody: entity
    });

    logger.debug({ advertiser_id, entity, creative: data }, 'Creative created.');

    return data;
  }

  static modelCampaign (start_date, end_date, budget, currency = 'eur') {
    const campaign = { ... DEFAULT_CAMPAIGN_SCHEMA };

    campaign.campaignGoal.performanceGoal.performanceGoalAmountMicros = budget * 1000000;
    campaign.campaignFlight.plannedDates.startDate = formatDate(start_date);
    campaign.campaignFlight.plannedDates.endDate = formatDate(end_date);

    return campaign;
  }

  static async getCampaigns (advertiser_id = ADVERTISER_ID) {
    let pageToken = null
    let campaigns = []

    try {
      do {
        const {data} = await _client.advertisers.campaigns.list({
          advertiserId: advertiser_id,
          ...(pageToken ? {pageToken} : {})
        });

        pageToken = data.nextPageToken

        logger.debug({advertiser_id, data}, 'DATA');

        campaigns = campaigns.concat(data.campaigns || [])
      } while (pageToken)
    } catch (error) {
      logger.error(error)

      logger.warn(`Oops. Can not get campaigns for ${advertiser_id}`)
    }

    logger.debug({ advertiser_id, campaigns }, 'Campaigns');

    return campaigns;
  }

  static async getLineItems (campaign_id = CAMPAIGN_ID, advertiser_id = ADVERTISER_ID) {
    let pageToken = null
    let rows = []

    try {
      do {
        const { data } = await _client.advertisers.lineItems.list({
          advertiserId: advertiser_id, filter: `campaignId = ${campaign_id}`,
          ...(pageToken ? {pageToken} : {})
        });

        pageToken = data.nextPageToken

        logger.debug({ advertiser_id, data }, 'DATA');

        rows = rows.concat(data.lineItems || [])
      } while (pageToken)
    } catch (error) {
      logger.error(error)

      logger.warn(`Oops. Can not get lineItems for ${advertiser_id}, filtered by campaign ${campaign_id}`)
    }


    logger.debug({ advertiser_id, rows }, `getLineItems: ${rows?.length} rows`)

    return rows;
  }

  static async createCampaign (campaign_model = DEFAULT_CAMPAIGN_SCHEMA, advertiser_id = ADVERTISER_ID) {
    const res = await _client.advertisers.campaigns.create({
      advertiserId: advertiser_id,
      requestBody: campaign_model
    });

    return res.data;
  }

  static async getCampaign (campaign_id, advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.campaigns.get({
      advertiserId: advertiser_id,
      campaignId: campaign_id
    });

    logger.debug({ advertiser_id, campaign_id, campaign: data }, 'Campaign');

    return data;
  }

  static async archiveCampaign (campaign_id = CAMPAIGN_ID) {
    const res = await _client.advertisers.campaigns.patch({
      advertiserId: ADVERTISER_ID,
      campaignId: campaign_id,
      updateMask: 'entityStatus',
      requestBody: {
        entityStatus: 'ENTITY_STATUS_ARCHIVED'
      }
    });

    return res.data;
  }

  static async deleteCampaign (campaign_id = CAMPAIGN_ID) {
    const res = await _client.advertisers.campaigns.delete({
      advertiserId: ADVERTISER_ID,
      campaignId: campaign_id
    });

    return res.data;
  }

  static async createInsertionOrder (campaign_id = CAMPAIGN_ID, budget = 1, start_date, end_date) {
    const entity = { ... DEFAULT_INSERTION_ORDER_SCHEMA };

    entity.campaignId = campaign_id;
    entity.performanceGoal.performanceGoalAmountMicros = budget * 1000000;
    entity.budget.budgetSegments = [{ // we have only one budget segment
      budgetAmountMicros: budget * 1000000,
      dateRange: {
        startDate: formatDate(start_date),
        endDate: formatDate(end_date)
      }
    }];

    const res = await _client.advertisers.insertionOrders.create({
      advertiserId: ADVERTISER_ID,
      requestBody: entity
    });

    return res.data;
  }

  static async getInsertionOrders () {
    const { data } = await _client.advertisers.insertionOrders.list();

    logger.debug({ insertion_orders: data }, 'Insertion Orders');

    return data;
  }

  static async getInsertionOrder (insertion_order_id, advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.insertionOrders.get({
      advertiserId: advertiser_id,
      insertionOrderId: insertion_order_id
    });

    logger.debug({ advertiser_id, insertion_order_id, insertion_order: data }, 'Insertion Order');

    return data;
  }

  static async createLineItem (campaign_id = CAMPAIGN_ID, insertion_order_id = INSERTION_ORDER_ID) {
    const res = await _client.advertisers.lineItems.create({
      advertiserId: ADVERTISER_ID,
      requestBody: {
        advertiserId: ADVERTISER_ID,
        campaignId: campaign_id,
        insertionOrderId: insertion_order_id,
        displayName: 'Gelato Uno',
        lineItemType: 'LINE_ITEM_TYPE_DISPLAY_DEFAULT',
        entityStatus: 'ENTITY_STATUS_DRAFT', // after creation, we could set ENTITY_STATUS_ACTIVE
        flight: {
          flightDateType: 'LINE_ITEM_FLIGHT_DATE_TYPE_CUSTOM',
          dateRange: {
            startDate: {
              year: 2022,
              month: 7,
              day: 26
            },
            endDate: {
              year: 2022,
              month: 8,
              day: 10
            }
          }
        },
        budget: {
          budgetAllocationType: 'LINE_ITEM_BUDGET_ALLOCATION_TYPE_FIXED',
          maxAmount: 150000
        },
        pacing: {
          pacingPeriod: 'PACING_PERIOD_FLIGHT',
          pacingType: 'PACING_TYPE_EVEN',
          // dailyMaxMicros: 1500000
        },
        frequencyCap: {
          unlimited: true
        },
        partnerRevenueModel: {
          markupType: 'PARTNER_REVENUE_MODEL_MARKUP_TYPE_CPM',
          markupAmount: 1500000
        },
        conversionCounting: {
          postViewCountPercentageMillis: 0
        },
        // conversionCounting: {
        //   postViewCountPercentageMillis: 0,
        //   floodlightActivityConfigs: []
        // },
        bidStrategy: {
          performanceGoalAutoBid: {
            performanceGoalType: 'BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM',
            performanceGoalAmountMicros: 100000000
          }
        },
        integrationDetails: {
          integrationCode: 'azerion_campaign_id',
          details: 'b98be92c-d664-4e0a-bb69-2535eeb798f6'
        }
      }
    });

    return res.data;
  }

  static async getLineItem (line_item_id, advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.lineItems.get({
      advertiserId: advertiser_id,
      lineItemId: line_item_id
    });

    logger.debug({ advertiser_id, line_item_id, line_item: data }, 'LineItem');

    return data;
  }

  static async getLineItemAssignedTargetingOptions (line_item_id, targetingTypes = TARGETING_TYPES, advertiser_id = ADVERTISER_ID) {
    let assignedOptions = []

    for (let i = 0; i < targetingTypes.length; i++) {
      const { data } = await _client.advertisers.lineItems.targetingTypes.assignedTargetingOptions.list({
        advertiserId: advertiser_id,
        lineItemId: line_item_id,
        targetingType: targetingTypes[i]
      })

      assignedOptions = assignedOptions.concat(data.assignedTargetingOptions || [])
    }

    logger.debug({ advertiser_id, line_item_id, targetingTypes, assignedOptions }, 'getLineItemAssignedTargetingOptions');
  }

  static async searchTargetingOptions(term, targeting_type = 'TARGETING_TYPE_ENVIRONMENT', advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.targetingTypes.targetingOptions.search({
      targetingType: targeting_type,
      requestBody: {
        advertiserId: advertiser_id,
        geoRegionSearchTerms: {
          geoRegionQuery: term
        }
      }
    })

    const targeting_options = data.targetingOptions || data

    logger.debug({ advertiser_id, targeting_type, term, targeting_options }, 'Search Targeting Options');

    return targeting_options;
  }


  static async createLineItemTargetingOptions (line_item_id, targeting_type = 'TARGETING_TYPE_ENVIRONMENT', advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.lineItems.targetingTypes.assignedTargetingOptions.create({
      advertiserId: advertiser_id,
      lineItemId: line_item_id,
      targetingType: targeting_type,
      requestBody: {
        geoRegionDetails: {
          geoRegionType: 'GEO_REGION_TYPE_COUNTRY',
          targetingOptionId: '2250'
        }
        // environmentDetails: {
        //   environment: 'ENVIRONMENT_WEB_OPTIMIZED'
        // }
      }
    })

    logger.debug({ advertiser_id, line_item_id, targeting_type, targeting_options: data }, 'Create Linet Item Targeting Options');

    return data;
  }

  static async createLineItemAppTargetingOptions (line_item_id, appId, advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.lineItems.targetingTypes.assignedTargetingOptions.create({
      advertiserId: advertiser_id,
      lineItemId: line_item_id,
      targetingType: 'TARGETING_TYPE_APP',
      requestBody: {
        appDetails: {
          appId: appId.toString()
        }
      }
    })

    logger.debug({ advertiser_id, line_item_id, data }, 'createLineItemAppTargetingOptions');

    return data;
  }

  static async getLineItemTargetingOptions (line_item_id, targeting_type = 'TARGETING_TYPE_ENVIRONMENT', advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.advertisers.lineItems.targetingTypes.assignedTargetingOptions.list({
      advertiserId: advertiser_id,
      lineItemId: line_item_id,
      targetingType: targeting_type
    })

    logger.debug({ advertiser_id, targeting_options: data }, 'Targeting Options');

    return data;
  }

  static async getTargetingOptions (targeting_type = '', advertiser_id = ADVERTISER_ID) {
    const { data } = await _client.targetingTypes.targetingOptions.list({
      advertiserId: advertiser_id,
      targetingType: targeting_type
    })

    logger.debug({ advertiser_id, targeting_type, targeting_options: data }, 'Targeting Options');

    return data;
  }
};

function formatDate(date) {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-');

    return { year, month, day };
  }

  if (Object.prototype.toString.call(date) === '[object Date]') {
    const [year, month, day] = date.toISOString().split('T')[0].split('-');

    return { year, month, day };
  }

  throw new Error('Can not format date');
}
