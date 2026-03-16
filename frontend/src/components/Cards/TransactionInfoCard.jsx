import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const isIncome = type === "income";

  const getAmountStyles = () =>
    isIncome
      ? "border border-green-100 bg-green-50 text-green-700"
      : "border border-red-100 bg-red-50 text-red-700";

  const dateText = String(date || "").trim();
  const dateParts = dateText.split(" ").filter(Boolean);
  const year = dateParts.length > 1 ? dateParts.pop() : "";
  const dayMonth = dateParts.length ? dateParts.join(" ") : dateText;

  const normalizedAmount = Number(amount);
  const formattedAmount = Number.isFinite(normalizedAmount)
    ? new Intl.NumberFormat("en-IN").format(normalizedAmount)
    : amount;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700">
          {icon ? (
            <img src={icon} alt={title} className="h-6 w-6 object-contain" />
          ) : (
            <LuUtensils />
          )}
        </div>

        <div className="min-w-0">
          <p className="wrap-break-word text-sm font-semibold text-gray-800 sm:text-[15px]">
            {title}
          </p>
          <p className="text-xs text-gray-500 sm:text-sm">
            {dayMonth}
            {year && <span className="ml-1">{year}</span>}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-2 sm:ml-3 sm:w-auto sm:gap-3">
        {!hideDeleteBtn && (
          <button
            type="button"
            aria-label="Delete transaction"
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}

        <div
          className={`flex min-w-27 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:min-w-30 sm:gap-2 sm:px-3 ${getAmountStyles()}`}
          title={`${isIncome ? "+" : "-"} ₹${formattedAmount}`}
        >
          <h6 className="truncate text-[11px] font-medium tabular-nums sm:text-sm">
            {isIncome ? "+" : "-"} ₹{formattedAmount}
          </h6>
          {isIncome ? <LuTrendingUp size={14} /> : <LuTrendingDown size={14} />}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
