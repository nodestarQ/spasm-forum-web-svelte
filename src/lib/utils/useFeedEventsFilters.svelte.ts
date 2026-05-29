import {
  FeedEventsFiltersStep, FeedEventsFilters,
  FiltersActivity, FiltersCategory
} from '$lib/types/interfaces'

// Feed filters are declared before the export function because
// that allows to manage global state similar to stores like Pinia.
// In other words, data stored in variables before an export function
// won't be reset for every new component instance it's used in.
const feedFiltersDefault: FeedEventsFilters = {
  webType: false,
  action: "post",
  category: "any",
  source: false,
  activity: "all",
  keyword: false,
  limit: 25,
}

const feedFilters: FeedEventsFilters = $state({...feedFiltersDefault})

const feedFiltersStep: FeedEventsFiltersStep = {
  limit: 15,
}

export const useFeedEventsFilters = () => {

  const resetFeedFiltersLimits = () => {
    // console.log("resetFeedFiltersToDefault is called")
    feedFilters.limit = feedFiltersDefault.limit
  }

  const increaseFeedFiltersLimits = (limit?: number) => {
    if (typeof (feedFilters.limit) !== "undefined") {
      if (typeof (limit) === "number" && limit >= 0) {
        feedFilters.limit += limit
      } else {
        feedFilters.limit += feedFiltersStep.limit
      }
    }
  }

  const changeFeedFiltersCategory = (newValue: FiltersCategory) => {
    feedFilters.category = newValue
    resetFeedFiltersLimits()
  }

  const changeFeedFiltersActivity = (newValue: FiltersActivity) => {
    feedFilters.activity = newValue
    resetFeedFiltersLimits()
  }

  return {
    feedFilters: feedFilters,
    feedFiltersDefault: feedFiltersDefault,
    feedFiltersStep: feedFiltersStep,
    resetFeedFiltersLimits,
    increaseFeedFiltersLimits,
    changeFeedFiltersCategory,
    changeFeedFiltersActivity,
  }
}
