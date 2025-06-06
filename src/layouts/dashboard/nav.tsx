import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Fragment, useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { useAuth } from 'src/sections/auth/providers/auth';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { menuItems } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'block',
        },
        ...sx,
      }}
    >
      <NavContent slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,

  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: userPermissionsList } = useUserPermissions();
  const userRole = user?.user_info?.role_id;
  const userType = user?.user_info?.user_type;
  const userPermissions = userPermissionsList?.map((item) => item);
  const currentMenu = window.location.href.split('/')[3];

  const onClickParentAccordion = (path?: string) => {
    if (path) {
      navigate(`${path}`);
    }
  };

  const internalCompaniesDashboard = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/dashboard`,
  }));

  const internalCompaniesFaq = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/faq`,
  }));

  const internalCompaniesRequest = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/request`,
  }));

  const internalCompaniesTask = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/task`,
  }));

  const internalCompaniesAutoResponse = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/auto-response`,
  }));

  const internalCompaniesReport = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    path: `/${item?.company?.name.toLowerCase()}/report/work-allocation`,
  }));

  const internalCompaniesMasterData = user?.internal_companies?.map((item) => ({
    heading: item?.company?.name,
    list: [
      {
        path: `/${item?.company?.name.toLowerCase()}/product`,
        heading: 'Products',
      },
      {
        path: `/${item?.company?.name.toLowerCase()}/category`,
        heading: 'Request Categories',
      },
      {
        path: `/${item?.company?.name.toLowerCase()}/status`,
        heading: 'Request Status',
      },
      {
        path: `/${item?.company?.name.toLowerCase()}/title`,
        heading: 'Titles',
      },
      {
        path: `/${item?.company?.name.toLowerCase()}/division`,
        heading: 'Divisions',
      },
      {
        path: `/${item?.company?.name.toLowerCase()}/master-faq`,
        heading: 'FAQ',
      },
    ],
    // path: `/${item?.company?.name.toLowerCase()}/report/request`,
  }));

  const internalCompaniesMasterDataSuperAdmin = [
    {
      path: `/internal-company/companies`,
      heading: 'Companies',
    },
    {
      path: `/internal-company/product`,
      heading: 'Products',
    },
    {
      path: `/internal-company/category`,
      heading: 'Request Categories',
    },
    {
      path: `/internal-company/status`,
      heading: 'Request Status',
    },
    {
      path: `/internal-company/title`,
      heading: 'Titles',
    },
    {
      path: `/internal-company/division`,
      heading: 'Divisions',
    },
    {
      path: `/internal-company/master-faq`,
      heading: 'FAQ',
    },
  ];

  const clientCompaniesMasterDataSuperAdmin = [
    {
      path: `/client-company/companies`,
      heading: 'Companies',
    },
    {
      path: `/client-company/title`,
      heading: 'Titles',
    },
    {
      path: `/client-company/division`,
      heading: 'Divisions',
    },
  ];

  return (
    <Box sx={{ maxHeight: '100vh', overflow: 'auto', pb: 4 }}>
      <Logo />

      {slots?.topArea}

      <Scrollbar fillContent>
        {menuItems(
          internalCompaniesDashboard,
          internalCompaniesRequest,
          internalCompaniesTask,
          internalCompaniesAutoResponse,
          internalCompaniesReport,
          internalCompaniesMasterData,
          internalCompaniesMasterDataSuperAdmin,
          clientCompaniesMasterDataSuperAdmin,
          internalCompaniesFaq,
          userType,
          userRole
        )
          ?.filter((item) =>
            item?.list?.some((listItem) =>
              userRole !== 1
                ? userType === 'client'
                  ? userPermissions
                      ?.filter((permissionItem) => permissionItem !== 'chat')
                      .includes(listItem?.id)
                  : userRole === 2
                    ? ['master-data', 'user group:read', ...(userPermissions ?? [])].includes(
                        listItem?.id
                      )
                    : userPermissions?.includes(listItem?.id)
                : ['dashboard', 'master-data', 'user group:read', 'reports', 'faq'].includes(
                    listItem?.id
                  )
            )
          )
          .map((menu) => (
            <Fragment key={menu?.id}>
              <>
                {/* {menu?.isShownInRole?.includes(role) ? ( */}
                <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
                  <Box
                    color="var(--layout-nav-item-color)"
                    fontWeight="bold"
                    mt={4}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                    }}
                    component="span"
                  >
                    {menu?.heading}
                  </Box>
                  <Box component="ul" gap={0.5} display="flex" flexDirection="column">
                    {menu?.list
                      ?.filter((item) =>
                        userRole !== 1
                          ? userRole === 2
                            ? [
                                'master-data',
                                'user group:read',
                                ...(userPermissions ?? []),
                              ]?.includes(item?.id)
                            : userPermissions?.includes(item?.id)
                          : [
                              'dashboard',
                              'master-data',
                              'user group:read',
                              'reports',
                              'faq',
                            ].includes(item?.id)
                      )
                      .map((childMenu: any, index) => {
                        const isActived = childMenu.path === pathname;

                        return (
                          <>
                            {childMenu?.list?.length ? (
                              <Accordion
                                key={index}
                                defaultExpanded={childMenu?.path === currentMenu}
                                sx={{
                                  borderTop: 'none', // removes top border
                                  borderBottom: 'none', // if needed
                                  '&:before': {
                                    display: 'none', // removes the default divider line
                                  },
                                }}
                              >
                                <AccordionSummary
                                  sx={{
                                    p: 0,
                                  }}
                                  aria-controls="panel-content"
                                  id=""
                                >
                                  <ListItem disableGutters disablePadding key="request">
                                    <ListItemButton
                                      disableGutters
                                      sx={{
                                        pl: 2,
                                        py: 1,
                                        gap: 2,
                                        pr: 1.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        fontWeight: 'fontWeightMedium',
                                        color: 'var(--layout-nav-item-color)',
                                        minHeight: 'var(--layout-nav-item-height)',
                                      }}
                                      onClick={() => onClickParentAccordion(childMenu?.path)}
                                    >
                                      <Box component="span" sx={{ width: 24, height: 24 }}>
                                        {childMenu?.icon}
                                      </Box>

                                      <Box component="span" flexGrow={1}>
                                        {childMenu?.heading}
                                      </Box>

                                      {/* {item.info && item.info} */}
                                    </ListItemButton>
                                  </ListItem>
                                </AccordionSummary>

                                <AccordionDetails>
                                  {childMenu?.list?.map((item: any, childIndex: number) => {
                                    const isMenuActived = pathname.includes(item.path);
                                    if (childMenu?.heading === 'Master Data' && userRole === 2) {
                                      return (
                                        <Accordion
                                          key={index}
                                          defaultExpanded={item?.path === currentMenu}
                                          sx={{
                                            borderTop: 'none', // removes top border
                                            borderBottom: 'none', // if needed
                                            '&:before': {
                                              display: 'none', // removes the default divider line
                                            },
                                          }}
                                        >
                                          <AccordionSummary
                                            sx={{
                                              p: 0,
                                              '& .MuiAccordionSummary-content': {
                                                margin: 0,
                                              },
                                            }}
                                            aria-controls="panel-content"
                                            id=""
                                          >
                                            <ListItem disableGutters disablePadding key="request">
                                              <ListItemButton
                                                disableGutters
                                                sx={{
                                                  pl: 2,
                                                  py: 1,
                                                  gap: 2,
                                                  pr: 1.5,
                                                  borderRadius: 0.75,
                                                  typography: 'body2',
                                                  fontWeight: 'fontWeightMedium',
                                                  color: 'var(--layout-nav-item-color)',
                                                  minHeight: 'var(--layout-nav-item-height)',
                                                }}
                                                onClick={() => onClickParentAccordion(item?.path)}
                                              >
                                                <Box component="span" flexGrow={1}>
                                                  {item?.heading}
                                                </Box>

                                                {/* {item.info && item.info} */}
                                              </ListItemButton>
                                            </ListItem>
                                          </AccordionSummary>

                                          <AccordionDetails>
                                            {item?.list?.map(
                                              (
                                                masterDataItem: any,
                                                masterDataItemIndex: number
                                              ) => {
                                                const isMenuMasterDataActived = pathname.includes(
                                                  masterDataItem.path
                                                );
                                                return (
                                                  <ListItem
                                                    disableGutters
                                                    disablePadding
                                                    key={masterDataItemIndex}
                                                  >
                                                    <ListItemButton
                                                      disableGutters
                                                      component={RouterLink}
                                                      href={masterDataItem.path}
                                                      sx={{
                                                        pl: 2,
                                                        py: 1,
                                                        gap: 2,
                                                        pr: 1.5,
                                                        borderRadius: 0.75,
                                                        typography: 'body2',
                                                        fontWeight: 'fontWeightMedium',
                                                        color: 'var(--layout-nav-item-color)',
                                                        minHeight: 'var(--layout-nav-item-height)',
                                                        ...(isMenuMasterDataActived && {
                                                          fontWeight: 'fontWeightSemiBold',
                                                          bgcolor:
                                                            'var(--layout-nav-item-active-bg)',
                                                          color:
                                                            'var(--layout-nav-item-active-color)',
                                                          '&:hover': {
                                                            bgcolor:
                                                              'var(--layout-nav-item-hover-bg)',
                                                          },
                                                        }),
                                                      }}
                                                    >
                                                      <Box component="span" flexGrow={1}>
                                                        {masterDataItem.heading}
                                                      </Box>

                                                      {masterDataItem.info && masterDataItem.info}
                                                    </ListItemButton>
                                                  </ListItem>
                                                );
                                              }
                                            )}
                                          </AccordionDetails>
                                        </Accordion>
                                      );
                                    }
                                    if (
                                      userRole === 1 &&
                                      (item?.heading === 'Internal Company' ||
                                        item?.heading === 'Client Company')
                                    ) {
                                      return (
                                        <Accordion
                                          key={index}
                                          defaultExpanded={item?.path === currentMenu}
                                          sx={{
                                            borderTop: 'none', // removes top border
                                            borderBottom: 'none', // if needed
                                            '&:before': {
                                              display: 'none', // removes the default divider line
                                            },
                                          }}
                                        >
                                          <AccordionSummary
                                            sx={{
                                              p: 0,
                                              '& .MuiAccordionSummary-content': {
                                                margin: 0,
                                              },
                                            }}
                                            aria-controls="panel-content"
                                            id=""
                                          >
                                            <ListItem disableGutters disablePadding key="request">
                                              <ListItemButton
                                                disableGutters
                                                sx={{
                                                  pl: 2,
                                                  py: 1,
                                                  gap: 2,
                                                  pr: 1.5,
                                                  borderRadius: 0.75,
                                                  typography: 'body2',
                                                  fontWeight: 'fontWeightMedium',
                                                  color: 'var(--layout-nav-item-color)',
                                                  minHeight: 'var(--layout-nav-item-height)',
                                                }}
                                                onClick={() => onClickParentAccordion(item?.path)}
                                              >
                                                <Box component="span" flexGrow={1}>
                                                  {item?.heading}
                                                </Box>

                                                {/* {item.info && item.info} */}
                                              </ListItemButton>
                                            </ListItem>
                                          </AccordionSummary>

                                          <AccordionDetails>
                                            {item?.list?.map(
                                              (
                                                masterDataItem: any,
                                                masterDataItemIndex: number
                                              ) => {
                                                const isMenuMasterDataActived = pathname.includes(
                                                  masterDataItem.path
                                                );
                                                return (
                                                  <ListItem
                                                    disableGutters
                                                    disablePadding
                                                    key={masterDataItemIndex}
                                                  >
                                                    <ListItemButton
                                                      disableGutters
                                                      component={RouterLink}
                                                      href={masterDataItem.path}
                                                      sx={{
                                                        pl: 2,
                                                        py: 1,
                                                        gap: 2,
                                                        pr: 1.5,
                                                        borderRadius: 0.75,
                                                        typography: 'body2',
                                                        fontWeight: 'fontWeightMedium',
                                                        color: 'var(--layout-nav-item-color)',
                                                        minHeight: 'var(--layout-nav-item-height)',
                                                        ...(isMenuMasterDataActived && {
                                                          fontWeight: 'fontWeightSemiBold',
                                                          bgcolor:
                                                            'var(--layout-nav-item-active-bg)',
                                                          color:
                                                            'var(--layout-nav-item-active-color)',
                                                          '&:hover': {
                                                            bgcolor:
                                                              'var(--layout-nav-item-hover-bg)',
                                                          },
                                                        }),
                                                      }}
                                                    >
                                                      <Box component="span" flexGrow={1}>
                                                        {masterDataItem.heading}
                                                      </Box>

                                                      {masterDataItem.info && masterDataItem.info}
                                                    </ListItemButton>
                                                  </ListItem>
                                                );
                                              }
                                            )}
                                          </AccordionDetails>
                                        </Accordion>
                                      );
                                    }
                                    return (
                                      <ListItem disableGutters disablePadding key={childIndex}>
                                        <ListItemButton
                                          disableGutters
                                          component={RouterLink}
                                          href={item.path}
                                          sx={{
                                            pl: 2,
                                            py: 1,
                                            gap: 2,
                                            pr: 1.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            fontWeight: 'fontWeightMedium',
                                            color: 'var(--layout-nav-item-color)',
                                            minHeight: 'var(--layout-nav-item-height)',
                                            ...(isMenuActived && {
                                              fontWeight: 'fontWeightSemiBold',
                                              bgcolor: 'var(--layout-nav-item-active-bg)',
                                              color: 'var(--layout-nav-item-active-color)',
                                              '&:hover': {
                                                bgcolor: 'var(--layout-nav-item-hover-bg)',
                                              },
                                            }),
                                          }}
                                        >
                                          <Box component="span" flexGrow={1}>
                                            {item.heading}
                                          </Box>

                                          {item.info && item.info}
                                        </ListItemButton>
                                      </ListItem>
                                    );
                                  })}
                                </AccordionDetails>
                              </Accordion>
                            ) : (
                              <ListItem disableGutters disablePadding key={index}>
                                <ListItemButton
                                  disableGutters
                                  component={RouterLink}
                                  href={String(childMenu.path)}
                                  sx={{
                                    pl: 2,
                                    py: 1,
                                    gap: 2,
                                    pr: 1.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    fontWeight: 'fontWeightMedium',
                                    color: 'var(--layout-nav-item-color)',
                                    minHeight: 'var(--layout-nav-item-height)',
                                    ...(isActived && {
                                      fontWeight: 'fontWeightSemiBold',
                                      bgcolor: 'var(--layout-nav-item-active-bg)',
                                      color: 'var(--layout-nav-item-active-color)',
                                      '&:hover': {
                                        bgcolor: 'var(--layout-nav-item-hover-bg)',
                                      },
                                    }),
                                  }}
                                >
                                  <Box component="span" sx={{ width: 24, height: 24 }}>
                                    {childMenu.icon}
                                  </Box>

                                  <Box component="span" flexGrow={1}>
                                    {childMenu.heading}
                                  </Box>
                                </ListItemButton>
                              </ListItem>
                            )}
                          </>
                        );
                      })}
                  </Box>
                </Box>
                {/* ) : null} */}
              </>
            </Fragment>
          ))}
      </Scrollbar>

      {slots?.bottomArea}
    </Box>
  );
}
