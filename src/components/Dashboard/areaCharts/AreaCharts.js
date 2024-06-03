import React from "react";
import AreaBarChart from "./AreaBarChart";
import AreaProgressChart from "./AreaProgressChart";

const AreaCharts = ({ overduePayments, paidPayments, totalDebtAmount }) => {
  return (
    <section className="content-area-charts">
      <AreaBarChart overduePayments={overduePayments} paidPayments={paidPayments} totalDebtAmount={totalDebtAmount} />
      <AreaProgressChart overduePayments={overduePayments} totalDebtAmount={totalDebtAmount} />
    </section>
  );
};
export default AreaCharts;