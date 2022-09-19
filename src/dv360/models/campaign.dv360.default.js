const start_date = new Date();
const end_date = new Date();

start_date.setDate(start_date.getDate() + 1);
end_date.setDate(end_date.getDate() + 10);

module.exports = {
  // advertiserId: ADVERTISER_ID,
  displayName: `Default_${new Date().toISOString()}`,
  entityStatus: 'ENTITY_STATUS_PAUSED', // or maybe ENTITY_STATUS_DRAFT
  campaignGoal: {
    campaignGoalType: 'CAMPAIGN_GOAL_TYPE_ONLINE_ACTION',
    performanceGoal: {
      performanceGoalType: 'PERFORMANCE_GOAL_TYPE_CPM',
      performanceGoalAmountMicros: 1000000 // For example 1500000 represents 1.5 standard units of the currency.
    }
  },
  campaignFlight: {
    plannedDates: {
      startDate: formatDate(start_date),
      endDate: formatDate(end_date)
    }
  },
  frequencyCap: {
    unlimited: true // shall we set more granular settings for this?
  }
  // campaignBudgets: [{
  //   displayName: 'Gelato Estate',
  //   budgetUnit: 'BUDGET_UNIT_CURRENCY',
  //   budgetAmountMicros: 1000000,
  //   dateRange: {
  //     startDate: formatDate(start_date),
  //     endDate: formatDate(end_date)
  //   },
  //   externalBudgetSource: 'EXTERNAL_BUDGET_SOURCE_NONE'
  // }]
};

function formatDate(date) {
  const [year, month, day] = date.toISOString().split('T')[0].split('-');

  return { year, month, day };
}
