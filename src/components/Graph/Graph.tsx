import React, { useContext, useEffect, useState } from 'react';
import {
  Pie, PieChart, Legend, Cell,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CategoryContext } from '../../context/CategoryContext';
import { MoneyRecordContext } from '../../context/MoneyRecordContext';
import { getGraphData, getRandomColor } from '../../utils';
import { RecordType } from '../../types';

type GraphData = {
  category: string;
  value: number;
}

type Props = {
  type: RecordType;
  title: string;
}

function Graph({ type, title }: Props) {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const { categories } = useContext(CategoryContext);
  const { moneyRecords } = useContext(MoneyRecordContext);

  useEffect(() => {
    setGraphData(getGraphData(moneyRecords, categories, type));
  }, [categories, moneyRecords]);

  return (
    <Box sx={{ mt: 6, mb: 2 }}>
      <Typography variant="h6">
        { title }
      </Typography>
      { graphData.length <= 0 && (
        <Typography variant="body2">
          No data.
        </Typography>
      ) }
      { graphData.length > 0 && (
      <PieChart width={400} height={400}>
        <Pie data={graphData} dataKey="value" nameKey="category" fill="#8884d8">
          {graphData.map((value) => (<Cell key={`cell-${value.category}`} fill={getRandomColor()} />))}
        </Pie>
        <Legend />
      </PieChart>
      ) }
    </Box>
  );
}

export default Graph;
