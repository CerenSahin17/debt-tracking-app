import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePaymentPlanData, fetchPaymentPlanData } from '../../redux/paymentPlan/paymentSlice';
import { Modal, Button, Checkbox, Spin } from 'antd';
import moment from 'moment';

const PaymentPlanListModal = ({ visible, onCancel, paymentPlan, debtId }) => {
    console.log(paymentPlan, '993933939')
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (paymentId) => {
        try {
            setLoading(true);

            const paymentToUpdate = paymentPlan.data.find(payment => payment.id === paymentId);
            const updatedPaymentData = {
                paymentDate: paymentToUpdate.paymentDate,
                paymentAmount: paymentToUpdate.paymentAmount,
                isPaid: true
            };

            await dispatch(updatePaymentPlanData({ paymentPlanId: paymentId, updatedData: updatedPaymentData }));
            await dispatch(fetchPaymentPlanData(debtId));

            console.log('Ödeme işlemi başarıyla gerçekleştirildi.');
        } catch (error) {
            console.error('Ödeme işlemi sırasında bir hata oluştu:', error);
        } finally {
            setLoading(false);
        };
    };

    const renderPaymentPlans = () => {
        if (!paymentPlan || !Array.isArray(paymentPlan.data)) {
            return <div>Ödeme planı bulunmamaktadır.</div>;
        };

        return paymentPlan.data.map((payment, index) => (
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
        ));
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
