import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import type { Notification } from 'src/services/notification/types';
import { useReadAllNotification, useReadNotification } from 'src/services/notification';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';

// ----------------------------------------------------------------------

export type NotificationsPopoverProps = IconButtonProps & {
  data?: Notification[];
  onClickViewAll: () => void;
  totalData: number | undefined;
  isLoading: boolean;
};

export function NotificationsPopover({
  data = [],
  onClickViewAll,
  sx,
  totalData,
  isLoading,
  ...other
}: NotificationsPopoverProps) {
  const navigate = useNavigate();
  const { mutate: readNotification } = useReadNotification();
  const { mutate: readAllNotification } = useReadAllNotification();
  const totalUnRead = data?.filter((item) => item.read_at === null).length;
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const { user } = useAuth();

  const handleMarkAsRead = (
    notificationId: number,
    readAt: string,
    refType: string,
    refId: number,
    internalCompanyId: number
  ) => {
    const companyName =
      user?.internal_companies
        ?.find((item) => item?.company?.id === internalCompanyId)
        ?.company?.name.toLowerCase() ?? '';
    if (readAt === null) {
      readNotification({
        id: notificationId,
      });
    }
    if (refType === 'requests') {
      navigate(`/${companyName}/request/${refId}`);
    }
    if (refType === 'tasks') {
      navigate(`/${companyName}/task/${refId}`);
    }
  };

  const handleMarkAllAsRead = () => {
    readAllNotification();
  };

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            {totalUnRead > 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You have {totalUnRead} unread messages
              </Typography>
            )}
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ overflow: 'auto', minHeight: 240, maxHeight: 400 }}>
          <List disablePadding>
            {data?.length > 0 ? (
              data?.map((notification) => (
                <NotificationItem
                  handleMarkAsRead={handleMarkAsRead}
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <Box
                sx={{ overflow: 'auto', minHeight: 240, maxHeight: 400 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>You don&apos;t have any notification yet</Typography>
              </Box>
            )}
          </List>

          {isLoading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {data?.length < (totalData ?? 0) && (
          <Box sx={{ p: 1 }}>
            <Button onClick={onClickViewAll} fullWidth disableRipple color="inherit">
              Load More
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  handleMarkAsRead,
}: {
  notification: Notification;
  handleMarkAsRead: (
    id: number,
    readAt: string,
    type: string,
    refId: number,
    internalCompanyId: number
  ) => void;
}) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.read_at === null && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() =>
        handleMarkAsRead(
          notification?.id,
          notification?.read_at,
          notification?.reff_type,
          notification?.reff_id,
          notification?.internal_company_id
        )
      }
    >
      {/* <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar> */}
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.created_at)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: Notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.content}
      </Typography>
    </Typography>
  );

  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
