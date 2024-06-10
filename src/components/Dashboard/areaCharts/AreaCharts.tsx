import React from "react";
import AreaBarChart from "./AreaBarChart.tsx";
import AreaProgressChart from "./AreaProgressChart.tsx";
import { v4 as uuidv4 } from 'uuid';

interface Payment {
  paymentDate: string;
  amount: number;
  lenderName: string;
};

interface AreaChartsProps {
  overduePayments: Payment[];
  paidPayments: Payment[];
  overdueAllPayments: Payment[];
  totalDebtAmount: number;
};

const AreaCharts: React.FC<AreaChartsProps> = ({
  overduePayments,
  paidPayments,
  overdueAllPayments,
  totalDebtAmount
}) => {
  const uniqueKeyForAreaBarChart = uuidv4();
  const uniqueKeyForAreaProgressChart = uuidv4();

  return (
    <section className="content-area-charts">
      <AreaBarChart
        key={uniqueKeyForAreaBarChart}
        overdueAllPayments={overdueAllPayments}
        paidPayments={paidPayments}
        totalDebtAmount={totalDebtAmount}
      />
      <AreaProgressChart
        key={uniqueKeyForAreaProgressChart}
        overduePayments={overduePayments}
        totalDebtAmount={totalDebtAmount}
      />
    </section>
  );
};
export default AreaCharts;
