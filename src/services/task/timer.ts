import dayjs from 'dayjs';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from 'src/utils/http';

type TimerAction = 'start' | 'pause' | 'stop';
type TimerState = 'idle' | 'running' | 'paused' | 'stopped';

type EventStart = Omit<typeof initialStore, 'state' | 'timer'>;

type TimerActionPayload =
  | (EventStart & {
      action: 'start';
    })
  | {
      action: TimerAction;
      taskId: number;
    };

const stateMap = {
  start: 'running',
  pause: 'paused',
  stop: 'stopped',
} satisfies Record<TimerAction, TimerState>;

const initialStore = {
  timer: 0, // seconds
  state: 'idle' as TimerState,
  request: '',
  activity: '',
  taskId: 0,
};

const store = createStore({
  context: initialStore,
  on: {
    transition: (context, event: { nextState: TimerState }) => ({
      state: event.nextState,
    }),
    start: (context, event: EventStart) => ({
      ...event,
      timer: 0,
      state: 'running' as TimerState,
    }),
  },
});

export function useTimerStore() {
  return useSelector(store, (state) => state.context);
}

export function useTimer() {
  const { timer, state } = useTimerStore();
  const [time, setTime] = useState(timer);

  const isRunning = state === 'running';
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1_000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const text = [hours, minutes, seconds].map((t) => t.toString().padStart(2, '0')).join(':');

  return text;
}

export function useCheckTimer() {
  useEffect(() => {
    async function checkTimer() {
      const response = await http('/tasks/get-running-timer');
      const activity = response?.data?.running_timer;

      if (!activity || activity?.id === 0) {
        return;
      }

      const isEnded = activity.ended_at !== null;
      const isPaused = activity.is_pause === true;

      let state: TimerState = 'idle';

      if (isEnded) state = 'stopped';
      if (isPaused) state = 'paused';
      if (!isEnded && !isPaused) state = 'running';

      if (state === 'running') {
        store.send({ type: 'start', activity: 'test', request: 'test', taskId: 1 });
        return;
      }

      store.send({ type: 'transition', nextState: state });
    }

    checkTimer();
  }, []);
}

export function useTimerAction() {
  return useMutation<unknown, Error, TimerActionPayload>({
    mutationKey: ['task', 'timer'],
    mutationFn: async ({ action, taskId }) => http(`/tasks/${taskId}/${action}-timer`),
    // store next state to store immediately before tell the server
    onMutate: ({ action, ...rest }) => {
      if (action === 'start') {
        // @ts-expect-error: `rest` is valid `EventStart`
        store.send({ type: 'start', ...rest });
        return;
      }

      store.send({ type: 'transition', nextState: stateMap[action] });
    },
  });
}

type ActivitiesParams = {
  page: number;
  page_size: number;

  taskId: number;
};

export function useActivities(params: Partial<ActivitiesParams>) {
  return useQuery({
    queryKey: ['task', 'activity', params],
    queryFn: async () =>
      http('/tasks/get-all-timer', {
        params: {
          ...params,
          task_id: params.taskId,
        },
      }),
  });
}

export function useLastActivity(params: Pick<ActivitiesParams, 'taskId'>) {
  const { data: activities } = useActivities({ ...params, page_size: 1 });
  const activity = activities?.data?.[0];

  if (!activity) {
    return null;
  }

  return {
    name: activity?.task?.name,
    data: activity?.created_at,
    time: [activity?.started_at, activity?.ended_at].join(' - '),
    diff: activity?.ended_at ? dayjs(activity?.ended_at).diff(activity?.started_at, 'second') : 0,
  };
}
