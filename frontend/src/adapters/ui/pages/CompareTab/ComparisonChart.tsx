import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Comparison } from '../../../../core/domain/Comparison';

interface ComparisonChartProps {
  comparisons: Comparison[];
  targetValue: number;
}

function ComparisonChart({ comparisons, targetValue }: ComparisonChartProps) {
  const chartData = comparisons.map((comp) => ({
    year: comp.year.toString(),
    baseline: comp.baselineIntensity,
    actual: comp.actualIntensity,
    target: targetValue,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        GHG Intensity Comparison Chart
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: 'gCO2e/MJ', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: number) => value.toFixed(4) + ' gCO2e/MJ'}
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <ReferenceLine
            y={targetValue}
            label="Target"
            stroke="#9ca3af"
            strokeDasharray="3 3"
          />
          <Bar dataKey="baseline" fill="#3b82f6" name="Baseline Intensity" />
          <Bar dataKey="actual" fill="#10b981" name="Actual Intensity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
