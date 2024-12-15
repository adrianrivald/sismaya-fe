import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form } from 'src/components/form/form';
import { FormHelperText } from '@mui/material';
import { Bounce, toast } from 'react-toastify';
import { useAuth } from './providers/auth';

// ----------------------------------------------------------------------

export function SignInView() {
  const { login } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    async (formData: any) => {
      console.log(formData, 'value');
      try {
        await login({ email: formData?.email, password: formData?.password });
      } catch (error) {
        console.log(error, 'er');
        toast.error(error?.message, {
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
      }
    },
    [login]
  );

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Form width="100%" onSubmit={handleSubmit}>
        {({ register, formState }) => (
          <>
            <Box sx={{ mb: 3 }}>
              <TextField
                error={Boolean(formState?.errors?.email)}
                fullWidth
                label="Email address"
                InputLabelProps={{ shrink: true }}
                {...register('email', {
                  required: 'Email must be filled out',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              {formState?.errors?.email && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {String(formState?.errors?.email?.message)}
                </FormHelperText>
              )}
            </Box>
            {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

            <Box sx={{ mb: 3 }}>
              <TextField
                error={Boolean(formState?.errors?.password)}
                fullWidth
                label="Password"
                {...register('password', {
                  required: 'Password must be filled out',
                })}
                InputLabelProps={{ shrink: true }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {formState?.errors?.password && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {String(formState?.errors?.password?.message)}
                </FormHelperText>
              )}
            </Box>

            <LoadingButton fullWidth size="large" type="submit" color="inherit" variant="contained">
              Sign in
            </LoadingButton>
          </>
        )}
      </Form>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Masuk</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography> */}
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
