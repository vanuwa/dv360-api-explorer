module.exports = class Platform {
  constructor (platform) {
    this._platform = platform;
  }

  setPlatform (platform) {
    this._platform = platform;
  }

  connect () {
    return this._platform.connect();
  }

  getAdvertiser (advertiser_id) {
    return this._platform.getAdvertiser(advertiser_id);
  }

  getAdvertisers () {
    return this._platform.getAdvertisers();
  }

  getAdvertisersCampaigns (partner_id) {
    return this._platform.getAdvertisersCampaigns(partner_id)
  }

  getCampaigns () {
    return this._platform.getCampaigns();
  }

  createCampaign (dto) {
    return this._platform.createCampaign(dto);
  }

  createLineItem (dto) {
    return this._platform.createLineItem(dto);
  }

  getCampaign (campaign_id) {
    return this._platform.getCampaign(campaign_id)
  }

  getInsertionOrder (insertion_order_id) {
    return this._platform.getInsertionOrder(insertion_order_id)
  }

  getLineItem (line_item_id) {
    return this._platform.getLineItem(line_item_id)
  }

  createLineItemTargetingOptions (line_item_id, targeting_type = 'TARGETING_TYPE_ENVIRONMENT') {
    return this._platform.createLineItemTargetingOptions(line_item_id, targeting_type)
  }

  createCreative (dto) {
    return this._platform.createCreative(dto)
  }

  getCreative (creative_id) {
    return this._platform.getCreative(creative_id)
  }

  getLineItemTargetingOptions (line_item_id, targeting_type = 'TARGETING_TYPE_ENVIRONMENT') {
    return this._platform.getLineItemTargetingOptions(line_item_id, targeting_type)
  }

  getTargetingOptions (targeting_type = 'TARGETING_TYPE_ENVIRONMENT') {
    return this._platform.getTargetingOptions(targeting_type)
  }

  searchGeoTargetingOptions (term) {
    return this._platform.searchTargetingOptions(term, 'TARGETING_TYPE_GEO_REGION')
  }
}
