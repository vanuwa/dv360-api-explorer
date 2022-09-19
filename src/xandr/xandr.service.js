const logger = require('../../lib/logger').createLogger({ component: 'XandrService' });

module.exports = class Xandr {
  static async connect() {
    return true;
  }

  static async getAdvertiser (advertiser_id) {
    return {};
  }

  static async getCampaigns () {
    return [];
  }

  static async getLineItems () {
    return [];
  }

  static async createCampaign () {
    return {};
  }

  static async createLineItem () {
    return {};
  }
};
