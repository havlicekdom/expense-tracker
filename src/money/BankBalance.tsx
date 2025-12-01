import { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { MoneyRecordContext } from './MoneyRecordContext';
import { getCurrentBalance } from '../utils';

export function BankBalance() {
  const { moneyRecords } = useContext(MoneyRecordContext);
  const currentBalance = getCurrentBalance(moneyRecords);

  return (
    <Card>
      <CardContent>
        <Typography component="h3" variant="h5">
          Current balance
        </Typography>
        <Typography sx={{ mt: 3, mb: 3 }} component="h3" variant="h4">
          { currentBalance }
        </Typography>
        <Typography variant="body2">
          As of today
        </Typography>
      </CardContent>
    </Card>
  );
}