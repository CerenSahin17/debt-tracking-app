import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData } from '../redux/debt/debtSlice.tsx';
import axiosInstance from '../app/axiosSetup.tsx';
import Navbar from '../components/Navbar.tsx';
import AreaCards from '../components/Dashboard/areaCards/AreaCards.tsx';
import AreaCharts from '../components/Dashboard/areaCharts/AreaCharts.tsx';
import { Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';

interface Payment {
    id: string;
    lenderName: string;
    debtName: string;
    paymentDate: string;
    amount: number;
};

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const debtData = useSelector((state: any) => state.debt.data);
    const [totalDebt, setTotalDebt] = useState<number>(0);
    const [totalPaidAmount, setTotalPaidAmount] = useState<number>(0);
    const [totalRemainingDebt, setTotalRemainingDebt] = useState<number>(0);
    const [formattedTotalDebt, setFormattedTotalDebt] = useState<string>('0,00');
    const [formattedTotalPaidAmount, setFormattedTotalPaidAmount] = useState<string>('0,00');
    const [formattedTotalRemainingDebt, setFormattedTotalRemainingDebt] = useState<string>('0,00');
    const [overduePayments, setOverduePayments] = useState<Payment[]>([]);
    const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
    const [allOverduePayments, setAllOverduePayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const uniqueKeyForAreaCards = uuidv4();
    const uniqueKeyForAreaCharts = uuidv4();

    useEffect(() => {
        if (user) {
            //@ts-ignore
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
            const paymentPromises = debtData.map((debt: any) => axiosInstance.get(`/debt/${debt.id}`));
            const paymentResponses = await Promise.all(paymentPromises);
            const paymentDataList = paymentResponses.map((response: any) => response.data.data);

            processPaymentData(paymentDataList, currentDate);
        } catch (error) {
            console.error('Error fetching payment data:', error);
        } finally {
            setIsLoading(false);
        };
    };

    const processPaymentData = (paymentDataList: any[], currentDate: Date) => {
        const overdue: Payment[] = [];
        const paid: Payment[] = [];
        const allOverdue: Payment[] = [];
        let totalDebtAmount: number = 0;
        let totalPaidAmount: number = 0;

        paymentDataList.forEach((paymentData) => {
            if (paymentData.paymentPlan && paymentData.paymentPlan.length > 0) {
                paymentData.paymentPlan.forEach((plan: any) => {
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
                        }
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

    const updateStateWithPaymentData = (totalDebtAmount: number, totalPaidAmount: number, overdue: Payment[], paid: Payment[], allOverdue: Payment[]) => {
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
