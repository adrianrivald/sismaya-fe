import type { PaginationState } from '@tanstack/react-table';

export interface DataTableParams extends PaginationState {
  order: string;
  status: string;
  active: string;
  keyword: string;
}

interface FilterBuilderOptions {
  values: Partial<string[]>;
  searchParams: URLSearchParams;
}

interface DataTableBuilderOptions
  extends Partial<PaginationState>,
    Pick<FilterBuilderOptions, 'searchParams'> {
  keyword?: string;
  filterValues?: FilterBuilderOptions['values'];
  searchKey?: string;
  autoPagination?: boolean
}

/**
 * Build the order key to usage on query params
 */
function keyBuilder(counter = 0, key: 'column' | 'direction' = 'column') {
  return `order[${counter}][${key}]`;
}

/**
 * Filter builder
 */
export function filterParamsBuilder(options: FilterBuilderOptions) {
  const { values, searchParams } = options;

  let counter = 0;

  values.forEach((value, index) => {
    if (value) {
      const [columnValue, directionValue] = value.split('-');

      searchParams.append(keyBuilder(counter, 'column'), columnValue);

      searchParams.append(keyBuilder(counter, 'direction'), directionValue);

      if (index < values.length - 1) {
        /* eslint-disable-next-line no-plusplus */
        counter++;
      }
    }
  });
}

/**
 * Data table builder
 */
export function dataTableParamsBuilder(options: DataTableBuilderOptions) {
  const { searchParams, pageIndex, pageSize, keyword, filterValues , searchKey = 'q', autoPagination = false} = options;

  // if (autoPagination === false) {
  //   searchParams.append('type', 'pagination');
  // }

  if (pageIndex) {
    searchParams.append('page', String(pageIndex + 1));
  }

  // if (pageSize) {
  //   searchParams.append('limit', String(pageSize));
  // }

  if (keyword) {
    searchParams.append(searchKey, keyword);
  }

  if (filterValues) {
    filterParamsBuilder({ searchParams, values: filterValues });
  }
}
