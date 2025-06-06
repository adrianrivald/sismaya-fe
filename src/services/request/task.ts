import { z } from 'zod';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { fDate } from 'src/utils/format-time';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import type { Assignee } from 'src/components/form/field/assignee';
import { taskStatusMap } from 'src/constants/status';
import { createStore } from '@xstate/store';

export class RequestTask {
  static queryKeys(requestId: number) {
    return ['task', `request-${requestId}`];
  }

  static statusMap = taskStatusMap;

  constructor(
    public requestId: number = 0,
    public taskId: number = 0,
    public title: string = '',
    public dueDate: string = new Date().toISOString(),
    public endDate: string = new Date().toISOString(),
    public requestData: any = {},
    public estimatedDuration: string = '',
    public description: string = '',
    public status: keyof typeof RequestTask.statusMap = 'to-do',
    public assignees: Array<Assignee> = [],
    public files: Array<{
      id: number;
      name: string;
      url: string;
    }> = []
  ) {}

  static fromJson(json: any) {
    return new RequestTask(
      json.request?.id,
      json.id,
      json.name,
      json.due_date,
      json.request?.end_date,
      {},
      json?.description,
      json.step,
      json?.estimated_duration,
      json?.assignees?.map((assignee: any) => ({
        id: assignee?.id,
        userId: assignee?.assignee_info?.userId,
        name: assignee?.assignee_info?.name,
        email: assignee?.assignee_info?.email,
        avatar: assignee?.assignee_info?.profile_picture,
      })) ?? [],
      json?.attachments?.map((attachment: any) => ({
        id: attachment.id,
        name: attachment.file_name,
        url: [attachment.file_path, attachment.file_name].join('/'),
      })) ?? []
    );
  }

  static async toJson(task: any) {
    const attachments = await RequestTask.filesToAttachments(task.files);

    return {
      request_id: task.requestId,
      id: task.taskId,
      name: task.title,
      step: task.status,
      due_date: fDate(task.dueDate, 'YYYY-MM-DD'),
      description: task.description,
      assignees: task.assignees,
      estimated_duration: task.estimatedDuration,
      attachments,
    };
  }

  static async filesToAttachments(files?: Array<File>) {
    if (!files || files.length < 1) {
      return [];
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    const uploadedFiles = await uploads(formData);

    if (!uploadedFiles.data || uploadedFiles.data.length < 1) {
      return [];
    }

    const attachments = uploadedFiles.data.map((file) => ({
      file_path: file.path,
      file_name: file.filename,
    }));

    return attachments;
  }

  public formattedDueDate() {
    return fDate(this.dueDate, 'DD MMMM YYYY');
  }

  static formSchema = z.object({
    request_id: z.number().optional(),
    title: z.string().min(1, 'Required'),
    dueDate: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
    estimatedDuration: z.string().min(1, 'Required'),
    status: z.enum(['to-do', 'in-progress', 'completed'], {
      required_error: 'Required',
      invalid_type_error: 'Invalid status',
    }),
    assignees: z
      .array(z.object({ id: z.number() }).transform((assignee) => ({ assignee_id: assignee.id })))
      .min(1, 'Required'),
    files: z.array(z.custom<File>()).optional(),
  });
}
const initialStore = {
  tasks: [] as RequestTask[],
};
export const store = createStore({
  context: initialStore,
  on: {
    storeTask: (context, event: { newTask: RequestTask[] }) => ({
      tasks: event?.newTask,
    }),
  },
});

export function useTaskByRequest(requestId: RequestTask['requestId']) {
  return useQuery({
    queryKey: RequestTask.queryKeys(requestId),
    queryFn: async () => {
      const response = await http('/tasks', { params: { request_id: requestId } });
      const items = response.data ?? [];
      const transformed: Array<RequestTask> = items.map((item: any) => RequestTask.fromJson(item));
      store.send({
        type: 'storeTask',
        newTask: transformed,
      });
      return transformed;
    },
  });
}

export interface UseCreateOrUpdateTaskOptions
  extends UseMutationOptions<RequestTask, Error, RequestTask> {
  defaultValues?: RequestTask;
}

export function useCreateOrUpdateTask(
  requestId: RequestTask['requestId'],
  { defaultValues, ...options }: UseCreateOrUpdateTaskOptions = {}
) {
  const form = useForm<RequestTask>({
    resolver: zodResolver(RequestTask.formSchema),
    defaultValues,
  });

  const isEdit = !!form.watch().taskId;

  const mutation = useMutation<RequestTask, Error, RequestTask>({
    ...options,
    mutationKey: ['task'],
    mutationFn: async (task) => {
      let formData;

      if (isEdit) {
        formData = await RequestTask.toJson({ ...task, requestId });
      } else {
        const reqId = form.watch('requestId');
        formData = {
          request_id: reqId,
          id: task.taskId,
          name: task.title,
          step: task.status,
          due_date: fDate(task.dueDate, 'YYYY-MM-DD'),
          description: task.description,
          assignees: task.assignees,
          estimated_duration: task.estimatedDuration,
          attachments: task.files.map((item: any) => ({
            file_path: item.path,
            file_name: item.name,
          })),
        };
      }

      return http(['/tasks', isEdit ? `/${form.watch().taskId}` : ''].join(''), {
        method: isEdit ? 'PUT' : 'POST',
        data: formData,
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (formValues) => {
      formValues.assignees.map(({ id, userId, ...rest }) => ({
        id: userId,
        ...rest,
      }));

      toast.promise<RequestTask, Error>(mutation.mutateAsync(formValues), {
        pending: `${isEdit ? 'Updating' : 'Creating'} task...`,
        success: `${isEdit ? 'Updated' : 'Created'} task successfully`,
        error: {
          render: ({ data }) => data?.message || `${isEdit ? 'Update' : 'Create'} task failed`,
        },
      });
    },

    (formErrors) => {
      console.debug('👾 ~ useCreateOrUpdateTask: ~ formErrors:', formErrors);
    }
  );

  return [form, onSubmit] as const;
}

export function useDeleteTask(
  requestId: RequestTask['requestId'],
  options: UseMutationOptions<any, any, any> = {}
) {
  const mutation = useMutation<RequestTask, Error, Pick<RequestTask, 'taskId'>>({
    ...options,
    mutationKey: ['task'],
    mutationFn: async ({ taskId }) => http(`/tasks/${taskId}`, { method: 'DELETE' }),
  });

  const onSubmit = ({ taskId }: Pick<RequestTask, 'taskId'>) =>
    toast.promise<RequestTask, Error>(mutation.mutateAsync({ taskId }), {
      pending: 'Deleting task...',
      success: 'Deleted task successfully',
      error: { render: ({ data }) => data?.message || 'Failed to delete task' },
    });

  return [mutation.isLoading, onSubmit] as const;
}

export type UseMutationAssigneePayload =
  | {
      kind: 'unassign';
      assigneeId: number;
    }
  | {
      kind: 'assign';
      taskId: RequestTask['taskId'];
      assigneeId: number;
    };

export function useMutationAssignee(requestId: RequestTask['requestId']) {
  const { isLoading, mutateAsync } = useMutation<RequestTask, Error, UseMutationAssigneePayload>({
    mutationKey: ['task'],
    mutationFn: async (payload) => {
      if (payload.kind === 'unassign') {
        return http(`/task-assignee/${payload.assigneeId}`, { method: 'DELETE' });
      }

      return http('/task-assignee', {
        method: 'POST',
        data: {
          task_id: payload.taskId,
          assignee_id: payload.assigneeId,
        },
      });
    },
  });

  return [isLoading, mutateAsync] as const;
}

export type UseMutationAttachmentPayload =
  | {
      kind: 'delete';
      fileId: number | 'all';
    }
  | {
      kind: 'create';
      taskId: RequestTask['taskId'];
      files: Array<File>;
    };

export function useMutationAttachment(requestId: RequestTask['requestId']) {
  const { isLoading, mutateAsync } = useMutation<RequestTask, Error, UseMutationAttachmentPayload>({
    mutationKey: ['task'],
    mutationFn: async (payload) => {
      if (payload.kind === 'delete') {
        return http(`/task-attachment/${payload.fileId}`, { method: 'DELETE' });
      }

      const attachments = await RequestTask.filesToAttachments(payload.files);

      return http(`/task-attachment`, {
        method: 'POST',
        data: { task_id: payload.taskId, attachments },
      });
    },
  });

  const onSubmit = (payload: UseMutationAttachmentPayload) =>
    toast.promise<RequestTask, Error>(mutateAsync(payload), {
      pending: payload.kind === 'delete' ? 'Deleting attachment...' : 'Uploading attachment...',
      success:
        payload.kind === 'delete'
          ? 'Deleted attachment successfully'
          : 'Uploaded attachment successfully',
      error: {
        render: ({ data }) =>
          data?.message || `${payload.kind === 'delete' ? 'Delete' : 'Upload'} attachment failed`,
      },
    });

  return [isLoading, onSubmit] as const;
}

export interface UseTaskActivitiesParams {
  taskId: RequestTask['taskId'];
}

export interface TaskActivity {
  id: number;
  description: string;
  created_at: string;
}

export function useTaskActivities(params: { requestId: RequestTask['requestId'] }) {
  return useQuery<Array<TaskActivity>, Error>({
    suspense: false,
    useErrorBoundary: false,
    queryKey: [...RequestTask.queryKeys(params.requestId), 'activities'],
    queryFn: async () => {
      const response = await http(`/requests/${params.requestId}/activity-logs`, {
        params: {
          page_size: 100,
        },
      });

      return response.data;
    },
  });
}
