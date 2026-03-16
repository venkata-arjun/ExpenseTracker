import React, { useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import CustomerBarChart from "../Charts/CustomerBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `$${new Intl.NumberFormat("en-US").format(Math.round(amount))}`;
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

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const chartData = useMemo(
    () => prepareIncomeBarChartData(transactions),
    [transactions],
  );

  const stats = useMemo(() => {
    if (!transactions?.length) {
      return {
        total: formatCurrency(0),
        high: formatCurrency(0),
        avg: formatCurrency(0),
        low: formatCurrency(0),
      };
    }

    const amounts = transactions.map((item) => Number(item?.amount || 0));
    const total = amounts.reduce((sum, value) => sum + value, 0);

    return {
      total: formatCurrency(total),
      high: formatCurrency(Math.max(...amounts)),
      avg: formatCurrency(total / amounts.length),
      low: formatCurrency(Math.min(...amounts)),
    };
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-base font-semibold sm:text-lg">
            Income Overview
          </h5>
          <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <button
          className="add-btn w-full justify-center sm:w-auto"
          onClick={onAddIncome}
        >
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall" value={stats.total} accent />
        <StatCard label="Highest" value={stats.high} />
        <StatCard label="Average" value={stats.avg} />
        <StatCard label="Lowest" value={stats.low} />
      </div>

      <div className="mt-6 sm:mt-8">
        <CustomerBarChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;
