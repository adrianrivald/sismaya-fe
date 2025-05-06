import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Form } from 'src/components/form/form';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { FaqDTO } from 'src/services/master-data/faq/schemas/faq-schema';

export default function CreateMasterFaq() {
  const handleSubmit = (formData: FaqDTO) => {};
  return (
    <>
      <Helmet>
        <title> {`Master FAQ Create - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <DashboardContent maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Master FAQ
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography>Master Data</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Create New FAQ</Typography>
            </Box>
          </Box>
        </Box>
        <Card>
          <CardContent>
            <Grid container sx={{ my: 2 }}>
              <Form width="100%" onSubmit={handleSubmit}>
                {({ register, watch, formState, setValue, control }) => (
                  <Grid container spacing={2} xs={12}>
                    <Grid item xs={12} md={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Product
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={watch('productId') || '-'}
                          defaultValue="-"
                          fullWidth
                          hiddenLabel
                          placeholder="Which product(s) is this FAQ for?"
                          onChange={(e: SelectChangeEvent<any>) => {
                            setValue('productId', e.target.value);
                          }}
                        >
                          <MenuItem value="-" selected disabled>
                            Select Product
                          </MenuItem>
                          <MenuItem value="1">General</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Question
                      </Typography>
                      <TextField
                        error={Boolean(formState?.errors?.question)}
                        sx={{
                          width: '100%',
                        }}
                        placeholder="What do users usually ask? Start typing here..."
                        {...register('question', {
                          required: 'Question must be filled out',
                        })}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Answer
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('isActive', checked);
                            }}
                          />
                        }
                        label="Set status as Active"
                      />
                    </Grid>
                    <Box
                      display="flex"
                      justifyContent="end"
                      width="100%"
                      sx={{
                        mt: 8,
                      }}
                    >
                      <LoadingButton
                        size="small"
                        loading={false}
                        loadingIndicator="Submitting..."
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Create New FAQ
                      </LoadingButton>
                    </Box>
                  </Grid>
                )}
              </Form>
            </Grid>
          </CardContent>
        </Card>
      </DashboardContent>
    </>
  );
}
