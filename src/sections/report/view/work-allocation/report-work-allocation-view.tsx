import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  capitalize,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import dayjs from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

const timePeriodOptions = [
  {
    value: 'this-month',
    label: 'This month',
  },
  {
    value: 'this-year',
    label: 'This year',
  },
];

export function ReportWorkAllocationView() {
  const [timePeriod, setTimePeriod] = useState('this-month');
  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Generate PT SIM Report
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} spacing={2}>
          <Box bgcolor="grey.200" p={2} borderRadius={2} display="flex" gap={2}>
            <Box
              borderRadius={2}
              p={4}
              bgcolor="common.white"
              display="flex"
              flexDirection="column"
              width="30%"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2} sx={{ cursor: 'pointer' }}>
                <Iconify icon="solar:inbox-bold" />
                <Typography color="grey.600">Requests</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2} sx={{ cursor: 'pointer' }}>
                <Iconify icon="solar:file-text-bold" />
                <Typography>Work Allocation</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2} sx={{ cursor: 'pointer' }}>
                <Iconify icon="solar:users-group-rounded-bold" />
                <Typography color="grey.600">Work Performance</Typography>
              </Box>
            </Box>
            <Box
              borderRadius={2}
              bgcolor="common.white"
              display="flex"
              flexDirection="column"
              width="70%"
            >
              <Box p={2} pb={0}>
                <Typography variant="h6" fontSize="18">
                  Work Allocation
                </Typography>

                <Divider sx={{ mt: 2, borderStyle: 'dashed' }} />
              </Box>

              <Box p={2}>
                <FormControl sx={{ width: '100%' }}>
                  <Typography fontWeight={600} mb={1} component="label" htmlFor="time-period">
                    Time Period
                  </Typography>

                  <Select
                    value={timePeriod}
                    sx={{
                      height: 54,
                      paddingY: 0.5,
                      borderWidth: 0,
                      borderRadius: 1.5,
                      width: '100%',

                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 1,
                      },
                    }}
                    onChange={(e: SelectChangeEvent<string>) => {
                      setTimePeriod(e.target.value);
                    }}
                    id="time-period"
                  >
                    {timePeriodOptions?.map((item) => (
                      <MenuItem value={item.value}>{capitalize(`${item?.label}`)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box mt={24}>
                  <Button sx={{ width: '100%' }} type="submit" variant="contained">
                    Generate & Download Report
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
