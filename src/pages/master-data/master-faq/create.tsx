import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import QuillEditor from 'src/components/editor/quill-editor';
import { Form } from 'src/components/form/form';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useInternalCompanies, useProductCompany } from 'src/services/master-data/company';
import {
  FaqDTO,
  FaqDTOSuperAdmin,
  faqSchema,
} from 'src/services/master-data/faq/schemas/faq-schema';
import { useAddMasterFaq } from 'src/services/master-data/faq/use-faq-create';
import { useFaqById } from 'src/services/master-data/faq/use-faq-detail';
import { useUpdateMasterFaq } from 'src/services/master-data/faq/use-faq-update';

export default function CreateMasterFaq() {
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const [idCompany, setIdCompany] = useState<number>(idCurrentCompany || 0);
  const { data: dataFaq } = useFaqById(Number(id) || 0);
  const { data, refetch } = useProductCompany(String(idCompany), 99999, '');
  const { mutate: addFaq } = useAddMasterFaq();
  const { mutate: updateFaq } = useUpdateMasterFaq(Number(id));
  const { data: internalCompanies } = useInternalCompanies();
  const handleSubmit = (formData: FaqDTO) => {
    if (id) {
      updateFaq(
        { ...formData, productId: [...new Set(formData.productId)] },
        {
          onSuccess: () => {
            if (isSuperAdmin) {
              navigate(`/internal-company/master-faq`);
            } else {
              navigate(`/${vendor}/master-faq`);
            }
          },
        }
      );
    } else {
      addFaq(formData, {
        onSuccess: () => {
          if (isSuperAdmin) {
            navigate(`/internal-company/master-faq`);
          } else {
            navigate(`/${vendor}/master-faq`);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (!vendor && id) {
      setIdCompany(Number(dataFaq?.products?.[0]?.company_id) || 0);
    }
  }, [vendor, dataFaq, id]);

  const defaultValues: FaqDTO | FaqDTOSuperAdmin = {
    question: dataFaq?.question || '',
    answer: dataFaq?.answer || '',
    is_active: dataFaq?.is_active || false,
    productId: dataFaq?.products?.map((item) => Number(item.id)) || [],
    company_id: !vendor ? dataFaq?.products?.[0]?.company_id : String(idCompany || 0), // TODO: remove this when we have company_id in for
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
              <Typography color="grey.500">{id ? 'Update' : 'Create'} New FAQ</Typography>
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
                options={{
                  defaultValues,
                }}
              >
                {({ register, watch, formState, setValue, control }) => (
                  <Grid container spacing={2} xs={12}>
                    {isSuperAdmin && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Company Name
                        </Typography>
                        <FormControl fullWidth>
                          <Controller
                            name="company_id"
                            control={control}
                            rules={{
                              required: 'Company must be filled out',
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <Autocomplete
                                options={internalCompanies || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                value={
                                  internalCompanies?.find((company) => company.id === value) || null
                                }
                                disabled={id !== undefined}
                                onChange={async (_, selectedCompany) => {
                                  const selectedIdCompany = selectedCompany?.id || null;
                                  onChange(selectedIdCompany);
                                  setIdCompany(selectedIdCompany || 0);
                                  setTimeout(() => {
                                    refetch();
                                    setValue('productId', []);
                                  }, 1000);
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Company" error={!!error} />
                                )}
                              />
                            )}
                          />
                        </FormControl>
                        {formState?.errors?.company_id && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.company_id?.message)}
                          </FormHelperText>
                        )}
                      </Grid>
                    )}
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
                          disabled={idCompany === 0}
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
                                {[...(data || [])]
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
                            checked={watch('is_active')}
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
                        {id ? 'Update' : 'Create'} New FAQ
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
