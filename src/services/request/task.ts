import { z } from 'zod';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { fDate } from 'src/utils/format-time';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import type { Assignee } from 'src/components/form/field/assignee';

export class Task {
  static queryKeys(requestId: number) {
    return ['task', `request-${requestId}`];
  }

  static statusMap = {
    'to-do': {
      label: 'To Do',
      color: '#004C6A',
      bg: 'rgba(0, 91, 127, 0.16)',
    },

    'in-progress': {
      label: 'On Progress',
      color: '#B78103',
      bg: 'rgba(255, 245, 215, 1)',
    },

    completed: {
      label: 'Completed',
      color: '#229A16',
      bg: 'rgba(84, 214, 44, 0.16)',
    },
  };

  constructor(
    public requestId: number = 0,
    public taskId: number = 0,
    public title: string = '',
    public dueDate: string = new Date().toISOString(),
    public description: string = '',
    public status: keyof typeof Task.statusMap = 'to-do',
    public assignees: Array<Assignee> = [],
    public files: Array<{
      name: string;
      url: string;
    }> = []
  ) {}

  static fromJson(json: any) {
    return new Task(
      json.request?.id,
      json.id,
      json.name,
      json.due_date,
      json?.description,
      json.step,
      json?.assignees?.map((assignee: any) => ({
        id: assignee?.id,
        userId: assignee?.assignee_info?.id,
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
    const attachments = await Task.filesToAttachments(task.files);

    return {
      request_id: task.requestId,
      id: task.taskId,
      name: task.title,
      step: task.status,
      due_date: fDate(task.dueDate, 'YYYY-MM-DD'),
      description: task.description,
      assignees: task.assignees,
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

  public transformStatus() {
    return Task.statusMap[this.status || 'to-do'];
  }

  static formSchema = z.object({
    request_id: z.number().optional(),
    title: z.string().min(1, 'Required'),
    dueDate: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
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

export function useTaskByRequest(requestId: Task['requestId']) {
  return useQuery({
    queryKey: Task.queryKeys(requestId),
    queryFn: async () => {
      const response = await http('/tasks', { params: { request_id: requestId } });
      const items = response.data ?? [];
      const transformed: Array<Task> = items.map((item: any) => Task.fromJson(item));

      return transformed;
    },
  });
}

export interface UseCreateOrUpdateTaskOptions extends UseMutationOptions<Task, Error, Task> {
  defaultValues?: Task;
}

export function useCreateOrUpdateTask(
  requestId: Task['requestId'],
  { defaultValues, ...options }: UseCreateOrUpdateTaskOptions = {}
) {
  const isEdit = !!defaultValues?.taskId;

  const form = useForm<Task>({
    resolver: zodResolver(Task.formSchema),
    defaultValues,
  });

  const mutation = useMutation<Task, Error, Task>({
    ...options,
    mutationKey: Task.queryKeys(requestId),
    mutationFn: async (task) => {
      const formData = await Task.toJson({ ...task, requestId });

      return http(['/tasks', isEdit ? `/${defaultValues.taskId}` : ''].join(''), {
        method: isEdit ? 'PUT' : 'POST',
        data: formData,
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (formValues) =>
      toast.promise<Task, Error>(mutation.mutateAsync(formValues), {
        pending: `${isEdit ? 'Updating' : 'Creating'} task...`,
        success: `${isEdit ? 'Updated' : 'Created'} task successfully`,
        error: {
          render: ({ data }) => data?.message || `${isEdit ? 'Update' : 'Create'} task failed`,
        },
      }),
    (formErrors) => {
      console.debug('👾 ~ useCreateOrUpdateTask: ~ formErrors:', formErrors);
    }
  );

  return [form, onSubmit] as const;
}

export function useDeleteTask(requestId: Task['requestId']) {
  const mutation = useMutation<Task, Error, Pick<Task, 'taskId'>>({
    mutationKey: Task.queryKeys(requestId),
    mutationFn: async ({ taskId }) => http(`/tasks/${taskId}`, { method: 'DELETE' }),
  });

  const onSubmit = ({ taskId }: Pick<Task, 'taskId'>) =>
    toast.promise<Task, Error>(mutation.mutateAsync({ taskId }), {
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
      taskId: Task['taskId'];
      assigneeId: number;
    };

export function useMutationAssignee(requestId: Task['requestId']) {
  const { isLoading, mutateAsync } = useMutation<Task, Error, UseMutationAssigneePayload>({
    mutationKey: Task.queryKeys(requestId),
    mutationFn: async (payload) => {
      if (payload.kind === 'unassign') {
        return http(`/task-assignee/${payload.assigneeId}`, { method: 'DELETE' });
      }

      return http(`/task-assignee`, {
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
      taskId: Task['taskId'];
      files: Array<File>;
    };

export function useMutationAttachment(requestId: Task['requestId']) {
  const { isLoading, mutateAsync } = useMutation<Task, Error, UseMutationAttachmentPayload>({
    mutationKey: Task.queryKeys(requestId),
    mutationFn: async (payload) => {
      if (payload.kind === 'delete') {
        return http(`/task-attachment/${payload.fileId}`, { method: 'DELETE' });
      }

      const attachments = await Task.filesToAttachments(payload.files);

      return http(`/task-attachment`, {
        method: 'POST',
        data: { task_id: payload.taskId, attachments },
      });
    },
  });

  const onSubmit = (payload: UseMutationAttachmentPayload) =>
    toast.promise<Task, Error>(mutateAsync(payload), {
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
  taskId: Task['taskId'];
}

export interface TaskActivity {
  id: number;
  description: string;
  created_at: string;
}

export function useTaskActivities(params: { requestId: Task['requestId'] }) {
  return useQuery<Array<TaskActivity>, Error>({
    suspense: false,
    useErrorBoundary: false,
    queryKey: [...Task.queryKeys(params.requestId), 'activities'],
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
