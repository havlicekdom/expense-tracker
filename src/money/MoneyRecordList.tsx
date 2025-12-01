import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { MoneyRecordContext } from './MoneyRecordContext';
import { MoneyRecord } from '../types';
import { CategoryContext } from '../category/CategoryContext';
import { findCategoryById, isExpense } from '../utils';

type Props = {
  handleEditClick: (moneyRecord: MoneyRecord) => void;
  handleDeleteClick: (moneyRecord: MoneyRecord) => void;
}

function DataGridValueComponent({ row }: { row: MoneyRecord }) {
  const isRowExpense = isExpense(row);

  return (
    <Typography sx={{ color: isRowExpense ? 'error.main' : '' }}>{ `${isRowExpense ? '-' : ''}${row.value}` }</Typography>
  );
}

export function MoneyRecordList({ handleEditClick, handleDeleteClick }: Props) {
  const { moneyRecords } = useContext(MoneyRecordContext);

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', flex: 1 },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      valueGetter: (params) => {
        const { categories } = useContext(CategoryContext);
        const category = findCategoryById(categories, params.row.category);

        return category?.label;
      },
    },
    { field: 'info', headerName: 'Info', flex: 1 },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      renderCell: (params) => (
        <DataGridValueComponent row={params.row} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%', mt: 4 }}>
      <DataGrid
        rows={moneyRecords}
        columns={columns}
        pageSize={50}
      />
    </Box>
  );
}