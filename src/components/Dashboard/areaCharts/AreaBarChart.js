import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../../style/AreaCharts.scss";

const AreaBarChart = ({ overduePayments, paidPayments, totalDebtAmount }) => {
  const [chartData, setChartData] = useState([]);
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    const monthlyData = {};

    allMonths.forEach(month => {
      monthlyData[month] = { month: month, paid: 0, remaining: 0 };
    });

    overduePayments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const month = paymentDate.toLocaleString('default', { month: 'short' });
      const year = paymentDate.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyData[month]) {
        monthlyData[month] = { month: month, paid: 0, remaining: 0 };
      };
      monthlyData[month].remaining += payment.amount;
    });

    paidPayments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const month = paymentDate.toLocaleString('default', { month: 'short' });
      const year = paymentDate.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyData[month]) {
        monthlyData[month] = { month: month, paid: 0, remaining: 0 };
      };
      monthlyData[month].paid += payment.amount;
    });

    setChartData(Object.values(monthlyData));
  }, [overduePayments, paidPayments]);

  const formatTooltipValue = (value) => {
    return `${value.toFixed(2)} TL`;
  };

  const formatYAxisLabel = (value) => {
    return `${(value / 1000).toFixed(0)}K TL`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Aylık Borç Durumu</h5>
        <div className="chart-info-data">
          {totalDebtAmount > 0 ? [] :
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
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
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
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              name={"Ödenmemiş"}
              dataKey="remaining"
              fill="#b0c4de"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
};
export default AreaBarChart;