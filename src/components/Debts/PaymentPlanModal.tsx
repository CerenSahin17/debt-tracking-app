import React from 'react';
import { Modal, Button, Table } from 'antd';
import moment from 'moment';

interface PaymentPlanItem {
    paymentDate: string;
    paymentAmount: string;
};

interface Props {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    paymentPlan: PaymentPlanItem[];
    loading: boolean;
};

const PaymentPlanModal: React.FC<Props> = ({ visible, onCancel, onOk, paymentPlan, loading }) => {
    const columns = [
        {
            title: 'Taksit Tarihi',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (text: string) => moment(text).format('DD.MM.YYYY')
        },
        {
            title: 'Taksit Miktarı',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            render: (text: string) => `${parseFloat(text).toFixed(2)} TL`
        }
    ];

    return (
        <Modal
            title="Taksit Planı"
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel} style={{ color: 'rgba(0, 0, 0, 0.65)', borderColor: 'rgb(18, 26, 77)' }}>
                    Vazgeç
                </Button>,
                <Button key="submit" type="primary" onClick={onOk} style={{ backgroundColor: 'rgb(18, 26, 77)' }} loading={loading}>
                    Kaydet
                </Button>
            ]}
        >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={paymentPlan && paymentPlan.length > 0 ? paymentPlan.map((item, index) => ({ ...item, key: index })) : undefined}
                    pagination={false}
                />
            </div>
        </Modal>
    );
};
export default PaymentPlanModal;
