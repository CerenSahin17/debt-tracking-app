import React from 'react';
import { Modal, Button, Input, Spin, Form } from 'antd';
import "../../style/AddDebtDetailModal.scss";

interface Props {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    onDelete: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    newDebt: {
        debtName: string;
        lenderName: string;
        debtAmount: string;
        interestRate: string;
        paymentStart: string;
        installment: string;
        description: string;
    };
    error: string;
    isEditMode: boolean;
    loading: boolean;
    loadingDelete: boolean;
};

const AddDebtModal: React.FC<Props> = ({
    visible,
    onCancel,
    onOk,
    onDelete,
    handleInputChange,
    newDebt,
    error,
    isEditMode,
    loading,
    loadingDelete
}) => {
    const calculateAmount = () => {
        if (newDebt.debtAmount && newDebt.interestRate) {
            const totalAmount = parseFloat(newDebt.debtAmount) * (1 + parseFloat(newDebt.interestRate) / 100);
            return totalAmount.toFixed(2);
        };
        return '';
    };

    const handleInputToUpper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const upperValue = value.toUpperCase();
        handleInputChange({ target: { name, value: upperValue } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    return (
        <Modal
            title={<span>{isEditMode ? 'Borcu Düzenle' : 'Borç Ekle'}</span>}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            style={{ borderRadius: 20 }}
            styles={{ body: { maxHeight: isEditMode ? '400px' : 'auto', overflowY: isEditMode ? 'auto' : 'hidden', padding: '20px' } }}
            footer={[
                <Button
                    key="back"
                    onClick={isEditMode ? onDelete : onCancel}
                    loading={isEditMode && loadingDelete}
                    style={{ color: 'rgba(0, 0, 0, 0.65)', borderColor: 'rgb(18, 26, 77)' }}
                >
                    {isEditMode ? 'Borcu Sil' : 'İptal'}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={onOk}
                    style={{ backgroundColor: 'rgb(18, 26, 77)' }}
                >
                    {isEditMode ? 'Borcu Düzenle' : 'Ödeme Planı Oluştur'}
                </Button>,
            ]}
        >
            {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Form layout="vertical">
                    <div className={isEditMode ? "scrollable-container" : undefined}>
                        <Form.Item label={isEditMode ? "Borç Adı" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.debtName}
                                type="text"
                                name="debtName"
                                placeholder="Borç Adı"
                                onChange={handleInputToUpper}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Borç Veren" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.lenderName}
                                type="text"
                                name="lenderName"
                                placeholder="Borç Veren"
                                onChange={handleInputToUpper}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Miktar" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.debtAmount}
                                type="number"
                                name="debtAmount"
                                placeholder="Miktar"
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Faiz Oranı" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.interestRate}
                                type="number"
                                name="interestRate"
                                placeholder="Faiz Oranı"
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Toplam Tutar" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={calculateAmount()}
                                type="text"
                                name="amount"
                                placeholder="Toplam Tutar"
                                readOnly
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Başlangıç Tarihi" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.paymentStart}
                                type="date"
                                name="paymentStart"
                                placeholder="Başlangıç Tarihi"
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Taksit" : null} style={{ marginBottom: "15px" }}>
                            <Input
                                value={newDebt.installment}
                                type="number"
                                name="installment"
                                placeholder="Taksit"
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label={isEditMode ? "Açıklama" : null} style={{ marginBottom: "15px" }}>
                            <Input.TextArea
                                name="description"
                                placeholder="Açıklama"
                                value={newDebt.description}
                                onChange={handleInputChange}
                                style={{ marginBottom: '1rem' }}
                            />
                        </Form.Item>
                    </div>
                </Form>
            )}
        </Modal>
    );
};
export default AddDebtModal;
