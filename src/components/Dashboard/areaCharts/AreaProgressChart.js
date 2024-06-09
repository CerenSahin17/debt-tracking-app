import React from "react";

const AreaProgressChart = ({ overduePayments, totalDebtAmount }) => {
    const sortedOverduePayments = overduePayments.sort((a, b) =>
        new Date(a.paymentDate) - new Date(b.paymentDate)
    );

    const isOverdue = (paymentStart) => {
        const today = new Date();
        const paymentDate = new Date(paymentStart);
        return paymentDate < today.setHours(0, 0, 0, 0);
    };

    const isToday = (paymentStart) => {
        const today = new Date();
        const paymentDate = new Date(paymentStart);
        return paymentDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="progress-bar">
            <div>
                <h4 className="progress-bar-title">Ödeme Tarihi Yaklaşan/Geçen Borçlar</h4>
            </div>
            <div className="progress-bar-list">
                {sortedOverduePayments.length > 0 ? (
                    sortedOverduePayments.map((debt, index) => {
                        const debtPercentage = (debt.amount / totalDebtAmount) * 100;
                        const lenderNameDisplay = debt.lenderName.length > 12 ? `${debt.lenderName.substring(0, 11)}...` : debt.lenderName;
                        const textStyle = {
                            color: isOverdue(debt.paymentDate) ? "#DC3545" : isToday(debt.paymentDate) ? "rgb(71, 91, 232)" : "inherit"
                        };

                        return (
                            <div className="progress-bar-item" key={index}>
                                <div className="bar-item-info">
                                    <p className="bar-item-info-name" style={textStyle}>
                                        {lenderNameDisplay} - {new Date(debt.paymentDate).toLocaleDateString('tr-TR')}
                                    </p>
                                    <p>{formatCurrency(debt.amount)}</p>
                                </div>
                                <div className="bar-item-full">
                                    <div
                                        className="bar-item-filled"
                                        style={{
                                            width: `${debtPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>
                        <p>Yaklaşan borcunuz bulunmamaktadır.</p>
                    </div>
                )}
            </div>
            <p className="progress-description-title">*Tüm borçlarınızı borçlarım sayfasından görebilirsiniz.</p>
        </div>
    );
};
export default AreaProgressChart;
