import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import { Box, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { useDeleteUserById, useUserList } from 'src/services/master-data/user';
import * as company from 'src/services/master-data/company';
import { AccessControlUserListView } from '../user-list/view/user-list-view';

// ----------------------------------------------------------------------

interface AccessControlViewProps {
  type: 'internal' | 'client';
}

export function AccessControlView({ type }: AccessControlViewProps) {
  const [companyFilter, setCompanyFilter] = React.useState<number | null>(null);
  const { getDataTableProps } = useUserList({ internal_company: companyFilter });
  const { data: internalCompanies } = company.useInternalCompanies();
  const [mode, setMode] = useState<'user-list' | 'user-group'>('user-list');
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const { mutate: deleteUserById } = useDeleteUserById();
  const navigate = useNavigate();

  const onClickAddNew = () => {
    navigate('/access-control/user-list/create');
  };

  const handleChangeMode = (accessControlMode: 'user-list' | 'user-group') => {
    setMode(accessControlMode);
  };

  const handleChangeCompanyFilter = (e: SelectChangeEvent<number>) => {
    setCompanyFilter(Number(e.target.value));
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
              onClick={() => handleChangeMode('user-list')}
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
              onClick={() => handleChangeMode('user-group')}
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
      {mode === 'user-list' ? (
        <AccessControlUserListView
          handleChangeCompanyFilter={handleChangeCompanyFilter}
          internalCompanies={internalCompanies}
          setOpenRemoveModal={setOpenRemoveModal}
          deleteUserById={deleteUserById}
          getDataTableProps={getDataTableProps}
          openRemoveModal={openRemoveModal}
        />
      ) : (
        'User Group'
      )}
    </DashboardContent>
  );
}
