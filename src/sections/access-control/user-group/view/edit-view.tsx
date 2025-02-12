import Typography from '@mui/material/Typography';
import type { AccordionSummaryProps } from '@mui/material';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Card,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Checkbox,
  styled,
  Divider,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { usePermissions, useRoleById, useUpdateRole } from 'src/services/master-data/role';
import { roleSchema, type RoleDTO } from 'src/services/master-data/role/schemas/role-schema';
import { useParams } from 'react-router-dom';

export function EditAccessControlUserGroupView() {
  const { id } = useParams();
  const { data: roles } = useRoleById(Number(id));
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: permissions } = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { mutate: updateRole } = useUpdateRole();
  const onChangePermission = (permissionId?: string) => {
    if (permissionId) {
      if (!selectedPermissions?.includes(permissionId)) {
        setSelectedPermissions((prev) => [...prev, permissionId]);
      } else {
        const newArr = selectedPermissions?.filter((item) => item !== permissionId);
        setSelectedPermissions(newArr);
      }
    }
  };

  useEffect(() => {
    if (roles?.permissions) {
      setSelectedPermissions(roles?.permissions);
    }
  }, [roles]);

  const defaultValues = {
    name: roles?.name,
    permissions: roles?.permissions,
  };

  const onCheckAllParent = (ids?: string[], permissionId?: string) => {
    const hasAllPermissions = ids?.every((permission) => selectedPermissions.includes(permission));

    if (ids) {
      if (!hasAllPermissions) {
        const newArr = ids?.filter((item) => !selectedPermissions?.includes(item));
        setSelectedPermissions((prev) => [...prev, ...newArr]);
      } else {
        const newArr = selectedPermissions?.filter((item) =>
          ids?.every((childItem) => item !== childItem)
        );
        setSelectedPermissions(newArr);
      }
    } else if (permissionId) {
      if (!selectedPermissions?.includes(permissionId)) {
        setSelectedPermissions((prev) => [...prev, permissionId]);
      } else {
        const newArr = selectedPermissions?.filter((item) => item !== permissionId);
        setSelectedPermissions(newArr);
      }
    }
  };

  const onCheckAllGeneral = () => {
    const newArr = selectedPermissions?.concat(generalChilds?.map((item) => item?.id));
    setSelectedPermissions(newArr);
  };

  const handleSubmit = (formData: RoleDTO) => {
    setIsLoading(true);
    const ids = permissions
      ?.filter((item) => selectedPermissions?.includes(item?.name))
      ?.map((res) => res?.id);
    try {
      updateRole({
        id: Number(id),
        name: formData?.name,
        permissions: ids,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const AccordionHeader = styled((props: AccordionSummaryProps) => (
    <AccordionSummary
      expandIcon={<SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />}
      {...props}
    />
  ))(() => ({
    fontWeight: '600',
    '& .MuiAccordionSummary-content.Mui-expanded': {
      backgroundColor: 'unset',
      color: 'black',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      backgroundColor: 'unset',
    },
  }));

  const generalChilds = [
    {
      id: 'dashboard',
      name: 'Dashboard',
    },
    {
      id: 'report',
      name: 'Report',
    },
  ];

  const managementChilds = [
    {
      name: 'Request',
      subChilds: [
        {
          id: 'request:create',
          name: 'Create',
        },
        {
          id: 'request:read',
          name: 'Read',
        },
        {
          id: 'request:update',
          name: 'Update',
        },
        {
          id: 'request:approve/reject',
          name: 'Approve/Reject',
        },
        {
          id: 'request:change status',
          name: 'Change Status',
        },
        {
          id: 'request:assign',
          name: 'Assign',
        },
      ],
    },
    {
      name: 'Request Attachment - Purchase Order',
      subChilds: [
        {
          id: 'request attachment:create',
          name: 'Create',
        },
        {
          id: 'request attachment:read',
          name: 'Read',
        },
        {
          id: 'request attachment:update',
          name: 'Update',
        },
        {
          id: 'request attachment:delete',
          name: 'Delete',
        },
      ],
    },
    {
      id: 'chat',
      name: 'Chat',
    },

    {
      name: 'Task',
      subChilds: [
        {
          id: 'task:create',
          name: 'Create',
        },
        {
          id: 'task:read',
          name: 'Read',
        },
        {
          id: 'task:update',
          name: 'Update',
        },
        {
          id: 'task:delete',
          name: 'Delete',
        },
      ],
    },
  ];

  const settingChilds = [
    {
      name: 'Access Control - User List',
      subChilds: [
        {
          id: 'user list:create',
          name: 'Create',
        },
        {
          id: 'user list:read',
          name: 'Read',
        },
        {
          id: 'user list:update',
          name: 'Update',
        },
        {
          id: 'user list:delete',
          name: 'Delete',
        },
      ],
    },
    {
      name: 'Access Control - User Group',
      subChilds: [
        {
          id: 'user group:create',
          name: 'Create',
        },
        {
          id: 'user group:read',
          name: 'Read',
        },
        {
          id: 'user group:update',
          name: 'Update',
        },
        {
          id: 'user group:delete',
          name: 'Delete',
        },
      ],
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Create User
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Access Control</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Create User</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={roleSchema}
          options={{
            defaultValues: {
              name: roles?.name,
            },
          }}
        >
          {({ register, control, watch, formState, setValue }) => (
            <>
              <Card
                sx={{
                  mt: 2,
                  px: 4,
                  py: 6,
                  boxShadow: '2',
                  position: 'relative',
                  backgroundColor: 'common.white',
                  borderRadius: 4,
                }}
              >
                <Grid container spacing={3} xs={12}>
                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography mb={1} component="label" htmlFor="name">
                        User Group Name
                      </Typography>

                      <OutlinedInput
                        error={Boolean(formState?.errors?.name)}
                        {...register('name', {
                          required: 'User Group Name must be filled out',
                        })}
                        id="name"
                        placeholder="e.g. Marketing"
                        sx={{ width: '100%' }}
                        defaultValue={roles?.name}
                      />
                    </FormControl>
                    {formState?.errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.name?.message)}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography mb={1} component="label" htmlFor="email">
                        Access Permissions
                      </Typography>

                      <Card
                        sx={{
                          mt: 2,
                          px: 4,
                          py: 6,
                          boxShadow: '2',
                          position: 'relative',
                          backgroundColor: 'common.white',
                          borderRadius: 4,
                        }}
                      >
                        <Accordion>
                          <AccordionHeader
                            expandIcon={
                              <SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />
                            }
                            aria-controls="general"
                            id="general-header"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                checked={generalChilds
                                  ?.map((item) => item?.id)
                                  ?.every((item) => selectedPermissions?.includes(item))}
                                onChange={onCheckAllGeneral}
                              />{' '}
                              General
                            </Box>
                          </AccordionHeader>
                          {generalChilds?.map((child) => (
                            <AccordionDetails sx={{ pb: 0.5 }}>
                              <Box
                                ml={6}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ backgroundColor: 'blue.50', p: 1, borderRadius: '8px' }}
                              >
                                <Checkbox
                                  id={`item-${child?.id}`}
                                  defaultChecked={defaultValues?.permissions?.includes(child?.id)}
                                  onChange={() => onChangePermission(child?.id)}
                                  checked={selectedPermissions?.includes(child?.id)}
                                />{' '}
                                <Typography
                                  sx={{ cursor: 'pointer' }}
                                  component="label"
                                  htmlFor={`item-${child?.id}`}
                                >
                                  {child?.name}
                                </Typography>
                              </Box>
                            </AccordionDetails>
                          ))}
                        </Accordion>

                        <Accordion>
                          <AccordionHeader
                            expandIcon={
                              <SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />
                            }
                            aria-controls="management"
                            id="management-header"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                checked={
                                  !managementChilds
                                    ?.map((item) =>
                                      item?.subChilds
                                        ?.map((subChildItem) => subChildItem?.id)
                                        ?.every((childItem) =>
                                          selectedPermissions?.includes(childItem)
                                        )
                                    )
                                    ?.includes(false)
                                }
                                onChange={onCheckAllGeneral}
                              />{' '}
                              Management
                            </Box>
                          </AccordionHeader>
                          {managementChilds?.map((child) => (
                            <AccordionDetails
                              sx={{
                                pb: 0.5,
                              }}
                            >
                              <Box
                                ml={6}
                                sx={{ backgroundColor: 'blue.50', p: 1, borderRadius: '8px' }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  sx={{ backgroundColor: 'blue.50', p: 1, borderRadius: '8px' }}
                                >
                                  <Checkbox
                                    id={`item-${child?.name}`}
                                    onChange={() =>
                                      onCheckAllParent(
                                        child?.subChilds?.map((item) => item?.id),
                                        child?.id
                                      )
                                    }
                                    checked={
                                      !child?.id
                                        ? child?.subChilds
                                            ?.map((item) => item?.id)
                                            ?.every((item) => selectedPermissions?.includes(item))
                                        : selectedPermissions?.includes(child?.id)
                                    }
                                  />{' '}
                                  <Typography
                                    sx={{ cursor: 'pointer' }}
                                    component="label"
                                    htmlFor={`item-${child?.name}`}
                                  >
                                    {child?.name}
                                  </Typography>
                                </Box>
                                {child?.subChilds && child?.subChilds?.length > 0 && (
                                  <Divider
                                    orientation="horizontal"
                                    flexItem
                                    sx={{ backgroundColor: '#CCDEE5' }}
                                  />
                                )}

                                {child?.subChilds?.map((item) => (
                                  <Box
                                    ml={4}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    sx={{ backgroundColor: 'blue.50', px: 1, borderRadius: '8px' }}
                                  >
                                    <Checkbox
                                      id={`item-${item?.id}`}
                                      onChange={() => onChangePermission(item?.id)}
                                      checked={selectedPermissions?.includes(item?.id)}
                                    />{' '}
                                    <Typography
                                      sx={{ cursor: 'pointer' }}
                                      component="label"
                                      htmlFor={`item-${item?.id}`}
                                    >
                                      {item?.name}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </AccordionDetails>
                          ))}
                        </Accordion>

                        <Accordion>
                          <AccordionHeader
                            expandIcon={
                              <SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />
                            }
                            aria-controls="settings"
                            id="settings-header"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                checked={
                                  !settingChilds
                                    ?.map((item) =>
                                      item?.subChilds
                                        ?.map((subChildItem) => subChildItem?.id)
                                        ?.every((childItem) =>
                                          selectedPermissions?.includes(childItem)
                                        )
                                    )
                                    ?.includes(false)
                                }
                                onChange={onCheckAllGeneral}
                              />{' '}
                              Settings
                            </Box>
                          </AccordionHeader>
                          {settingChilds?.map((child) => (
                            <AccordionDetails
                              sx={{
                                pb: 0.5,
                              }}
                            >
                              <Box
                                ml={6}
                                sx={{ backgroundColor: 'blue.50', p: 1, borderRadius: '8px' }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  sx={{ backgroundColor: 'blue.50', p: 1, borderRadius: '8px' }}
                                >
                                  <Checkbox
                                    id={`item-${child?.name}`}
                                    onChange={() =>
                                      onCheckAllParent(child?.subChilds?.map((item) => item?.id))
                                    }
                                    checked={child?.subChilds
                                      ?.map((item) => item?.id)
                                      ?.every((item) => selectedPermissions?.includes(item))}
                                  />{' '}
                                  <Typography
                                    sx={{ cursor: 'pointer' }}
                                    component="label"
                                    htmlFor={`item-${child?.name}`}
                                  >
                                    {child?.name}
                                  </Typography>
                                </Box>
                                {child?.subChilds && child?.subChilds?.length > 0 && (
                                  <Divider
                                    orientation="horizontal"
                                    flexItem
                                    sx={{ backgroundColor: '#CCDEE5' }}
                                  />
                                )}

                                {child?.subChilds?.map((item) => (
                                  <Box
                                    ml={4}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    sx={{ backgroundColor: 'blue.50', px: 1, borderRadius: '8px' }}
                                  >
                                    <Checkbox
                                      id={`item-${item?.id}`}
                                      onChange={() => onChangePermission(item?.id)}
                                      checked={selectedPermissions?.includes(item?.id)}
                                    />{' '}
                                    <Typography
                                      sx={{ cursor: 'pointer' }}
                                      component="label"
                                      htmlFor={`item-${item?.id}`}
                                    >
                                      {item?.name}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      </Card>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>

              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 4,
                }}
              >
                <LoadingButton
                  size="small"
                  loading={isLoading}
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: 120,
                  }}
                >
                  Save User Group
                </LoadingButton>
              </Box>
            </>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
