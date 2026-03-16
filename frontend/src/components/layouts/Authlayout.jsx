import React from "react";
import CARD_2 from "../../assets/images/hero-image.jpg";

const Authlayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      <div className="relative hidden h-screen w-[40vw] overflow-hidden bg-white md:block">
        <img
          src={CARD_2}
          alt="Expense tracker illustration"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default Authlayout;
