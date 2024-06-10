import React from "react";
import '../../style/DebtListCard.scss';

interface Props {
    debtName: string;
    lenderName: string;
    debtAmount: string;
    interestRate: string;
    amount: string;
    paymentStart: string;
    installment: string;
    description: string;
    onClick: () => void;
    onEdit: () => void;
};

const DebtListCard: React.FC<Props> = ({ debtName, lenderName, debtAmount, interestRate, amount, paymentStart, installment, description, onClick, onEdit }) => {
    return (
        <div className="list-card bg-gray-100">
            <div>
                <div className="header">
                    <div>
                        <h3>Borç Adı: {lenderName}</h3>
                        <h3>Borç Veren: {debtName}</h3>
                        <p>Miktar: {debtAmount} TL</p>
                        <p>Faiz Oranı: {interestRate}%</p>
                        <p>Toplam: {amount} TL</p>
                        <p>Başlangıç Tarihi: {new Date(paymentStart).toLocaleDateString('tr-TR')}</p>
                        <p>Taksit Sayısı: {installment}</p>
                        <p>Açıklama: {description ? description : '-'}</p>
                    </div>
                    <div className="actions">
                        <div className="buttons">
                            <button onClick={onEdit}>Düzenle</button>
                            <button onClick={onClick} >Ödeme Planı Gör</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DebtListCard;
