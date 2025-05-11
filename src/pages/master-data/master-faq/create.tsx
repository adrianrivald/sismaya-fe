import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import QuillEditor from 'src/components/editor/quill-editor';
import { Form } from 'src/components/form/form';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useProductCompany } from 'src/services/master-data/company';
import { FaqDTO, faqSchema } from 'src/services/master-data/faq/schemas/faq-schema';
import { useAddMasterFaq } from 'src/services/master-data/faq/use-faq-create';

export default function CreateMasterFaq() {
  const navigate = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data } = useProductCompany(String(idCurrentCompany), 99999, '');
  const { mutate: addFaq } = useAddMasterFaq();
  const handleSubmit = (formData: FaqDTO) => {
    addFaq(formData, {
      onSuccess: () => {
        navigate(`/${vendor}/master-faq`);
      },
    });
  };

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
              <Form
                width="100%"
                onSubmit={handleSubmit}
                schema={faqSchema}
                // options={{
                //   defaultValues: {
                //     answer: ``,
                //   },
                // }}
              >
                {({ register, watch, formState, setValue, control }) => (
                  <Grid container spacing={2} xs={12}>
                    <Grid item xs={12} md={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Product
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          multiple
                          value={watch('productId') || []}
                          defaultValue={[]}
                          fullWidth
                          displayEmpty
                          placeholder="Which product(s) is this FAQ for?"
                          onChange={(e: SelectChangeEvent<number[]>) => {
                            setValue('productId', e.target.value);
                          }}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <Typography fontSize={14} color="GrayText">
                                  Which product(s) is this FAQ for?
                                </Typography>
                              );
                            }
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {[...(data || []), { id: 0, name: 'General' }]
                                  ?.filter((product) => selected.includes(product.id))
                                  .map((product) => (
                                    <Chip
                                      sx={{
                                        bgcolor: '#D6F3F9',
                                        color: 'info.dark',
                                      }}
                                      key={product.id}
                                      label={product.name}
                                    />
                                  ))}
                              </Box>
                            );
                          }}
                        >
                          <MenuItem value={0}>General</MenuItem>
                          {data?.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name}
                            </MenuItem>
                          ))}
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

                      <QuillEditor
                        control={control}
                        name="answer"
                        error={Boolean(formState?.errors?.answer)}
                        helperText={(formState?.errors?.answer?.message || '') as any}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('is_active', checked);
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
