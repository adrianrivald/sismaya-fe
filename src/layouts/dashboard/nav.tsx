import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

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
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { menuByRole, Menus } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  menus: Menus[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  menus,
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
      <NavContent menus={menus} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  menus,
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
      <NavContent menus={menus} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ menus, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.user_info?.role_id;
  const currentMenu = window.location.href.split('/')[3];
  const accessibleMenus = menuByRole[role]?.menus as string[];

  return (
    <>
      <Logo />

      {slots?.topArea}

      <Scrollbar fillContent>
        {menus?.map((menu) => (
          <>
            {menu?.isAccordion ? (
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
                    ?.filter((item: any) => accessibleMenus?.includes(item?.id))
                    .map((childMenu: any, index: number) => (
                      <Accordion key={index} defaultExpanded={childMenu?.path === currentMenu}>
                        <AccordionSummary
                          // expandIcon={<ExpandMoreIcon />}
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
                                // ...(isActived && {
                                //   fontWeight: 'fontWeightSemiBold',
                                //   bgcolor: 'var(--layout-nav-item-active-bg)',
                                //   color: 'var(--layout-nav-item-active-color)',
                                //   '&:hover': {
                                //     bgcolor: 'var(--layout-nav-item-hover-bg)',
                                //   },
                                // }),
                              }}
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
                          {childMenu?.list.map((item: any, childIndex: number) => {
                            const isActived = pathname.includes(item.path);
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
                    ))}
                </Box>
              </Box>
            ) : (
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
                    {menu?.list.map((item: any, index: number) => {
                      const isActived = item.path === pathname;

                      return (
                        <ListItem disableGutters disablePadding key={index}>
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
                              {item.icon}
                            </Box>

                            <Box component="span" flexGrow={1}>
                              {item.heading}
                            </Box>

                            {item.info && item.info}
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </Box>
                </Box>
                {/* ) : null} */}
              </>
            )}
          </>
        ))}
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
