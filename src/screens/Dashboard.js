import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData } from '../redux/debt/debtSlice';
import axiosInstance from '../app/axiosSetup';
import Navbar from '../components/Navbar';
import AreaCards from '../components/Dashboard/areaCards/AreaCards';
import AreaCharts from '../components/Dashboard/areaCharts/AreaCharts';
import { Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const debtData = useSelector((state) => state.debt.data);
    const [totalDebt, setTotalDebt] = useState(0);
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [totalRemainingDebt, setTotalRemainingDebt] = useState(0);
    const [formattedTotalDebt, setFormattedTotalDebt] = useState('0,00');
    const [formattedTotalPaidAmount, setFormattedTotalPaidAmount] = useState('0,00');
    const [formattedTotalRemainingDebt, setFormattedTotalRemainingDebt] = useState('0,00');
    const [overduePayments, setOverduePayments] = useState([]);
    const [paidPayments, setPaidPayments] = useState([]);
    const [allOverduePayments, setAllOverduePayments] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const uniqueKeyForAreaCards = uuidv4();
    const uniqueKeyForAreaCharts = uuidv4();

    useEffect(() => {
        if (user) {
            dispatch(fetchDebtData());
        };
    }, [user, dispatch]);

    useEffect(() => {
        if (debtData.length > 0) {
            setIsLoading(true);
            fetchPaymentData();
        } else {
            setIsLoading(false);
        };
    }, [debtData]);

    const fetchPaymentData = async () => {
        const currentDate = new Date();

        try {
            const paymentPromises = debtData.map(debt => axiosInstance.get(`/debt/${debt.id}`));
            const paymentResponses = await Promise.all(paymentPromises);
            const paymentDataList = paymentResponses.map(response => response.data.data);

            processPaymentData(paymentDataList, currentDate);
        } catch (error) {
            setError('Ödeme verilerini çekerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            console.error('Error fetching payment data:', error);
        } finally {
            setIsLoading(false);
        };
    };

    const processPaymentData = (paymentDataList, currentDate) => {
        const overdue = [];
        const paid = [];
        const allOverdue = [];
        let totalDebtAmount = 0;
        let totalPaidAmount = 0;

        paymentDataList.forEach((paymentData) => {
            if (paymentData.paymentPlan && paymentData.paymentPlan.length > 0) {
                paymentData.paymentPlan.forEach((plan) => {
                    totalDebtAmount += plan.paymentAmount;
                    const paymentDate = new Date(plan.paymentDate);
                    const timeDiff = paymentDate.getTime() - currentDate.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    if (!plan.isPaid) {
                        allOverdue.push({
                            id: paymentData.id,
                            lenderName: paymentData.lenderName,
                            debtName: paymentData.debtName,
                            paymentDate: plan.paymentDate,
                            amount: plan.paymentAmount
                        });

                        if (daysDiff < 0 || daysDiff <= 7) {
                            overdue.push({
                                id: paymentData.id,
                                lenderName: paymentData.lenderName,
                                debtName: paymentData.debtName,
                                paymentDate: plan.paymentDate,
                                amount: plan.paymentAmount
                            });
                        };
                    } else {
                        totalPaidAmount += plan.paymentAmount;
                        paid.push({
                            id: paymentData.id,
                            lenderName: paymentData.lenderName,
                            debtName: paymentData.debtName,
                            paymentDate: plan.paymentDate,
                            amount: plan.paymentAmount
                        });
                    };
                });
            };
        });

        updateStateWithPaymentData(totalDebtAmount, totalPaidAmount, overdue, paid, allOverdue);
    };

    const updateStateWithPaymentData = (totalDebtAmount, totalPaidAmount, overdue, paid, allOverdue) => {
        setTotalDebt(totalDebtAmount);
        setTotalPaidAmount(totalPaidAmount);
        setTotalRemainingDebt(totalDebtAmount - totalPaidAmount);

        setFormattedTotalDebt(totalDebtAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        setFormattedTotalPaidAmount(totalPaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        setFormattedTotalRemainingDebt((totalDebtAmount - totalPaidAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        setOverduePayments(overdue);
        setPaidPayments(paid);
        setAllOverduePayments(allOverdue);
    };

    return (
        <div>
            <div className='min-h-screen bg-gray-100'>
                <Navbar />
                {isLoading ? (
                    <div className='flex justify-center items-center h-screen'>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <AreaCards
                            key={uniqueKeyForAreaCards}
                            formattedTotalDebt={formattedTotalDebt}
                            formattedTotalPaidAmount={formattedTotalPaidAmount}
                            formattedTotalRemainingDebt={formattedTotalRemainingDebt}
                            totalDebt={totalDebt}
                            totalPaidAmount={totalPaidAmount}
                            totalRemainingDebt={totalRemainingDebt}
                            error={error}
                        />
                        <AreaCharts
                            key={uniqueKeyForAreaCharts}
                            overduePayments={overduePayments}
                            overdueAllPayments={allOverduePayments}
                            paidPayments={paidPayments}
                            totalDebtAmount={totalDebt}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
export default Dashboard;
