import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../../style/AreaCards.scss";

interface CardInfo {
  title: string;
  value: string;
  text: string;
};

interface AreaCardProps {
  percentFillValue?: number;
  totalDebtAmount?: number;
  colors: string[];
  cardInfo: CardInfo;
  linkTo: string;
};

const AreaCard: React.FC<AreaCardProps> = ({ percentFillValue, totalDebtAmount, colors, cardInfo, linkTo }) => {
  const filledValue = percentFillValue || 0;
  const remainedValue = totalDebtAmount !== undefined ? totalDebtAmount > 0 ? totalDebtAmount - filledValue : 0.01 : undefined;

  const data = [
    { name: "Remained", value: remainedValue },
    { name: "Achieved Sales", value: filledValue }
  ];

  return (
    <div className="area-card">
      <div>
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">
          {cardInfo.value}
        </div>
        <div>
          <Link to={linkTo} className="info-div">
            <p className="info-text">{cardInfo.text}
              <FontAwesomeIcon icon={faArrowRight} className="info-icon" />
            </p>
          </Link>
        </div>
      </div>
      <div>
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx={50}
            cy={45}
            innerRadius={20}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={-270}
            endAngle={150}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};
export default AreaCard;
