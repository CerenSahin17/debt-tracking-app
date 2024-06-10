import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData, debtDetail, addDebt, updateDebt, deleteDebt } from '../redux/debt/debtSlice';
import { fetchPaymentPlanData } from '../../src/redux/paymentPlan/paymentSlice';
import Navbar from '../../src/components/Navbar';
import DebtListCard from '../../src/components/Debts/DebtListCard';
import AddDebtModal from '../../src/components/Debts/AddDebtModal';
import PaymentPlanModal from '../../src/components/Debts/PaymentPlanModal';
import PaymentPlanListModal from '../components/Debts/PaymentPlanListModal';
import '../style/AreaCards.scss';
import { Spin } from 'antd';

const Debts = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const debtData = useSelector((state) => state.debt.data);
    const paymentPlanListData = useSelector((state) => state.paymentPlan.data);
    const [isAddDebtModalVisible, setIsAddDebtModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPaymentPlanModalVisible, setIsPaymentPlanModalVisible] = useState(false);
    const [isPaymentPlanListModalVisible, setIsPaymentPlanListModalVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [selectedDebtId, setSelectedDebtId] = useState(0);
    const debtDetailData = useSelector((state) => state.debt.detail);
    const [newDebt, setNewDebt] = useState({
        debtName: '',
        lenderName: '',
        debtAmount: '',
        interestRate: '',
        amount: '',
        paymentStart: new Date().toISOString().substr(0, 10),
        paymentPlan: [
            {
                paymentDate: '',
                paymentAmount: ''
            },
        ],
        installment: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [paymentPlan, setPaymentPlan] = useState([]);

    useEffect(() => {
        if (user) {
            setLoadingPage(true);
            dispatch(fetchDebtData()).then(() => setLoadingPage(false));
        };
    }, [user, dispatch]);

    useEffect(() => {
        if (user) {
            setPaymentPlan(paymentPlanListData);
        };
    }, [paymentPlanListData]);

    useEffect(() => {
        if (isEditMode && debtDetailData) {
            setNewDebt({
                debtName: debtDetailData.data.debtName,
                lenderName: debtDetailData.data.lenderName,
                debtAmount: debtDetailData.data.debtAmount,
                interestRate: debtDetailData.data.interestRate,
                amount: debtDetailData.data.amount,
                paymentStart: new Date(debtDetailData.data.paymentStart).toISOString().substr(0, 10),
                paymentPlan: debtDetailData.data.paymentPlan,
                installment: debtDetailData.data.installment,
                description: debtDetailData.data.description
            });

            setIsAddDebtModalVisible(true);
        };
    }, [isEditMode, debtDetailData]);

    const sortedOverduePayments = [...debtData].sort((a, b) =>
        new Date(a.paymentStart) - new Date(b.paymentStart)
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedDebt = { ...newDebt, [name]: value };

        if (name === 'debtAmount' || name === 'interestRate') {
            const totalAmount = updatedDebt.debtAmount * (1 + updatedDebt.interestRate / 100);
            updatedDebt.amount = parseFloat(totalAmount.toFixed(2));
        };

        setNewDebt(updatedDebt);
        setError('');
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
                installment: installmentCount,
                paymentPlan: paymentPlan
            };

            setPaymentPlan(paymentPlan);
            setNewDebt(debtDataWithPaymentPlan);
            setIsPaymentPlanModalVisible(true);
        };
    };

    const handleCancel = () => {
        setIsAddDebtModalVisible(false);
        setIsEditMode(false);
        setNewDebt({
            debtName: '',
            lenderName: '',
            debtAmount: '',
            interestRate: '',
            amount: '',
            paymentStart: new Date().toISOString().substr(0, 10),
            paymentPlan: [
                {
                    paymentDate: '',
                    paymentAmount: ''
                },
            ],
            installment: '',
            description: ''
        });
        setError('');
    };

    const handleSave = () => {
        setIsLoading(true);
        let action;
        let requestData;

        if (isEditMode) {
            action = updateDebt;
            requestData = { debtId: selectedDebtId, updatedData: newDebt };
        } else {
            action = addDebt;
            requestData = newDebt;
        };

        dispatch(action(requestData))
            .then(() => {
                setLoadingPage(true);
                dispatch(fetchDebtData()).then(() => setLoadingPage(false));
                setIsPaymentPlanModalVisible(false);
                setIsAddDebtModalVisible(false);
                setNewDebt({
                    debtName: '',
                    lenderName: '',
                    debtAmount: '',
                    interestRate: '',
                    amount: '',
                    paymentStart: new Date().toISOString().substr(0, 10),
                    paymentPlan: [
                        {
                            paymentDate: '',
                            paymentAmount: ''
                        },
                    ],
                    installment: '',
                    description: ''
                });
                console.log('Borç güncelleme işlemi başarıyla gerçekleştirildi.');
            })
            .catch(error => {
                console.error("Borç güncelleme işlemi sırasında bir hata oluştu:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const deletedDebt = async () => {
        try {
            setIsLoadingDelete(true);
            await dispatch(deleteDebt(selectedDebtId));
            setLoadingPage(true);
            await dispatch(fetchDebtData()).then(() => setLoadingPage(false));
            setNewDebt({
                debtName: '',
                lenderName: '',
                debtAmount: '',
                interestRate: '',
                amount: '',
                paymentStart: new Date().toISOString().substr(0, 10),
                paymentPlan: [
                    {
                        paymentDate: '',
                        paymentAmount: ''
                    },
                ],
                installment: '',
                description: ''
            });
            console.log('İşlem başarıyla gerçekleştirildi.');
        } catch (error) {
            console.error('İşlem sırasında bir hata oluştu:', error);
        } finally {
            setIsLoadingDelete(false);
            setIsAddDebtModalVisible(false);
            setIsEditMode(false);
        };
    };

    const handleDelete = () => {
        deletedDebt();
    };

    const handleBack = () => {
        setIsPaymentPlanModalVisible(false);
    };

    const handleShowPaymentPlan = (debtId) => {
        setIsPaymentPlanListModalVisible(true);
        dispatch(fetchPaymentPlanData(debtId));
        setSelectedDebtId(debtId);
    };

    const handleRear = () => {
        setIsPaymentPlanListModalVisible(false);
        setPaymentPlan(null);
    };

    const handleShowDebtDetail = (debtId) => {
        setLoading(true);
        setIsEditMode(true);
        setIsAddDebtModalVisible(true);
        dispatch(debtDetail(debtId)).then(() => setLoading(false));
        setSelectedDebtId(debtId);
    };

    return (
        <>
            <Navbar />
            {loadingPage ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spin size="large" />
                </div>
            ) : (
                <div className='content-area'>
                    <div className="text-center md:text-left flex justify-center">
                        <button className="mt-6 bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" style={{ backgroundColor: 'rgb(18, 26, 77)' }} type="submit" onClick={() => setIsAddDebtModalVisible(true)}>Borç Ekle</button>
                    </div>
                    <AddDebtModal
                        visible={isAddDebtModalVisible}
                        onCancel={handleCancel}
                        onOk={handleOk}
                        onDelete={handleDelete}
                        handleInputChange={handleInputChange}
                        newDebt={newDebt}
                        error={error}
                        isEditMode={isEditMode}
                        debtDetailData={debtDetailData}
                        loadingDelete={isLoadingDelete}
                        loading={loading}
                    />
                    <PaymentPlanModal
                        visible={isPaymentPlanModalVisible}
                        onCancel={handleBack}
                        onOk={handleSave}
                        paymentPlan={paymentPlan}
                        loading={isLoading}
                    />
                    <PaymentPlanListModal
                        visible={isPaymentPlanListModalVisible}
                        onCancel={handleRear}
                        paymentPlan={paymentPlan}
                        debtId={selectedDebtId}
                    />
                    <div className='content-area-cards'>
                        {debtData.length > 0 ? (
                            sortedOverduePayments.map((debt, index) => (
                                <DebtListCard
                                    key={index}
                                    debtName={debt.debtName}
                                    lenderName={debt.lenderName}
                                    debtAmount={debt.debtAmount}
                                    interestRate={debt.interestRate}
                                    amount={debt.amount}
                                    paymentStart={debt.paymentStart}
                                    installment={debt.installment}
                                    description={debt.description}
                                    onClick={() => handleShowPaymentPlan(debt.id)}
                                    onEdit={() => handleShowDebtDetail(debt.id)}
                                />
                            ))
                        ) : <p className="progress-description-title text-center">Herhangi bir borcunuz bulunmamaktadır.</p>
                        }
                    </div>
                </div>
            )}
        </>
    );
};
export default Debts;
