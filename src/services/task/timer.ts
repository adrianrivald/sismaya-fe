import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from 'src/utils/http';

type TimerAction = 'start' | 'pause' | 'stop';

export function useTaskTimer() {
  return useQuery({
    queryKey: ['tasks', 'timer'],
    queryFn: async () => {
      const response = await http('/tasks/get-running-timer');

      return response.data;
    },
  });
}

export function useTaskTimerAction(action: TimerAction) {
  return useMutation<number, Error>({
    mutationKey: ['tasks', 'timer'],
    mutationFn: async (taskId) => {
      const response = await http(`/tasks/${taskId}/${action}-timer`);

      return response.data;
    },
  });
}
