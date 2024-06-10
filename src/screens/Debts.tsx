import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData, debtDetail, addDebt, updateDebt, deleteDebt } from '../redux/debt/debtSlice.tsx';
import { fetchPaymentPlanData } from '../redux/paymentPlan/paymentSlice.tsx';
import Navbar from '../components/Navbar.tsx';
import DebtListCard from '../components/Debts/DebtListCard.tsx';
import AddDebtModal from '../components/Debts/AddDebtModal.tsx';
import PaymentPlanModal from '../components/Debts/PaymentPlanModal.tsx';
import PaymentPlanListModal from '../components/Debts/PaymentPlanListModal.tsx';
import '../style/AreaCards.scss';
import { Spin } from 'antd';

const Debts: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const debtData = useSelector((state: any) => state.debt.data);
    const debtDetailData = useSelector((state: any) => state.debt.detail);
    const paymentPlanListData = useSelector((state: any) => state.paymentPlan.data.data);
    const [isAddDebtModalVisible, setIsAddDebtModalVisible] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isPaymentPlanModalVisible, setIsPaymentPlanModalVisible] = useState<boolean>(false);
    const [isPaymentPlanListModalVisible, setIsPaymentPlanListModalVisible] = useState<boolean>(false);
    const [loadingPage, setLoadingPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
    const [selectedDebtId, setSelectedDebtId] = useState<number>(0);
    const [newDebt, setNewDebt] = useState<{
        debtName: string;
        lenderName: string;
        debtAmount: string;
        interestRate: string;
        amount: number;
        paymentStart: string;
        paymentPlan: any;
        installment: string;
        description: string;
    }>({
        debtName: '',
        lenderName: '',
        debtAmount: '',
        interestRate: '',
        amount: 0,
        paymentStart: new Date().toISOString().substr(0, 10),
        paymentPlan: undefined,
        installment: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [paymentPlan, setPaymentPlan] = useState<any>();

    useEffect(() => {
        if (user) {
            setLoadingPage(true);
            //@ts-ignore
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

    const sortedOverduePayments = [...debtData].sort((a: any, b: any) =>
        //@ts-ignore
        new Date(a.paymentStart) - new Date(b.paymentStart)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedDebt = { ...newDebt, [name]: value };

        if (name === 'debtAmount' || name === 'interestRate') {
            const totalAmount = parseFloat(updatedDebt.debtAmount) * (1 + parseFloat(updatedDebt.interestRate) / 100);
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
            //@ts-ignore
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
            amount: 0,
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
                //@ts-ignore
                dispatch(fetchDebtData()).then(() => setLoadingPage(false));
                setIsPaymentPlanModalVisible(false);
                setIsAddDebtModalVisible(false);
                setNewDebt({
                    debtName: '',
                    lenderName: '',
                    debtAmount: '',
                    interestRate: '',
                    amount: 0,
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
                setIsEditMode(false);
            });
    };

    const deletedDebt = async () => {
        try {
            setIsLoadingDelete(true);
            //@ts-ignore
            await dispatch(deleteDebt(selectedDebtId));
            setLoadingPage(true);
            //@ts-ignore
            await dispatch(fetchDebtData()).then(() => setLoadingPage(false));
            setNewDebt({
                debtName: '',
                lenderName: '',
                debtAmount: '',
                interestRate: '',
                amount: 0,
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

    const handleShowPaymentPlan = (debtId: number) => {
        setIsPaymentPlanListModalVisible(true);
        //@ts-ignore
        dispatch(fetchPaymentPlanData(debtId));
        setSelectedDebtId(debtId);
    };

    const handleRear = () => {
        setIsPaymentPlanListModalVisible(false);
        setPaymentPlan([]);
    };

    const handleShowDebtDetail = (debtId: number) => {
        setLoading(true);
        setIsEditMode(true);
        setIsAddDebtModalVisible(true);
        //@ts-ignore
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
                        //@ts-ignore
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
                            sortedOverduePayments.map((debt: any, index: number) => (
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
