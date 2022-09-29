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

  getCampaigns (advertiser_id) {
    return this._platform.getCampaigns(advertiser_id);
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

  getLineItems (campaign_id, advertiser_id) {
    return this._platform.getLineItems(campaign_id, advertiser_id)
  }

  getLineItem (line_item_id) {
    return this._platform.getLineItem(line_item_id)
  }

  createLineItemTargetingOptions (line_item_id, targeting_type = 'TARGETING_TYPE_ENVIRONMENT') {
    return this._platform.createLineItemTargetingOptions(line_item_id, targeting_type)
  }

  createLineItemAppTargetingOptions (line_item_id, appId) {
    return this._platform.createLineItemAppTargetingOptions(line_item_id, appId)
  }

  getLineItemAssignedTargetingOptions (line_item_id, targeting_types, advertiser_id) {
    return this._platform.getLineItemAssignedTargetingOptions(line_item_id, targeting_types, advertiser_id)
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
