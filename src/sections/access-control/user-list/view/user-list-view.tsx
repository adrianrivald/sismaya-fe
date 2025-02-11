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
} from '@mui/material';
import type { Company } from 'src/services/master-data/company/types';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import type { Dispatch, SetStateAction } from 'react';
import { createColumnHelper, type CellContext, type PaginationState } from '@tanstack/react-table';
import type { User } from 'src/services/master-data/user/types';
import type { UseMutateFunction } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RemoveAction } from '../../view/remove-action';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

interface AccessControlUserListViewProps {
  handleChangeCompanyFilter: (e: SelectChangeEvent<number>) => void;
  internalCompanies: Company[] | undefined;
  setOpenRemoveModal: React.Dispatch<SetStateAction<boolean>>;
  deleteUserById: UseMutateFunction<void, unknown, number, unknown>;
  getDataTableProps: () => {
    data: any[];
    total: number;
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
    onPaginationChange: React.Dispatch<Partial<PaginationState>>;
  };
  openRemoveModal: boolean;
}

const columnHelper = createColumnHelper<User>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('user_info.name', {
    header: 'Name',
  }),

  columnHelper.accessor('email', {
    header: 'Email',
  }),

  columnHelper.accessor('phone', {
    header: 'Phone Number',
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<User, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit, setSelectedId, setOpenRemoveModal } = popoverProps;

  const onClickRemove = (itemId?: number) => {
    if (itemId) setSelectedId(itemId);
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
        onClick={() => onClickRemove(companyId)}
        sx={{ color: 'black', borderColor: 'grey.500', fontWeight: 'normal' }}
      >
        Delete
      </Button>
    </MenuList>
  );
}

export function AccessControlUserListView({
  handleChangeCompanyFilter,
  internalCompanies,
  setOpenRemoveModal,
  getDataTableProps,
  openRemoveModal,
  deleteUserById,
}: AccessControlUserListViewProps) {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const navigate = useNavigate();
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
  return (
    <>
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
                  <InputLabel id="select-category">User Group</InputLabel>
                  <Select labelId="select-category" label="Product">
                    <MenuItem value="">All</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: '25%' },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="select-category">Company</InputLabel>
                  <Select
                    labelId="select-category"
                    label="Company"
                    onChange={handleChangeCompanyFilter}
                  >
                    <MenuItem value="">All</MenuItem>
                    {internalCompanies?.map((company) => (
                      <MenuItem value={company?.id}>{company?.name}</MenuItem>
                    ))}
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
                  />
                </FormControl>
              </Box>
            </Box>

            <DataTable
              columns={columns({ ...popoverFuncs(), setOpenRemoveModal, setSelectedId })}
              {...getDataTableProps()}
            />
          </Card>
        </Grid>
      </Grid>

      <RemoveAction
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
    </>
  );
}
