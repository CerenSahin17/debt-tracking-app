import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import "../../../style/AreaCharts.scss";

interface Payment {
  paymentDate: string;
  amount: number;
};

interface MonthlyData {
  month: string;
  paid: number;
  remaining: number;
  year: number;
  order: number;
};

interface AreaBarChartProps {
  overdueAllPayments: Payment[];
  paidPayments: Payment[];
  totalDebtAmount: number;
};

const AreaBarChart: React.FC<AreaBarChartProps> = ({
  overdueAllPayments,
  paidPayments,
  totalDebtAmount
}) => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const monthlyData: { [key: string]: MonthlyData } = {};

    allMonths.forEach((month, index) => {
      const key = `${month} ${currentYear}`;
      monthlyData[key] = { month: month, paid: 0, remaining: 0, year: currentYear, order: index };
    });

    if (overdueAllPayments) {
      overdueAllPayments.forEach((payment: Payment) => {
        const paymentDate = new Date(payment.paymentDate);
        const month = allMonths[paymentDate.getMonth()];
        const year = paymentDate.getFullYear();
        if (year === currentYear && allMonths.includes(month)) {
          const key = `${month} ${year}`;
          monthlyData[key].remaining += payment.amount;
        };
      });
    };

    if (paidPayments) {
      paidPayments.forEach((payment: Payment) => {
        const paymentDate = new Date(payment.paymentDate);
        const month = allMonths[paymentDate.getMonth()];
        const year = paymentDate.getFullYear();
        if (year === currentYear && allMonths.includes(month)) {
          const key = `${month} ${year}`;
          monthlyData[key].paid += payment.amount;
        };
      });
    };

    const sortedData = Object.values(monthlyData).sort((a, b) => a.order - b.order);
    setChartData(sortedData);
  }, [overdueAllPayments, paidPayments]);

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)} TL`;
  };

  const formatYAxisLabel = (value: number) => {
    return `${(value / 1000).toFixed(0)}K TL`;
  };

  const formatLegendValue = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Aylık Borç Durumu</h5>
        <div className="chart-info-data">
          {totalDebtAmount > 0 ? null :
            <div className="info-data-text">
              <p>Herhangi bir borcunuz bulunamamaktadır.</p>
            </div>
          }
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={formatTooltipValue} cursor={{ fill: "transparent" }} />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              name={"Ödenmiş"}
              dataKey="paid"
              fill="#475be8"
              stackId="a"
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              name={"Ödenmemiş"}
              dataKey="remaining"
              fill="#b0c4de"
              stackId="a"
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default AreaBarChart;
