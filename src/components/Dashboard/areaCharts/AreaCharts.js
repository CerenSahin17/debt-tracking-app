import React from "react";
import AreaBarChart from "./AreaBarChart";
import AreaProgressChart from "./AreaProgressChart";
import { v4 as uuidv4 } from 'uuid';

const AreaCharts = ({ overduePayments, paidPayments, overdueAllPayments, totalDebtAmount }) => {
  const uniqueKeyForAreaBarChart = uuidv4();
  const uniqueKeyForAreaProgressChart = uuidv4();

  return (
    <section className="content-area-charts">
      <AreaBarChart key={uniqueKeyForAreaBarChart} overdueAllPayments={overdueAllPayments} paidPayments={paidPayments} totalDebtAmount={totalDebtAmount} />
      <AreaProgressChart key={uniqueKeyForAreaProgressChart} overduePayments={overduePayments} totalDebtAmount={totalDebtAmount} />
    </section>
  );
};
export default AreaCharts;
