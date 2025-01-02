import { Box, Button, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { Form } from 'src/components/form/form';
import ModalDialog from 'src/components/modal/modal';

interface RejectActionProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (formData: { reason: string }) => void;
}

export function RejectAction({ open, setOpen, handleSubmit }: RejectActionProps) {
  return (
    <ModalDialog
      open={open}
      setOpen={setOpen}
      minWidth={600}
      title="Reject Request?"
      content={
        (
          <Box mt={2}>
            <Typography>Please fill in rejection reason.</Typography>
            <Form width="100%" onSubmit={handleSubmit}>
              {({ register, control, formState, watch }) => (
                <>
                  <TextField
                    autoComplete="off"
                    multiline
                    sx={{
                      marginTop: 2,
                      width: '100%',
                    }}
                    label="Rejection Reason"
                    rows={4}
                    {...register('reason', {
                      required: 'Reason must be filled out',
                    })}
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Button
                      onClick={() => setOpen(false)}
                      type="button"
                      sx={{
                        paddingY: 0.5,
                        border: 1,
                        borderColor: 'primary.main',
                        borderRadius: 1.5,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      sx={{
                        paddingY: 1,
                        paddingX: 2.5,
                        backgroundColor: 'error.light',
                        borderRadius: 1.5,
                        color: 'white',
                        fontWeight: 'normal',
                      }}
                    >
                      Reject Request
                    </Button>
                  </Box>
                </>
              )}
            </Form>
          </Box>
        ) as any
      }
    >
      {/* Button Open Modal */}
      <Button
        type="button"
        sx={{
          paddingY: 1,
          paddingX: 2.5,
          backgroundColor: 'error.light',
          borderRadius: 1.5,
          color: 'white',
          fontWeight: 'normal',
        }}
      >
        Reject Request
      </Button>
    </ModalDialog>
  );
}
