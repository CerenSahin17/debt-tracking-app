import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebtData } from '../redux/debt/debtSlice';
import axiosInstance from '../app/axiosSetup';
import Navbar from '../components/Navbar';
import AreaCards from '../components/Dashboard/areaCards/AreaCards';
import AreaCharts from '../components/Dashboard/areaCharts/AreaCharts';

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
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchDebtData());
        };
    }, [user, dispatch]);

    useEffect(() => {
        if (debtData.length > 0) {
            const fetchPaymentData = async () => {
                const currentDate = new Date();

                try {
                    const paymentPromises = debtData.map(async (debt) => {
                        const response = await axiosInstance.get(`/debt/${debt.id}`);
                        console.log('DebtId Data', response.data);
                        return response.data.data;
                    });

                    const paymentDataList = await Promise.all(paymentPromises);

                    const overdue = [];
                    const paid = []
                    let totalDebtAmount = 0;
                    let totalPaidAmount = 0;

                    paymentDataList.forEach((paymentData) => {
                        totalDebtAmount += paymentData.amount;
                        if (paymentData.paymentPlan && paymentData.paymentPlan.length > 0) {
                            paymentData.paymentPlan.forEach((plan) => {
                                if (!plan.isPaid) {
                                    const paymentDate = new Date(plan.paymentDate);
                                    const timeDiff = paymentDate.getTime() - currentDate.getTime();
                                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                    if (daysDiff < 0 || daysDiff <= 7) {
                                        overdue.push({
                                            id: paymentData.id,
                                            lenderName: paymentData.lenderName,
                                            debtName: paymentData.debtName,
                                            paymentDate: plan.paymentDate,
                                            amount: paymentData.amount
                                        });
                                        console.log('Overdue Data', overdue);
                                    };
                                };

                                if (plan.isPaid) {
                                    totalPaidAmount += plan.paymentAmount;
                                    paid.push({
                                        id: paymentData.id,
                                        lenderName: paymentData.lenderName,
                                        debtName: paymentData.debtName,
                                        paymentDate: plan.paymentDate,
                                        amount: paymentData.amount
                                    });
                                    console.log('Paid Data', paid);
                                };
                            });
                        };
                        console.log('Amount Data', totalDebtAmount);
                        console.log('Paid Amonut Data', totalPaidAmount);
                    });

                    setTotalDebt(totalDebtAmount);
                    setTotalPaidAmount(totalPaidAmount);
                    setTotalRemainingDebt(totalDebtAmount - totalPaidAmount);

                    setFormattedTotalDebt(totalDebtAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                    setFormattedTotalPaidAmount(totalPaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                    setFormattedTotalRemainingDebt((totalDebtAmount - totalPaidAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

                    setOverduePayments(overdue);
                    setPaidPayments(paid);
                } catch (error) {
                    setError('Ödeme verilerini çekerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                    console.error('Error fetching payment data:', error);
                };
            };

            fetchPaymentData();
        };
    }, [debtData]);

    return (
        <div>
            <div className='min-h-screen bg-gray-100'>
                <Navbar />
                <AreaCards
                    formattedTotalDebt={formattedTotalDebt}
                    formattedTotalPaidAmount={formattedTotalPaidAmount}
                    formattedTotalRemainingDebt={formattedTotalRemainingDebt}
                    totalDebt={totalDebt}
                    totalPaidAmount={totalPaidAmount}
                    totalRemainingDebt={totalRemainingDebt}
                    error={error}
                />
                <AreaCharts overduePayments={overduePayments} paidPayments={paidPayments} totalDebtAmount={totalDebt} />
                <div className="h-6"></div>
            </div>
        </div>
    );
};
export default Dashboard;
