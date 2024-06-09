import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosSetup';

export const fetchPaymentPlanData = createAsyncThunk('paymentPlan/fetchPaymentPlanData', async (debtId, { rejectWithValue }) => {
    console.log('Payment Debt Id', debtId);
    try {
        const response = await axiosInstance.get(`/payment-plans/${debtId}`);
        console.log('DebtId Data', response.data);
        return response.data;
    } catch (error) {
        console.error('DebtId Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const updatePaymentPlanData = createAsyncThunk('paymentPlan/updatePaymentPlanData', async ({ paymentPlanId, updatedData }, { rejectWithValue }) => {
    console.log('Update Payment Plan Id', paymentPlanId);
    console.log('Update Paymen Plan Body', updatedData);
    try {
        const response = await axiosInstance.put(`/payment-plans/${paymentPlanId}`, updatedData);
        console.log('Updated Payment Plan Data', response.data);
        return response.data;
    } catch (error) {
        console.error('Update Payment Plan Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

const paymentSlice = createSlice({
    name: 'paymentPlan',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentPlanData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentPlanData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(fetchPaymentPlanData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.errorMessage;
            })
            .addCase(updatePaymentPlanData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentPlanData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(updatePaymentPlanData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.errorMessage;
            });
    }
});
export default paymentSlice.reducer;
