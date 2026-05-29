<script lang="ts">
  import type { FiltersActivity, FiltersCategory } from '$lib/types/interfaces';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useFeedEventsFilters } from '$lib/utils/useFeedEventsFilters.svelte';
  import FeedEventsFiltersMenuButton from './FeedEventsFiltersMenuButton.svelte';
  import IconsTriangle from '$lib/components/icons/IconsTriangle.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const { feedFilters, changeFeedFiltersActivity, changeFeedFiltersCategory } =
    useFeedEventsFilters();
  const ifShowCategoriesFilter = appConfig?.ifShowCategoriesFilter;
  const envCategories = appConfig?.envCategories;

  let categoriesDropDownShown = $state(false);

  const activities: FiltersActivity[] = ['hot', 'rising', 'all'];
  const categories: FiltersCategory[] = [...(envCategories || []), 'any'];

  const filterActivityClicked = (newFilter: FiltersActivity | FiltersCategory): void => {
    changeFeedFiltersActivity(newFilter as FiltersActivity);
  };
  const filterCategoryClicked = (newFilter: FiltersCategory): void => {
    changeFeedFiltersCategory(newFilter);
    categoriesDropDownShown = false;
  };
  const toggleCategoriesDropDown = () => {
    categoriesDropDownShown = !categoriesDropDownShown;
  };
</script>

<div class="min-h-[2.6rem] bg-bgSecondary-light dark:bg-bgSecondary-dark">
  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
    {#if activities && activities[0]}
      <span class="float-left ml-1">
        {#each activities as activity}
          <FeedEventsFiltersMenuButton
            class="first-letter:uppercase"
            block={false}
            filterName={activity}
            filterSelected={feedFilters.activity}
            onFilterClicked={filterActivityClicked}
          >
            {activity}
          </FeedEventsFiltersMenuButton>
        {/each}
      </span>
    {/if}

    {#if ifShowCategoriesFilter}
      <button
        onclick={() => toggleCategoriesDropDown()}
        class="z-100 flex items-center float-right mr-2 p-2 px-2 min-w-[185px] bg-bgSecondary-light dark:bg-bgSecondary-dark"
      >
        <span class="mr-1">
          Category:
          <span class="uppercase text-colorPrimary-light dark:text-colorPrimary-dark">
            {feedFilters.category}
          </span>
        </span>
        <IconsTriangle rotateIf={categoriesDropDownShown} />
      </button>

      {#if categoriesDropDownShown}
        <div
          class="absolute right-0 top-7 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md mr-3"
        >
          {#if categories && categories[0]}
            <span class="float-right mr-4">
              {#each categories as category}
                <FeedEventsFiltersMenuButton
                  class="uppercase mr-1"
                  block={true}
                  filterName={category}
                  filterSelected={feedFilters.category}
                  onFilterClicked={filterCategoryClicked}
                >
                  {category}
                </FeedEventsFiltersMenuButton>
              {/each}
            </span>
          {/if}
        </div>
      {/if}
    {/if}
  </span>
</div>
