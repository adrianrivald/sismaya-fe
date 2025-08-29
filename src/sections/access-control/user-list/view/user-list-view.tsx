import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  menuItemClasses,
  MenuList,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import type { Dispatch, SetStateAction } from 'react';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import type { User } from 'src/services/master-data/user/types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRole } from 'src/services/master-data/role';
import { useDeleteUserById, useUserList } from 'src/services/master-data/user';
import { DashboardContent } from 'src/layouts/dashboard';
import { useInternalCompaniesAll } from 'src/services/master-data/company';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
import { RemoveAction } from '../../remove-action';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedUser: Dispatch<SetStateAction<string>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const columnHelper = createColumnHelper<User>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('user_info.name', {
    id: 'name_sort',
    header: 'Name',
  }),

  columnHelper.accessor('email', {
    header: 'Email',
  }),

  columnHelper.accessor('phone', {
    header: 'Phone Number',
  }),

  columnHelper.accessor((row) => row, {
    header: 'Company',
    cell: (info) => {
      const internalCompanies = info.getValue().internal_companies;
      const nonInternalCompanies = info.getValue().user_info.company;
      const userType = info.getValue().user_info.user_type;
      const renderColor = () => {
        if (userType === 'internal') {
          return '#8E33FF';
        }
        if (userType !== 'internal') {
          if (nonInternalCompanies?.type === 'holding') {
            return '#22C55E';
          }
          return '#FFAB00';
        }
        return '';
      };
      return (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          sx={{
            width: 'fit-content',
          }}
        >
          {userType === 'internal' ? (
            internalCompanies?.map((company) => (
              <Box
                sx={{
                  backgroundColor: '#D6F3F9',
                  color: 'info.dark',
                  px: 1,
                  py: 0.5,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography fontWeight="500">{company?.company?.name}</Typography>
                <Box p={0.75} borderRadius="100%" bgcolor={renderColor()} />{' '}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                backgroundColor: '#D6F3F9',
                color: 'info.dark',
                px: 1,
                py: 0.5,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography fontWeight="500">{nonInternalCompanies?.name}</Typography>
              <Box p={0.75} borderRadius="100%" bgcolor={renderColor()} />{' '}
            </Box>
          )}
        </Box>
      );
    },
  }),

  columnHelper.accessor('user_info.role.name', {
    header: 'User Group',
    cell: (info) => {
      const value = info.getValue();
      return (
        <Box
          sx={{
            backgroundColor: '#D6F3F9',
            color: 'info.dark',
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
          <Typography fontWeight="500">{value}</Typography>
        </Box>
      );
    },
  }),

  columnHelper.display({
    header: 'Action',
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<User, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const userName = row.original.user_info?.name;
  const { handleEdit, setSelectedId, setOpenRemoveModal, setSelectedUser } = popoverProps;

  const onClickRemove = () => {
    setSelectedId(companyId);
    setSelectedUser(userName);
    setOpenRemoveModal(true);
  };
  return (
    <MenuList
      disablePadding
      sx={{
        p: 0.5,
        gap: 1,
        display: 'flex',
        flexDirection: 'row',
        [`& .${menuItemClasses.root}`]: {
          px: 1,
          gap: 2,
          borderRadius: 0.75,
          [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
        },
      }}
    >
      <Button
        sx={{ fontWeight: 'normal' }}
        variant="outlined"
        onClick={() => handleEdit(companyId)}
      >
        Edit
      </Button>

      <Button
        variant="outlined"
        onClick={onClickRemove}
        sx={{ color: 'black', borderColor: 'grey.500', fontWeight: 'normal' }}
      >
        Delete
      </Button>
    </MenuList>
  );
}

export function AccessControlUserListView() {
  const { user } = useAuth();
  const userRole = user?.user_info?.role?.id;
  const userCompanies = user?.internal_companies?.map((item) => item?.company?.id);
  const location = useLocation();
  const pathname = location.pathname?.split('/')[2];
  const mode = pathname === 'user-list' ? 'user-list' : 'user-group';
  const [roleFilter, setRoleFilter] = React.useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('');
  const [search, setSearch] = useSearchDebounce();

  const { getDataTableProps } = useUserList({
    type: companyFilter,
    role_id: roleFilter,
    // type: 'internal',
    search,
    internalCompanies: userRole === 2 ? userCompanies?.toString() : null,
    name: sortOrder,
  });
  const { data: internalCompanies } = useInternalCompaniesAll();
  const { data: roles } = useRole();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const { mutate: deleteUserById } = useDeleteUserById();
  const navigate = useNavigate();

  const onClickAddNew = () => {
    navigate('/access-control/user-list/create');
  };

  const handleChangeCompanyFilter = (e: SelectChangeEvent<string>) => {
    setCompanyFilter(String(e.target.value));
  };

  const handleChangeRoleFilter = (e: SelectChangeEvent<number>) => {
    setRoleFilter(Number(e.target.value));
  };
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<string>('');

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`/access-control/user-list/${id}/edit`);
    };

    const handleDelete = () => {
      deleteUserById(Number(selectedId));
      setOpenRemoveModal(false);
    };

    return { handleEdit, handleDelete };
  };

  const onSort = (id: string) => {
    if (id === 'name_sort') {
      if (sortOrder === '' || sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Access Control
          </Typography>

          <Box
            display="flex"
            gap={1}
            alignItems="center"
            sx={{ backgroundColor: 'grey.200', padding: 1, borderRadius: 1, mb: 2 }}
          >
            <Box
              onClick={() => navigate('/access-control/user-list')}
              sx={{
                cursor: 'pointer',
                backgroundColor: mode === 'user-list' ? 'common.white' : '',
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Typography>User List</Typography>
            </Box>
            <Box
              onClick={() => navigate('/access-control/user-group')}
              sx={{
                cursor: 'pointer',
                backgroundColor: mode === 'user-group' ? 'common.white' : '',
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Typography>User Group</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New User
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card
            sx={{
              mt: 2,
              p: 3,
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 4,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: { xs: '100%', md: '25%' },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="select-role">User Group</InputLabel>
                  <Select
                    labelId="select-company"
                    label="Company"
                    onChange={handleChangeRoleFilter}
                  >
                    <MenuItem value="">All</MenuItem>
                    {roles?.map((role) => <MenuItem value={role?.id}>{role?.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: '25%' },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="select-company">Company Type</InputLabel>
                  <Select
                    labelId="select-company"
                    label="Company"
                    onChange={handleChangeCompanyFilter}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="internal">Internal</MenuItem>
                    <MenuItem value="holding">Holding</MenuItem>
                    <MenuItem value="sub-company">Sub-company</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box
                sx={{
                  width: '100%',
                }}
              >
                <FormControl sx={{ width: '100%' }} variant="outlined">
                  <OutlinedInput
                    id="outlined-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgColor src="/assets/icons/ic-magnifier.svg" />
                      </InputAdornment>
                    }
                    aria-describedby="outlined-search-helper-text"
                    inputProps={{
                      'aria-label': 'search',
                    }}
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </FormControl>
              </Box>
            </Box>

            <Box mt={4} mb={2}>
              <Typography fontWeight="bold">Badge Information:</Typography>
              <Box display="flex" gap={2} mt={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box borderRadius="100%" bgcolor="#8E33FF" width={10} height={10} />{' '}
                  <Typography fontSize={14}>Internal Company</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Box borderRadius="100%" bgcolor="#22C55E" width={10} height={10} />{' '}
                  <Typography fontSize={14}>Holding Company</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Box borderRadius="100%" bgcolor="#FFAB00" width={10} height={10} />{' '}
                  <Typography fontSize={14}>Sub-Company</Typography>
                </Box>
              </Box>
            </Box>

            <DataTable
              columns={columns({
                ...popoverFuncs(),
                setOpenRemoveModal,
                setSelectedId,
                setSelectedUser,
              })}
              order={sortOrder}
              orderBy="name_sort"
              onSort={onSort}
              {...getDataTableProps()}
            />
          </Card>
        </Grid>
      </Grid>
      <RemoveAction
        mode={mode}
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </DashboardContent>
  );
}
