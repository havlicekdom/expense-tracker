import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { CategoryDashboard } from "../category/CategoryDashboard";
import { MoneyRecordDashboard } from "../money/MoneyRecordDashboard";
import { BankBalance } from "../money/BankBalance";
import { Graph } from "./Graph";

export function UserDashboard() {
  return (
    <Box sx={{ mt: 5 }}>
      <Grid container>
        <Grid xs={12} md={4}>
          <CategoryDashboard />
        </Grid>
        <Grid xs={12} md={6} mdOffset={2}>
          <BankBalance />
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={12} md={6}>
          <Graph title="Expenses" type="expense" />
        </Grid>
        <Grid xs={12} md={6}>
          <Graph title="Incomes" type="income" />
        </Grid>
      </Grid>
      <MoneyRecordDashboard />
    </Box>
  );
}
