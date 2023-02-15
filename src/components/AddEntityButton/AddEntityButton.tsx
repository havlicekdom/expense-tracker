import React from 'react';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

type Props = {
  handleAddClick: () => void;
  text: string;
}

function AddEntityButton({ text, handleAddClick }: Props) {
  return (
    <div>
      <Button variant="contained" onClick={handleAddClick}>
        <AddCircleIcon sx={{ mr: 1 }} />
        { text }
      </Button>
    </div>
  );
}

export default AddEntityButton;
