import React from "react";
import '../../style/DebtListCard.scss';

const DebtListCard = ({ debtName, lenderName, debtAmount, interestRate, amount, paymentStart, installment, description }) => {
    return (
        <div className="list-card bg-gray-100">
            <div>
                <div className="header">
                    <div>
                        <h3>{lenderName}</h3>
                        <h3>{debtName}</h3>
                        <p>Miktar: {debtAmount}</p>
                        <p>Faiz Oranı: {interestRate}%</p>
                        <p>Toplam: {amount}</p>
                        <p>Başlangıç Tarihi: {new Date(paymentStart).toLocaleDateString('tr-TR')}</p>
                        <p>Taksit Sayısı: {installment}</p>
                        <p>Açıklama: {description}</p>
                    </div>
                    <div className="actions">
                        <div className="buttons">
                            <button>Düzenle</button>
                            <button>Ödeme Planı Gör</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DebtListCard;
