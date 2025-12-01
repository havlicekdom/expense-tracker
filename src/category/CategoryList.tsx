import { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { CategoryContext } from './CategoryContext';
import { Category } from '../types';

type Props = {
  handleEditClick: (category: Category) => void;
  handleDeleteClick: (category: Category) => void;
}

export function CategoryList({ handleEditClick, handleDeleteClick }: Props) {
  const { categories } = useContext(CategoryContext);

  const renderList = () => categories.map((category) => (
    <ListItem
      divider
      key={category.id}
      secondaryAction={(
        <>
          <IconButton onClick={() => handleEditClick(category)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(category)}>
            <DeleteIcon />
          </IconButton>
        </>
    )}
    >
      <ListItemText primary={category.label} />
    </ListItem>
  ));

  return (
    <List sx={{ mt: 2 }}>
      { renderList() }
    </List>
  );
}