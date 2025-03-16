import Typography from '@mui/material/Typography';
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React from 'react';
import { CompanyDTO, companySchema } from 'src/services/master-data/company/schemas/company-schema';
import {
  useAddCompany,
  useAddCompanyRelation,
  useInternalCompanies,
} from 'src/services/master-data/company';

export function CreateCompanyRelationView() {
  const location = useLocation();
  const { id } = useParams();
  console.log(location, 'location');
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: internalCompanies } = useInternalCompanies();
  const [selectedCompany, setSelectedCompany] = React.useState<number | null>(null);

  const { mutate: addCompanyRelation } = useAddCompanyRelation();
  const handleSubmit = () => {
    if (selectedCompany !== null) {
      addCompanyRelation({
        internal_company_id: selectedCompany,
        client_company_id: Number(id),
      });
    }
  };

  const onChangeSelectedCompany = (e: SelectChangeEvent<number>) => {
    setSelectedCompany(Number(e.target.value));
  };
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Linked Internal Company
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Product Filter</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form width="100%" onSubmit={handleSubmit}>
          {({ register, control, formState, watch }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                <Box width="100%">
                  <FormControl fullWidth>
                    <InputLabel id="selectedCompany">Internal Company</InputLabel>
                    <Select
                      label="Internal Company"
                      value={watch('internal_company_id')}
                      onChange={(e: SelectChangeEvent<number>) => onChangeSelectedCompany(e)}
                    >
                      {internalCompanies?.map((company) => (
                        <MenuItem value={company?.id}>{company?.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
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
                  disabled={selectedCompany === null || !selectedCompany}
                  sx={{
                    width: 120,
                  }}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
