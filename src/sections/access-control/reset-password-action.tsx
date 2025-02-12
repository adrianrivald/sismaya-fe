import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Iconify } from 'src/components/iconify';

interface RemoveActionProps {
  isShowResetPasswordPopup: boolean;
  setIsShowResetPasswordPopup: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
}

export function ResetPasswordAction({
  isShowResetPasswordPopup,
  setIsShowResetPasswordPopup,
  onSubmit,
}: RemoveActionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  return (
    <Dialog
      onClose={() => setIsShowResetPasswordPopup(false)}
      open={!!isShowResetPasswordPopup}
      sx={{
        p: 3,
      }}
    >
      <DialogTitle>Reset Password</DialogTitle>

      <Box sx={{ width: '37.5rem' }} px={3}>
        <Typography>New Password</Typography>
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            onChange={onChangePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="outlined-search-helper-text"
            inputProps={{
              'aria-label': 'search',
            }}
            placeholder="at least 8 characters"
          />
        </FormControl>

        <Box mt={3} pb={3} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <Button
            disabled={inputPassword?.length === 0}
            type="submit"
            onClick={onSubmit}
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
