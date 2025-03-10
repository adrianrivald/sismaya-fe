/* eslint-disable import/no-cycle */
import dayjs from 'dayjs';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { act, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from 'src/utils/http';
import { fTime, fDate, formatSecondToTime } from 'src/utils/format-time';
import { useAuth } from 'src/sections/auth/providers/auth';

type TimerAction = 'start' | 'pause' | 'stop';
export type TimerState = 'idle' | 'running' | 'paused' | 'stopped' | '';

type EventStart = Omit<typeof initialStore, 'state'>;

type TimerActionPayload =
  | (EventStart & { action: 'start'; name?: string })
  | { action: TimerAction; taskId: number; name?: string };

const stateMap = { start: 'running', pause: 'paused', stop: 'stopped' } satisfies Record<
  TimerAction,
  TimerState
>;

const storageKey = 'task-timer';

const initialStore = {
  timer: 0, // in seconds
  state: '' as TimerState,
  activity: '',
  request: '',
  taskId: 0,
  name: '',
};

const store = createStore({
  context: initialStore,
  on: {
    transition: (_context: any, event: { nextState: TimerState }) => {
      // Remove local storage when timer is idle or stopped
      if (event.nextState === 'idle' || event.nextState === 'stopped') {
        window.localStorage.removeItem(storageKey);
      }

      return { state: event.nextState };
    },
    stop: () => {
      window.localStorage.removeItem(storageKey);

      return initialStore;
    },
    start: (context: { [x: string]: any }, event: Partial<EventStart>) => {
      const storedData = window.localStorage.getItem(storageKey);
      const parsedData = storedData ? JSON.parse(storedData) : null;

      // Prevent start timer when activity and request is not provided
      if (event.activity && event.request) {
        window.localStorage.setItem(storageKey, JSON.stringify(event));
      }

      // Update context either from event or from local storage
      const getItem = (key: keyof typeof event) => event[key] || parsedData?.[key] || context[key];

      return {
        state: 'running' as TimerState,
        activity: getItem('activity'),
        request: getItem('request'),
        taskId: getItem('taskId'),
        timer: getItem('timer'),
        name: getItem('name'),
      };
    },

    countup: (context: { timer: number }) => ({
      // not sure why, but sometimes trigger countup twice, so need to add 0.5 instead of 1
      timer: context.timer + 0.5,
    }),

    idle: (context: { [x: string]: any }, event: Partial<EventStart>) => {
      const getItem = (key: keyof typeof event) => event[key] || context[key];
      return {
        state: 'idle' as TimerState,
        activity: getItem('activity'),
        request: getItem('request'),
        taskId: getItem('taskId'),
        timer: getItem('timer'),
        name: getItem('name'),
      };
    },
  },
});

export function useTimerActionStore() {
  return store;
}

export function useTimerStore() {
  const state = useSelector(store, (s) => s.context);
  return state;
}

export function useTimer(taskId?: number, lastTimer = 0) {
  const { timer, state } = useTimerStore();
  const { taskId: storeTaskId } = useTimerStore();
  const isPip = !taskId;
  const isCurrentTimer = isPip ? true : storeTaskId === taskId;

  const isCounting = state === 'running'; // && isCurrentTimer;
  useEffect(() => {
    if (isCounting === false) {
      return;
    }

    const timeId = setInterval(() => {
      store.send({ type: 'countup' });
    }, 1_000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(timeId);
    };
  }, [isCounting]);

  return formatSecondToTime(isCurrentTimer ? timer : lastTimer);
}

export function useCheckTimer() {
  const { isAuth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    async function checkTimer() {
      const response = await http('/tasks/get-running-timer', { signal: abortController.signal });

      const activity = response?.data?.running_timer;

      if (!activity || activity?.id === 0) {
        // store.send({ type: 'transition', nextState: '' });
        return;
      }

      const isEnded = activity?.ended_at !== null;
      const isPaused = activity?.is_pause === true;

      let state: TimerState = 'idle';

      if (isEnded) state = 'stopped';
      if (isPaused) state = 'paused';
      if (!isEnded && !isPaused) state = 'running';

      if (state === 'running') {
        const lastTimer = response?.data?.current_timer_duration || 0;

        console.log('data activity', activity);

        store.send({
          type: 'start',
          activity: activity?.task?.name,
          request: `REQ#${activity?.task?.request?.id}`,
          taskId: activity?.task_id,
          timer: dayjs().diff(dayjs(activity?.started_at), 'second') + lastTimer,
          name: activity?.name,
        });

        return;
      }

      if (state === 'stopped') {
        store.send({ type: 'stop' });

        return;
      }

      store.send({ type: 'transition', nextState: state });
    }

    if (isAuth) {
      checkTimer();
    }

    return () => {
      abortController.abort();
    };
  }, [isAuth]);
}

export function useTimerAction() {
  return useMutation<unknown, Error, TimerActionPayload>({
    mutationKey: ['task', 'activity'],
    mutationFn: async ({ action, taskId, name }) =>
      action === 'start'
        ? http(`/tasks/${taskId}/${action}-timer?name=${encodeURIComponent(name || '')}`)
        : http(`/tasks/${taskId}/${action}-timer`),
    // store next state to store immediately before tell the server
    onMutate: ({ name, action, ...rest }) => {
      if (action === 'start') {
        console.log('dataa rest', rest);
        store.send({ type: 'start', name: name || '', ...rest });
        return;
      }

      if (action === 'stop') {
        store.send({ type: 'stop' });
        return;
      }

      store.send({ type: 'transition', nextState: stateMap[action] });
    },
  });
}

export type ActivitiesParams = {
  page: number;
  page_size: number;

  taskId: number;
};

export function useActivities(params: Partial<ActivitiesParams>) {
  return useQuery({
    queryKey: ['task', 'activity', params],
    queryFn: async () =>
      http('/tasks/get-all-timer', { params: { ...params, task_id: params.taskId } }),
  });
}

export function useLastActivity(params: Pick<ActivitiesParams, 'taskId'>) {
  const { data: activities } = useActivities({ ...params, page_size: 1 });
  const activity = activities?.data?.[0];

  if (!activity) {
    return null;
  }

  let state: TimerState = 'idle';

  if (activity?.is_pause) state = 'paused';
  else if (activity?.ended_at !== null) state = 'stopped';
  else state = 'idle';

  return {
    state,
    timerName: activity?.name,
    name: activity?.task?.name,
    data: fDate(activity?.created_at, 'DD MMMM YYYY'),
    time: [fTime(activity?.started_at), fTime(activity?.ended_at)].join(' - '),
    diff: formatSecondToTime(dayjs(activity?.ended_at).diff(activity?.started_at, 'second')),
  };
}
