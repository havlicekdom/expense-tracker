/* eslint-disable react/jsx-props-no-spreading */

import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LoginIcon from '@mui/icons-material/Login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { AuthContext } from './AuthContext';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email('This is not a valid email').required('Please fill in your email'),
  password: yup.string().required('Please fill in your password'),
}).required();

export function LoginForm() {
  const { loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    loginUser(data.email);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          padding: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            required
            {...register('email')}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            required
            {...register('password')}
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
            <LoginIcon sx={{ mr: 1 }} />
            Log in
          </Button>
        </Box>
      </Box>
    </Container>
  );
}