import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Box, Stack, Grid, Rating, TextField, Divider, FormHelperText } from '@mui/material';
import { useAddRequestReview, useRequestById } from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';
import { LoadingButton } from '@mui/lab';
import { Form } from 'src/components/form/form';

export function RequestReviewView() {
  const { id, vendor } = useParams();
  const { mutate: addRequestReview } = useAddRequestReview();
  const { data: requestDetail } = useRequestById(id ?? '');
  const [rating, setRating] = useState<number | null>(0);

  const handleSubmit = (formData: { description: string }) => {
    // TODO Submit review
    addRequestReview({
      id: Number(id),
      rating: Number(rating),
      description: formData?.description,
    });
  };

  console.log(rating, 'rating');

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={12}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Review Request {requestDetail?.number}
            </Typography>
          </Box>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography variant="h5">Review Request</Typography>
            <Typography variant="h5">{(vendor ?? '').toUpperCase()} Request Management</Typography>
          </Box>
          <Divider />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap={8}
            mt={8}
          >
            <Typography fontSize={32}>Review request : {requestDetail?.number}</Typography>
            <Form
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
              width="100%"
              onSubmit={handleSubmit}
            >
              {({ register, watch, formState, setValue, control }) => (
                <>
                  <Rating
                    size="large"
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    sx={{
                      fontSize: '3rem',
                    }}
                  />{' '}
                  <Stack
                    sx={{
                      width: '80%',
                    }}
                  >
                    <TextField
                      error={Boolean(formState?.errors?.description)}
                      multiline
                      label="Description"
                      rows={8}
                      {...register('description', {
                        required: 'Description must be filled out',
                      })}
                    />
                    {formState?.errors?.description && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.description?.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                  <LoadingButton
                    size="small"
                    // loading={isLoading}
                    loadingIndicator="Submitting..."
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      width: '80%',
                      py: 2,
                    }}
                  >
                    Submit
                  </LoadingButton>
                </>
              )}
            </Form>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
