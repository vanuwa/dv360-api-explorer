const start_date = new Date();
const end_date = new Date();

start_date.setDate(start_date.getDate() + 1);
end_date.setDate(end_date.getDate() + 10);

module.exports = {
  insertionOrderId: 1008525860,
  displayName: `LI-Default-${new Date().toISOString()}`,
  lineItemType: 'LINE_ITEM_TYPE_DISPLAY_DEFAULT', // as far as understand depends on selection on UI: WEB, APP, VIDEO
  entityStatus: 'ENTITY_STATUS_DRAFT', // after creation, we could set ENTITY_STATUS_ACTIVE
  flight: {
    flightDateType: 'LINE_ITEM_FLIGHT_DATE_TYPE_CUSTOM',
    dateRange: {
      startDate: formatDate(start_date),
      endDate: formatDate(end_date)
    }
  },
  budget: {
    budgetAllocationType: 'LINE_ITEM_BUDGET_ALLOCATION_TYPE_FIXED',
    budgetUnit: 'BUDGET_UNIT_CURRENCY', // optional, will affect maxAmount. BUDGET_UNIT_IMPRESSIONS - ?
    maxAmount: 100000 //
  },
  pacing: {
    pacingPeriod: 'PACING_PERIOD_FLIGHT', // PACING_PERIOD_DAILY
    pacingType: 'PACING_TYPE_EVEN' // AHEAD or ASAP
  },
  frequencyCap: {
    unlimited: true
  },
  partnerRevenueModel: {
    markupType: 'PARTNER_REVENUE_MODEL_MARKUP_TYPE_TOTAL_MEDIA_COST_MARKUP',
    markupAmount: 0
  },
  conversionCounting: {
    postViewCountPercentageMillis: 0 // - what should be there?
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
};

function formatDate(date) {
  const [year, month, day] = date.toISOString().split('T')[0].split('-');

  return { year, month, day };
}
