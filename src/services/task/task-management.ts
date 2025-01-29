import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { fDate, fDateTime } from 'src/utils/format-time';
import dayjs from 'dayjs';
import { http } from 'src/utils/http';
import { taskStatusMap, priorityColorMap } from 'src/constants/status';
import type { Assignee } from 'src/components/form/field/assignee';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useParams } from 'react-router-dom';

export interface RequestProduct {
  id: number;
  name: string;
}

export interface Request {
  id: number;
  name: string;
  product: RequestProduct;
  priority: keyof typeof priorityColorMap;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  estimateDay: number;
  status: keyof typeof taskStatusMap;
  assignees: Array<Assignee>;
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    createdAt: string;
  }>;
}

export class TaskManagement {
  static taskStatusMap = taskStatusMap;

  static requestPriorityMap = priorityColorMap;

  constructor(
    public request: Request,
    public task: Task
  ) {}

  static fromJson(json: any) {
    const request = {
      id: json.request?.id,
      name: json.request?.name || '-',
      product: {
        id: json.request?.product?.id || null,
        name: json.request?.product?.name || '-',
      },
      priority: json.request?.priority || 'medium',
    } satisfies Request;

    const task = {
      id: json.id,
      name: json.name || '-',
      description: json.description || '-',
      dueDate: json.due_date,
      status: json.step || 'to-do',
      progress: json.progress || 0,
      estimateDay: dayjs(json.request?.due_date).diff(dayjs(), 'day'),
      assignees: json.assignees.map(
        (assignee: any) =>
          ({
            id: assignee?.id,
            userId: assignee?.assignee_info?.id,
            name: assignee?.assignee_info?.name,
            email: assignee?.assignee_info?.email,
            avatar: assignee?.assignee_info?.profile_picture,
          }) satisfies Assignee
      ),
      attachments:
        json?.attachments?.map((attachment: any) => ({
          id: attachment.id,
          name: attachment.file_name,
          url: [attachment.file_path, attachment.file_name].join('/'),
          createdAt: attachment.created_at,
        })) ?? [],
    } satisfies Task;

    return new TaskManagement(request, task);
  }

  static formatDueDate(dueDate: string) {
    return fDate(dueDate, 'DD MMMM YYYY');
  }

  static formatAttachmentDate(createdAt: string) {
    return fDateTime(createdAt, 'DD MMMM YYYY HH:mm');
  }
}

export interface TaskManagementParams {
  page: number;
  page_size: number;

  search: string;
  status: Task['status'];
  productId: number;
  companyId: number;
  assigneeCompanyId: number;
}

export type TaskManagementFilter = Partial<Omit<TaskManagementParams, 'page' | 'page_size'>>;

async function getTaskManagement(filter: Partial<TaskManagementParams>) {
  const productId = Number.isNaN(filter.productId) ? 0 : filter.productId;

  return http('/tasks', {
    params: {
      page: filter.page,
      page_size: filter.page_size,

      step: filter.status,
      search: filter.search,
      product_id: productId,
      // company_id: filter.companyId,
      assignee_company_id: filter.assigneeCompanyId,
    },
  });
}

export function useTaskList(filter: TaskManagementFilter = {}) {
  return usePaginationQuery<TaskManagement>(['task', 'table', filter], async (paginationState) => {
    const response = await getTaskManagement({
      ...filter,
      page: paginationState.pageIndex + 1,
      page_size: paginationState.pageSize,
    });

    return {
      ...response,
      data: response.data.map((item: any) => TaskManagement.fromJson(item)),
    };
  });
}

export type KanbanColumn = {
  meta: {
    label: string;
    count: number;
  };
  items: Array<TaskManagement>;
};

const kanbanKeys = (column: Task['status'], ...rest: any) => [
  'task',
  `kanban-column=${column}`,
  ...rest,
];

export function useKanbanColumn(column: Task['status'], filter: TaskManagementFilter = {}) {
  return useQuery<KanbanColumn>({
    suspense: false,
    useErrorBoundary: false,
    refetchOnWindowFocus: false,
    queryKey: kanbanKeys(column, filter),
    queryFn: async () => {
      const response = await getTaskManagement({
        ...filter,
        status: column,
        page: 1,
        page_size: 250,
      });

      const items = response?.data || [];

      return {
        meta: {
          label: TaskManagement.taskStatusMap[column].label,
          count: items.length,
        },
        items,
      };
    },
  });
}

export function useKanbanChangeStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { taskId: number; status: Task['status']; prevStatus: Task['status'] }
  >({
    mutationFn: async ({ taskId, status }) =>
      http(`/tasks/${taskId}`, {
        method: 'PUT',
        data: { step: status },
      }),
    onMutate: async ({ taskId, status, prevStatus }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['task'] });

      // Snapshot the previous value
      const [[sourceKey, previousSource]]: any = queryClient.getQueriesData(kanbanKeys(prevStatus));
      const [[destinationKey, previousDestination]]: any = queryClient.getQueriesData(
        kanbanKeys(status)
      );

      // Optimistically update to the new value
      if (previousSource) {
        queryClient.setQueryData(sourceKey, (old: any) => ({
          ...old,
          items: old.items.filter((item: any) => item.id !== taskId),
        }));
      }
      if (previousDestination) {
        queryClient.setQueryData(destinationKey, (old: any) => ({
          ...old,
          items: [
            ...old.items,
            // find the task in the previous source and add it to the destination
            previousSource.items.find((item: any) => item.id === taskId),
          ],
        }));
      }

      // Return a context object with the snapshotted value
      return {
        source: {
          key: sourceKey,
          items: previousSource,
        },
        destination: {
          key: destinationKey,
          items: previousDestination,
        },
      };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (error, newData, context: any) => {
      queryClient.setQueryData(context?.source?.key, context?.source?.items);
      queryClient.setQueryData(context?.destination?.key, context?.destination?.items);

      toast.error(error?.message || 'Failed to change status');
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
}

export function useTaskDetail(id: number, assigneeCompanyId?: number) {
  return useQuery<TaskManagement>({
    queryKey: ['task', `task-detail=${id}`],
    queryFn: async () => {
      const response = await http(`/tasks/${id}`, {
        params: {
          assignee_company_id: assigneeCompanyId,
        },
      });
      return TaskManagement.fromJson(response.data);
    },
  });
}

export function useAssigneeCompanyId() {
  const { user } = useAuth();
  const { vendor } = useParams();

  if (!vendor) {
    throw new Error('Vendor not found');
  }

  const assigneeCompanyId = user?.internal_companies?.find(
    (c) => c?.company?.name?.toLowerCase() === vendor
  )?.company_id;

  if (!assigneeCompanyId) {
    throw new Error('Assignee company not found');
  }

  return assigneeCompanyId;
}
