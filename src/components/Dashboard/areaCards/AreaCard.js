import React from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../../style/AreaCards.scss";

const AreaCard = ({ percentFillValue, totalDebtAmount, colors, cardInfo, linkTo }) => {
  const filledValue = percentFillValue;
  const remainedValue = totalDebtAmount > 0 ? totalDebtAmount - filledValue : totalDebtAmount === 0 ? 0.01 : 0;

  const data = [
    { name: "Remained", value: remainedValue },
    { name: "Achieved Sales", value: filledValue },
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

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  cardInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  linkTo: PropTypes.string.isRequired
};
