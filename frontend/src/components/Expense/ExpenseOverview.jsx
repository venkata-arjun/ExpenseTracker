import React, { useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import ExpenseLineChart from "../Charts/ExpenseLineChart";
import { prepareExpenseLineChartData } from "../../utils/helper";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const chartData = useMemo(
    () => prepareExpenseLineChartData(transactions),
    [transactions],
  );

  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-base font-semibold sm:text-lg">
            Expense Overview
          </h5>
          <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
            Review your spending over time and keep expenses under control.
          </p>
        </div>

        <button
          className="add-btn w-full justify-center sm:w-auto"
          onClick={onAddExpense}
        >
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      <div className="mt-6 sm:mt-8">
        <ExpenseLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
