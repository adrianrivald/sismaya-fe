import { useQuery, type QueryKey } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { useSetState } from './use-set-state';
import type { WithPagination } from '../types';

export const DEFAULT_LIMIT = 10;
export const limitSelections = [5, 10, 25, 50, 100] as const;

const initialPagination = {
  pageSize: DEFAULT_LIMIT,
  pageIndex: 0,
};

export function usePaginationQuery<TData>(
  queryKey: QueryKey,
  queryFn: (pagination: PaginationState) => Promise<WithPagination<TData>>
) {
  const [{ pageIndex, pageSize }, setPagination] =
    useSetState<PaginationState>(initialPagination);

    console.log(pageIndex,'pageIndex')

  const query = useQuery({
    queryKey: [...queryKey, pageSize, pageIndex],
    queryFn: () => queryFn({ pageIndex, pageSize }),
    keepPreviousData: true,
  });

  const queryData = {
    items: query.data?.data ?? [],
    meta: {
      total: query.data?.meta?.total_data ?? 0,
      page: query.data?.meta?.page ?? 1,
      // pageCount: query.data?.meta?.last_page ?? 1,
      // pageLinks: query?.data?.meta?.links ?? []
    },
  };

  // function prevPageHandler() {
  //   setPagination({ pageIndex: Math.max(0, pageIndex - 1) });
  // }

  // function nextPageHandler() {
  //   const hasMore = queryData.meta.page < queryData.meta.pageCount;

  //   if (!query.isPreviousData && hasMore) {
  //     setPagination({ pageIndex: pageIndex + 1 });
  //   }
  // }

  function jumpToPageHandler(gotoPage: number) {
    setPagination({ pageIndex: gotoPage });
  }

  function changePageSizeHandler(nextPageSize: number) {
    setPagination({ pageSize: nextPageSize });
  }

  function getDataTableProps() {
    return {
      data: queryData.items,
      total: queryData.meta.total,
      // pageCount: queryData.meta.pageCount,
      // pageLinks: queryData?.meta?.pageLinks,
      pagination: { pageIndex, pageSize },
      onPaginationChange: setPagination,
    };
  }

  return {
    ...query,
    data: queryData,
    isEmpty: queryData.items.length < 1,
    // prevPageHandler,
    // nextPageHandler,
    jumpToPageHandler,
    changePageSizeHandler,
    getDataTableProps,
  };
}
