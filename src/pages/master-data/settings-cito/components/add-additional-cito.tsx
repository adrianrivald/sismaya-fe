import { Icon } from '@iconify/react';
import {
  Dialog,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { AdditionalCitoListType } from 'src/services/settings-cito/schemas/type';
import { useUpdateAdditionalQuota } from 'src/services/settings-cito/use-additional-cito';
import { uploadFilesBulk } from 'src/services/utils/upload-image';

interface DialogAddAdditionalCitoProps {
  open: boolean;
  onClose: () => void;
  data: AdditionalCitoListType;
  cito_type: string;
}

function bytesToMB(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function DialogAddAdditionalCito({
  open,
  onClose,
  data,
  cito_type,
}: DialogAddAdditionalCitoProps) {
  console.log('dataa', data);
  const methods = useForm<{
    files: {
      file_size: number;
      file_name: string;
      file_number: string;
      files: File;
      file_url: string;
    }[];
    cito_type: string;
    quota: { company_id: number; quota: number; name: string; type: string }[];
  }>({
    defaultValues: {
      files: [],
      cito_type: '',
      quota: [],
    },
  });

  const { control } = methods;
  const { append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const mutation = useUpdateAdditionalQuota(data?.id, () => {
    onClose();
    methods.reset();
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    /* eslint-disable no-restricted-syntax */
    for (const file of Array.from(files)) {
      if (file.size <= MAX_FILE_SIZE_BYTES) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    }

    if (rejectedFiles.length > 0) {
      toast.error('Please check your file. Some file more than 5 MB', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });

      return;
    }

    if (validFiles.length > 0) {
      const existingLength = methods.watch('files').length;

      for (const [index, file] of validFiles.entries()) {
        const sequenceNumber = existingLength + index + 1;

        const filesData = new FormData();
        filesData.append('files', file); // upload only current file

        try {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          uploadFilesBulk(filesData).then((dataUpload) => {
            append({
              file_size: file.size,
              file_name: file.name,
              file_number: `PO_${String(sequenceNumber).padStart(3, '0')}`,
              files: file,
              file_url: dataUpload?.data?.[0]?.url,
            });
          });
        } catch (error) {
          console.error('Upload failed for:', file.name, error);
          // Optional: show error toast or skip append
        }
      }
    }

    event.target.value = '';
  };

  useEffect(() => {
    if (open) {
      methods.reset({
        cito_type,
        quota: data?.details?.map((item) => ({
          company_id: item.id,
          name: item.company_name,
          quota: item.quota || 0,
        })),
        files:
          data?.documents?.map((item: any, index: number) => ({
            file_size: 0,
            file_name: item.document.split('/').pop(),
            file_number: index === 0 ? data.po_number : '',
            files: undefined,
            file_url: item.document,
          })) || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cito_type, data]);

  const onSubmit = async () => {
    const formData = methods.watch();

    const dataMutation = {
      details: formData.quota.map((item) => ({ id: item.company_id, quota: item.quota })),
      po_number: formData.files.map((item) => item.file_number).join(','),
      documents: formData?.files?.map((item) => item.file_url),
    };

    mutation.mutate(dataMutation);
  };

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
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Add Additional CITO Quota
        </Typography>

        <Stack sx={{ mt: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontSize={14}>PO Documents</Typography>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick();
            }}
          >
            Add PO Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            style={{ display: 'none' }}
            multiple
          />
        </Stack>
        <Box>
          {methods.watch('files').length > 0 && (
            <Stack direction="row" gap={1} sx={{ my: 1.5 }}>
              <Box sx={{ minWidth: 24, minHeight: 24 }}>
                <Icon icon="solar:info-circle-bold" color="red" height={20} width={20} />
              </Box>

              <Typography fontSize={14} color="#919EAB">
                Please upload the Purchase Order (PO) document before proceeding with additional
                quota.
              </Typography>
            </Stack>
          )}

          {methods.watch('files').map((item, index) => (
            <Box border={0.2} borderRadius={1} mt={1} key={index}>
              <Stack p={1.5} flexDirection="row" justifyContent="space-between">
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Icon icon="bxs:file" width="22" height="22" color="orange" />
                  <Box>
                    <Typography fontSize={14} fontWeight="bold">
                      {item.file_name}
                    </Typography>
                    <Typography fontSize={12}>{bytesToMB(item.file_size)}</Typography>
                  </Box>
                </Stack>

                <Button
                  onClick={() => {
                    remove(index);
                  }}
                  sx={{ p: 0, pl: 1.5, minWidth: 4 }}
                  startIcon={<Icon icon="material-symbols-light:close" width="18" height="18" />}
                />
              </Stack>
            </Box>
          ))}
          {methods.watch('files').length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" gap={0.5}>
                <Typography fontSize={14} fontWeight="bold">
                  PO Number
                </Typography>
                <Typography fontSize={14} color="#919EAB">
                  (Use separator if more than one PO number)
                </Typography>
              </Stack>

              <TextField
                value={methods
                  .watch('files')
                  .map((item) => item.file_number)
                  .join(', ')}
                fullWidth
                sx={{ mt: 2 }}
                disabled
              />
            </Box>
          )}

          <Typography fontWeight="bold" sx={{ mt: 2 }}>
            CITO Type
          </Typography>
          <FormControl fullWidth sx={{ mt: 1.5 }}>
            {/* <InputLabel id="select-company">Cito Type</InputLabel> */}
            <Select
              value={methods.watch('cito_type') || ''}
              fullWidth
              onChange={(e: SelectChangeEvent<any>) => {
                methods.setValue('cito_type', e.target.value);
              }}
              disabled
            >
              <MenuItem value="holding-only">Only Holding</MenuItem>
              {methods.watch('cito_type') === 'all-sub-company' && (
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
                  {methods.watch('quota').map((itm, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography fontSize={14}>{itm.name}</Typography>
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
                              company_id: itm.company_id,
                              quota: Number(newValue),
                              name: itm.name,
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
                                      company_id: itm.company_id,
                                      quota: Number(newValue),
                                      name: itm.name,
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
        </Box>

        <Stack direction="row" gap={2} sx={{ mt: 3 }} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={methods.watch('files').length < 1}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
