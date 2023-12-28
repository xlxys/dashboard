import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Stack 
      sx={{ color: 'grey.500', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} 
      spacing={2} 
      direction="row"
    >
      <CircularProgress color="inherit" />
    </Stack>
  );
}