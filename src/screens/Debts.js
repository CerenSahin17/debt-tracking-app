import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData, addDebt } from '../redux/debt/debtSlice';
import { Button, Modal, Table, InputNumber } from 'antd';
import Navbar from '../components/Navbar';
import DebtListCard from '../components/Debts/DebtListCard';
import '../style/AreaCards.scss';

const Debts = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const debtData = useSelector((state) => state.debt.data);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDebt, setNewDebt] = useState({
        debtName: '',
        lenderName: '',
        debtAmount: 0,
        interestRate: 0,
        amount: 0,
        paymentStart: new Date().toISOString().substr(0, 10),
        installment: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [paymentPlanVisible, setPaymentPlanVisible] = useState(false);
    const [paymentPlan, setPaymentPlan] = useState([]);

    useEffect(() => {
        if (user) {
            dispatch(fetchDebtData());
        };
    }, [user, dispatch]);

    const sortedDebt = [...debtData].sort((a, b) =>
        new Date(a.paymentStart) - new Date(b.paymentStart)
    );

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const { debtAmount, interestRate, installment } = newDebt;

        if (!newDebt.debtName || !newDebt.lenderName || !debtAmount || !interestRate || !installment || !newDebt.paymentStart) {
            setError('Lütfen tüm alanları eksiksiz doldurun. Açıklama eklemek zorunda değilsiniz.');
        } else {
            const totalAmount = parseFloat(debtAmount) * (1 + parseFloat(interestRate) / 100);
            const installmentCount = parseInt(installment);
            const paymentAmount = totalAmount / installmentCount;

            const paymentPlan = Array.from({ length: installmentCount }).map((_, index) => {
                const paymentDate = new Date(newDebt.paymentStart);
                paymentDate.setMonth(paymentDate.getMonth() + index + 1);
                return {
                    paymentDate: paymentDate.toISOString().substr(0, 10),
                    paymentAmount: parseFloat(paymentAmount.toFixed(2))
                };
            });

            const debtDataWithPaymentPlan = {
                ...newDebt,
                debtAmount: parseFloat(debtAmount),
                interestRate: parseFloat(interestRate),
                amount: parseFloat(totalAmount.toFixed(2)),
                installment: installmentCount,
                paymentPlan: paymentPlan
            };
            setPaymentPlan(debtDataWithPaymentPlan);
            setPaymentPlanVisible(true);
            console.log('Debt Body', debtDataWithPaymentPlan);
        };
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedDebt = { ...newDebt, [name]: value };

        if (name === 'debtAmount' || name === 'interestRate') {
            const debtAmount = parseFloat(updatedDebt.debtAmount) || 0;
            const interestRate = parseFloat(updatedDebt.interestRate) || 0;
            const totalAmount = debtAmount * (1 + interestRate / 100);
            updatedDebt.amount = totalAmount.toFixed(2);
        };

        setNewDebt(updatedDebt);
        setError('');
    };

    const handleSave = () => {
        dispatch(addDebt(debtData));
        dispatch(fetchDebtData());
        setPaymentPlanVisible(false);
        setIsModalVisible(false);
    };

    const handleBack = () => {
        setPaymentPlanVisible(false);
    };

    const columns = [
        {
            title: 'Taksit Tarihi',
            dataIndex: 'paymentDate',
            key: 'paymentDate'
        },
        {
            title: 'Taksit Miktarı',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            render: (text, record, index) => (
                <InputNumber
                    min={0}
                    defaultValue={text}
                />
            )
        }
    ];

    const PaymentPlanTable = ({ paymentPlan }) => {
        return <Table columns={columns} dataSource={paymentPlan} pagination={false} />;
    };

    return (
        <div>
            <Navbar />
            <div className='content-area'>
                <div className="text-center md:text-left flex justify-center">
                    <button className="mt-6 bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" style={{ backgroundColor: 'rgb(18, 26, 77)' }} type="submit" onClick={showModal}>Borç Ekle</button>
                </div>
                <Modal
                    title={<span style={{ color: 'rgb(18, 26, 77)' }}>Borç Ekle</span>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    style={{ borderRadius: 20 }}
                    bodyStyle={{ padding: "20px" }}
                    footer={[
                        <Button key="back" onClick={handleCancel} style={{ color: 'rgba(0, 0, 0, 0.65)', borderColor: 'rgb(18, 26, 77)' }}>
                            İptal
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk} style={{ backgroundColor: 'rgb(18, 26, 77)' }}>
                            Ödeme Planı Oluştur
                        </Button>,
                    ]}
                >
                    {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="text" id="debtName" name="debtName" placeholder="Borç Adı" onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="text" id="lenderName" name="lenderName" placeholder="Borç Veren" onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="number" id="debtAmount" name="debtAmount" placeholder="Miktar" onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="number" id="interestRate" name="interestRate" placeholder="Faiz Oranı" onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="text" id="amount" name="amount" placeholder="Toplam Tutar" value={newDebt.amount} readOnly />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="date" id="paymentStart" name="paymentStart" placeholder="Başlangıç Tarihi" value={newDebt.paymentStart || new Date().toISOString().substr(0, 10)} onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="number" id="installment" name="installment" placeholder="Taksit" onChange={handleInputChange} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <input className="text-sm w-full px-4 py-2.5 border border-solid border-gray-300 rounded mb-2" type="text" id="description" name="description" placeholder="Açıklama" onChange={handleInputChange} />
                    </div>
                </Modal>
                {paymentPlanVisible && (
                    <Modal
                        title="Taksit Planı"
                        visible={paymentPlanVisible}
                        onOk={handleSave}
                        onCancel={handleBack}
                        footer={[
                            <Button key="back" onClick={handleBack} style={{ color: 'rgba(0, 0, 0, 0.65)', borderColor: 'rgb(18, 26, 77)' }}>
                                Vazgeç
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleSave} style={{ backgroundColor: 'rgb(18, 26, 77)' }}>
                                Kaydet
                            </Button>,
                        ]}
                    >
                        <PaymentPlanTable paymentPlan={paymentPlan} />
                    </Modal>
                )}
                <div className='content-area-cards'>
                    {debtData.length > 0 ? (
                        sortedDebt.map(debt => (
                            <DebtListCard
                                key={debt.id}
                                debtName={debt.debtName}
                                lenderName={debt.lenderName}
                                debtAmount={debt.debtAmount}
                                interestRate={debt.interestRate}
                                amount={debt.amount}
                                paymentStart={debt.paymentStart}
                                installment={debt.installment}
                                description={debt.description}
                            />
                        ))
                    ) : <p className="progress-description-title text-center">Herhangi bir borcunuz bulunmamaktadır.</p>
                    }
                </div>
            </div>
        </div>
    );
};
export default Debts;


