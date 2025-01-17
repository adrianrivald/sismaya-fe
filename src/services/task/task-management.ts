import { useQuery } from '@tanstack/react-query';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { fDate, fDateTime } from 'src/utils/format-time';
import dayjs from 'dayjs';
import { http } from 'src/utils/http';
import { taskStatusMap, priorityColorMap } from 'src/constants/status';
import type { Assignee } from 'src/components/form/field/assignee';

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
      assignee_company_id: filter.companyId,
    },
  });
}

export function useTaskList(filter: TaskManagementFilter = {}) {
  return usePaginationQuery<TaskManagement>(
    ['task-management', filter],
    async (paginationState) => {
      const response = await getTaskManagement({
        ...filter,
        page: paginationState.pageIndex + 1,
        page_size: paginationState.pageSize,
      });

      return {
        ...response,
        data: response.data.map((item: any) => TaskManagement.fromJson(item)),
      };
    }
  );
}

export type KanbanColumn = {
  meta: {
    label: string;
    count: number;
  };
  items: Array<TaskManagement>;
};

export function useKanbanColumn(column: Task['status'], filter: TaskManagementFilter = {}) {
  return useQuery<KanbanColumn>({
    suspense: false,
    useErrorBoundary: false,
    queryKey: ['task-management', `kanban-column=${column}`, filter],
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

export function useTaskDetail(id: number) {
  return useQuery<TaskManagement>({
    queryKey: ['task-management', `task-detail=${id}`],
    queryFn: async () => {
      const response = await http(`/tasks/${id}`);
      return TaskManagement.fromJson(response.data);
    },
  });
}
