import { Box, Alert, CircularProgress as Loader, Stack, Typography } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { fDateTime } from 'src/utils/format-time';
import {
  useTaskActivities,
  type UseTaskActivitiesParams,
  type TaskActivity,
} from 'src/services/request/task';
import * as Tab from 'src/components/tabs';

function ActivityItem({ title, date }: TaskActivity) {
  return (
    <Stack>
      <Typography sx={{ color: '#212B36', lineHeight: '20px', fontSize: '14px', fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography sx={{ color: '#637381', lineHeight: '16px', fontSize: '12px' }}>
        {fDateTime(date)}
      </Typography>
    </Stack>
  );
}

interface TaskActivitiesProps extends UseTaskActivitiesParams {}

export function TaskActivities(props: TaskActivitiesProps) {
  const { isLoading, error, data: activities = [] } = useTaskActivities(props);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  if (!activities || activities.length < 1) {
    return null;
  }

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {activities.map((activity) => (
        <TimelineItem key={activity.id}>
          <TimelineSeparator>
            <TimelineDot color="success" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <ActivityItem {...activity} />
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default function Messenger({ children }: React.PropsWithChildren) {
  return (
    <Box sx={{ border: 1, borderRadius: 3, borderColor: 'grey.300' }}>
      <Tab.Root defaultValue="activity">
        <Box sx={{ px: 1.5, py: 2, borderBottom: '1px solid rgba(145, 158, 171, 0.32)' }}>
          <Tab.List>
            <Tab.Item value="activity">Task Activities</Tab.Item>
            <Tab.Item value="chat">Chat</Tab.Item>
          </Tab.List>
        </Box>

        <Box overflow="auto" height={400}>
          <Tab.Panel value="activity">
            <TaskActivities taskId={0} />
          </Tab.Panel>

          <Tab.Panel value="chat">{children}</Tab.Panel>
        </Box>
      </Tab.Root>
    </Box>
  );
}
