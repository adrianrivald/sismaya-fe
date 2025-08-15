import { Icon } from '@iconify/react';
import {
  Dialog,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInitialQuota, useInitialQuotaPost } from 'src/services/settings-cito/use-initial-cito';

interface DialogAddInitialCitoProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

export default function DialogAddInitialCito({ open, onClose, id }: DialogAddInitialCitoProps) {
  const methods = useForm<{
    cito_type: string;
    quota: { company_id: number; quota: number; name: string; type: string }[];
  }>({
    defaultValues: {
      cito_type: 'all_sub_company',
      quota: [],
    },
  });
  const [step, setStep] = useState(1);

  const { data } = useInitialQuota('', id, open === true);
  const mutation = useInitialQuotaPost();

  useEffect(() => {
    if (data) {
      methods.reset({
        cito_type: data?.cito_type || 'all_sub_company',
        quota: data?.initial.map((item) => ({
          company_id: item.id,
          quota: item.quota || 0,
          name: item.company_name,
          type: item.type,
        })),
      });
    }
  }, [data, methods]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="md"
      fullWidth
      sx={{ p: 3 }}
    >
      {step === 1 && (
        <Box sx={{ px: 3, pt: 1, pb: 3 }}>
          <Typography mt={2} fontWeight="bold">
            Add Initial CITO Quota
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Stack direction="row" gap={2}>
              <Box sx={{ minWidth: 24, minHeight: 24 }}>
                <Icon icon="solar:info-circle-bold" color="red" height={24} width={24} />
              </Box>

              <Typography fontSize={14} color="#919EAB">
                The initial quota becomes the reference for the monthly quota. Make sure you enter
                the correct value.
              </Typography>
            </Stack>
            <Typography fontSize={14} sx={{ mt: 3 }}>
              Cito Type
            </Typography>
            <FormControl fullWidth sx={{ mt: 1.5 }}>
              {/* <InputLabel id="select-company">Cito Type</InputLabel> */}
              <Select
                value={methods.watch('cito_type') || ''}
                fullWidth
                onChange={(e: SelectChangeEvent<any>) => {
                  methods.setValue('cito_type', e.target.value);
                }}
              >
                <MenuItem value="holding-only">Only Holding</MenuItem>
                {data?.initial.some((item) => item.type === 'subsidiary') && (
                  <MenuItem value="all-sub-company">All Sub Company</MenuItem>
                )}
              </Select>

              <TableContainer sx={{ mt: 2 }}>
                <Table sx={{ borderRadius: 4 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="73%">
                        <Typography fontSize={14} color="#637381">
                          Company Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={14} color="#637381">
                          CITO Quota
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.initial
                      .filter((item) => item.type !== 'subsidiary')
                      .map((itm, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography fontSize={14}>{itm.company_name}</Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              // value={methods.watch(`quota.${idx}.quota`) || 0}
                              placeholder="Input"
                              type="number"
                              {...methods.register(`quota.${idx}.quota`)}
                              inputProps={{
                                onWheel: (event: any) => event.target.blur(),
                                max: 999,
                              }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newValue = e.target.value;
                                const dataValue = {
                                  company_id: itm.id,
                                  quota: Number(newValue),
                                  name: itm.company_name,
                                  type: itm.type,
                                };
                                methods.setValue(`quota.${idx}`, dataValue);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    {methods.watch('cito_type') === 'all-sub-company' && (
                      <>
                        {data?.initial.map(
                          (itm, idx) =>
                            itm.type === 'subsidiary' && (
                              <TableRow key={idx}>
                                <TableCell>
                                  <Typography sx={{ ml: 1.5 }} fontSize={14}>
                                    {itm.company_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    placeholder="Input"
                                    type="number"
                                    {...methods.register(`quota.${idx}.quota`)}
                                    inputProps={{
                                      onWheel: (event: any) => event.target.blur(),
                                      max: 999,
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      const newValue = e.target.value;
                                      const dataValue = {
                                        company_id: itm.id,
                                        quota: Number(newValue),
                                        name: itm.company_name,
                                        type: itm.type,
                                      };
                                      methods.setValue(`quota.${idx}`, dataValue);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </FormControl>

            <Stack direction="row" gap={2} sx={{ mt: 3 }} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setStep(2);
                  // onClose();

                  // const dataCito = {
                  //   cito_type: methods.watch('cito_type'),
                  //   initial: methods.watch('quota').map((item) => item),
                  // };
                }}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ px: 3, pt: 1, pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            <Icon icon="solar:danger-triangle-bold" width="50" height="50" color="#FFAC82" />
            <Typography fontSize={24} fontWeight="bold" textAlign="center" sx={{ mt: 2 }}>
              Make sure the initial quota value is correct!
            </Typography>
            <Typography fontSize={16} color="#637381" sx={{ mt: 2 }}>
              This value will be the basis of the quota given every month automatically
            </Typography>
          </Box>

          <TableContainer sx={{ mt: 2 }}>
            <Table sx={{ borderRadius: 4 }}>
              <TableHead>
                <TableRow>
                  <TableCell width="73%">
                    <Typography fontSize={14} color="#637381">
                      Company Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#637381">
                      CITO Quota
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {methods
                  .watch('quota')
                  .filter((item) => item.type !== 'subsidiary')
                  .map((itm, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography fontSize={14}>{itm.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={14}>{itm.quota || 0}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                {methods.watch('cito_type') === 'all-sub-company' && (
                  <>
                    {methods.watch('quota').map(
                      (itm, idx) =>
                        itm.type === 'subsidiary' && (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography sx={{ ml: 1.5 }} fontSize={14}>
                                {itm.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontSize={14}>{itm.quota || 0}</Typography>
                            </TableCell>
                          </TableRow>
                        )
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" gap={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => {
                setStep(1);
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const quota =
                  methods.watch('cito_type') === 'holding-only'
                    ? methods
                        .watch('quota')
                        .filter((item) => item.type !== 'subsidiary')
                        .map((item) => ({ company_id: item.company_id, quota: item.quota }))
                    : methods
                        .watch('quota')
                        .filter((item) => item.type === 'subsidiary')
                        .map((item) => ({ company_id: item.company_id, quota: item.quota }));

                mutation.mutate({ cito_type: methods.watch('cito_type'), quotas: quota });
                onClose();
                setStep(1);
                methods.reset();
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      )}
    </Dialog>
  );
}
