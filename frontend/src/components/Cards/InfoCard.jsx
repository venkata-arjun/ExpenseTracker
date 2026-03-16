import React from "react";

const InfoCard = ({ icon, label, value, color = "bg-violet-500" }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm shadow-gray-100 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-gray-200/80">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl text-white shadow-md ${color}`}
      >
        {icon}
      </div>

      <div className="h-10 w-px bg-gray-100" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xl font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
