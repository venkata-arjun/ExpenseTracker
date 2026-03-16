import React, { useMemo } from "react";
import {
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function fmtAxis(value) {
  if (value >= 1000) return `$${(Math.round(value / 100) / 10).toFixed(1)}k`;
  return `$${value}`;
}

function fmtFull(value) {
  return "$" + new Intl.NumberFormat("en-US").format(Math.round(Number(value)));
}

const ExpenseLineChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const amount = Number(payload[0]?.payload?.amount || 0);
    return (
      <div className="rounded-xl border border-violet-100 bg-white px-4 py-3 shadow-lg shadow-violet-100/50">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-600">
          {payload[0]?.payload?.dateLabel || "-"}
        </p>
        <p className="text-sm text-slate-500">
          Amount
          <span className="ml-2 text-base font-semibold text-slate-900">
            {fmtFull(amount)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, accent }) => (
  <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p
      className={`text-base font-semibold ${
        accent ? "text-violet-600" : "text-slate-800"
      }`}
    >
      {value}
    </p>
  </div>
);

const ExpenseLineChart = ({ data }) => {
  const stats = useMemo(() => {
    if (!data?.length) return null;
    const amounts = data.map((d) => Number(d.amount || 0));
    const total = amounts.reduce((a, b) => a + b, 0);
    return {
      total: fmtFull(total),
      high: fmtFull(Math.max(...amounts)),
      avg: fmtFull(total / amounts.length),
      low: fmtFull(Math.min(...amounts)),
    };
  }, [data]);

  if (!data?.length) {
    return (
      <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-400">
          No expense data to visualize yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5">
        <div>
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total expenses
          </p>
          <p className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {stats?.total}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white px-2 py-2 sm:px-3">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 2 }}
          >
            <defs>
              <linearGradient
                id="expenseLineGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient
                id="expenseAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.13} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={42}
              tickMargin={8}
              tickCount={5}
              tickFormatter={fmtAxis}
            />

            <Tooltip content={<ExpenseLineChartTooltip />} />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="none"
              fill="url(#expenseAreaGradient)"
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#expenseLineGradient)"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2, fill: "#ffffff", stroke: "#7c3aed" }}
              activeDot={{
                r: 5.5,
                strokeWidth: 2,
                stroke: "#7c3aed",
                fill: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Highest" value={stats?.high} accent />
        <StatCard label="Average" value={stats?.avg} />
        <StatCard label="Lowest" value={stats?.low} />
      </div>
    </div>
  );
};

export default ExpenseLineChart;
