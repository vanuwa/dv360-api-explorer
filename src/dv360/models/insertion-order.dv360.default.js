const start_date = new Date();
const end_date = new Date();

start_date.setDate(start_date.getDate() + 1);
end_date.setDate(end_date.getDate() + 10);

module.exports = {
  campaignId: 52561183,
  displayName: `IO-Default-${new Date().toISOString()}`,
  // insertionOrderType: 'RTB',
  entityStatus: 'ENTITY_STATUS_DRAFT', // we could set the status ENTITY_STATUS_ACTIVE by PATCH and only after we create IO
  pacing: {
    pacingPeriod: 'PACING_PERIOD_FLIGHT', // or PACING_PERIOD_DAILY - ?
    pacingType: 'PACING_TYPE_EVEN' // other options AHEAD or ASAP
  },
  frequencyCap: {
    unlimited: true // is it okay? or shall we set up more granular
  },
  integrationDetails: {
    integrationCode: 'azerion_campaign_id', // just for test purpose
    details: 'b98be92c-d664-4e0a-bb69-2535eeb798f6'
  },
  performanceGoal: {
    performanceGoalType: 'PERFORMANCE_GOAL_TYPE_CPM',
    performanceGoalAmountMicros: 1000000 // For example 1500000 represents 1.5 standard units of the currency.
  },
  budget: {
    budgetUnit: 'BUDGET_UNIT_CURRENCY', // or BUDGET_UNIT_IMPRESSIONS - ?
    budgetSegments: [{ // we have only one budget segment
      budgetAmountMicros: 1000000,
      dateRange: {
        startDate: formatDate(start_date),
        endDate: formatDate(end_date)
      }
    }]
  }
};

function formatDate(date) {
  const [year, month, day] = date.toISOString().split('T')[0].split('-');

  return { year, month, day };
}
