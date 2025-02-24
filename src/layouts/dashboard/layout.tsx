import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/sections/auth/providers/auth';

import { Avatar, IconButton, Typography } from '@mui/material';
import { useNotifications } from 'src/services/notification';
import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data } = useNotifications(page);
  const totalData = data?.meta?.total_data;
  const [notifications, setNotifications] = useState(data?.data);
  const [isLoading, setIsLoading] = useState(false);
  const layoutQuery: Breakpoint = 'lg';

  const onClickViewAll = () => {
    setIsLoading(true);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      setNotifications((prev) => [...(prev ?? []), ...(data?.data ?? [])]);
      setIsLoading(false);
    } else {
      setNotifications(data?.data);
    }
  }, [data, page]);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <Searchbar />
                <NotificationsPopover
                  data={notifications}
                  totalData={totalData}
                  onClickViewAll={onClickViewAll}
                  isLoading={isLoading}
                />
                <AccountPopover
                  data={[
                    {
                      label: 'Home',
                      href: '/',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: 'Profile',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: 'Settings',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop
          layoutQuery={layoutQuery}
          workspaces={_workspaces}
          slots={{
            topArea: (
              <Box
                display="flex"
                gap={2}
                mt={2}
                sx={{
                  backgroundColor: 'grey.25',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <IconButton
                  sx={{
                    p: '2px',
                    width: 40,
                    height: 40,
                  }}
                >
                  <Avatar
                    src={user?.user_info?.profile_picture}
                    alt={user?.user_info?.name}
                    sx={{ width: 1, height: 1 }}
                  >
                    {user?.user_info?.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Box>
                  <Typography fontWeight="bold">{user?.user_info?.name}</Typography>
                  <Typography>{user?.user_info?.role?.name}</Typography>
                </Box>
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
