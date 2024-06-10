import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePaymentPlanData, fetchPaymentPlanData } from '../../redux/paymentPlan/paymentSlice.tsx';
import { Modal, Button, Checkbox, Spin } from 'antd';
import moment from 'moment';

interface Props {
    visible: boolean;
    onCancel: () => void;
    paymentPlan: any;
    debtId: number;
};

const PaymentPlanListModal: React.FC<Props> = ({ visible, onCancel, paymentPlan, debtId }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (paymentId: string) => {
        try {
            setLoading(true);

            const paymentToUpdate = paymentPlan && paymentPlan.length > 0 ? paymentPlan.find(payment => payment.id === paymentId) : undefined;
            if (!paymentToUpdate) {
                console.error('Ödeme bulunamadı:', paymentId);
                setLoading(false);
                return;
            };

            const updatedPaymentData = {
                paymentDate: paymentToUpdate.paymentDate,
                paymentAmount: paymentToUpdate.paymentAmount,
                isPaid: true
            };

            //@ts-ignore
            await dispatch(updatePaymentPlanData({ paymentPlanId: paymentId, updatedData: updatedPaymentData }))
        } catch (error) {
        } finally {
            console.log('Ödeme işlemi başarıyla gerçekleştirildi.');
            //@ts-ignore
            await dispatch(fetchPaymentPlanData(debtId));
            setLoading(false);
        };
    };

    const renderPaymentPlans = () => {
        if (!paymentPlan || paymentPlan.length === 0) {
            return <div>Ödeme planı bulunmamaktadır.</div>;
        };

        return (
            paymentPlan && paymentPlan.length > 0 && paymentPlan.map((payment, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ marginRight: '20px' }}>
                        <strong>{index + 1}. Taksit</strong>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        {moment(payment.paymentDate).format('DD.MM.YYYY')}
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <span>{parseFloat(payment.paymentAmount)} TL</span>
                    </div>
                    <div>
                        <Checkbox
                            checked={payment.isPaid === true}
                            onChange={() => handlePayment(payment.id)}
                            disabled={payment.isPaid === true}
                        />
                        {payment.isPaid ? <span style={{ marginLeft: '5px', color: 'green' }}>Ödendi</span> : null}
                    </div>
                </div>
            ))
        );
    };

    return (
        <Modal
            title="Taksit Planı"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="submit" onClick={onCancel} type="primary" style={{ backgroundColor: 'rgb(18, 26, 77)' }}>
                    Kapat
                </Button>
            ]}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    renderPaymentPlans()
                )}
            </div>
        </Modal>
    );
};
export default PaymentPlanListModal;

