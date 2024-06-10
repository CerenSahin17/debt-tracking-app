import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosSetup.tsx';

interface PaymentPlan {
    id: string;
    paymentDate: string;
    paymentAmount: string;
    isPaid: boolean;
};

interface PaymentState {
    data: PaymentPlan[];
    loading: boolean;
    error: string | null;
};

interface FetchPaymentPlanDataError {
    errorMessage: string;
};

export const fetchPaymentPlanData = createAsyncThunk<
    PaymentPlan[],
    string,
    { rejectValue: FetchPaymentPlanDataError }>('paymentPlan/fetchPaymentPlanData', async (debtId, { rejectWithValue }) => {
        console.log('Payment Debt Id', debtId);
        try {
            const response = await axiosInstance.get(`/payment-plans/${debtId}`);
            console.log('Pyament Plan Data', response.data);
            return response.data;
        } catch (error) {
            console.error('Payment Plan Data Error', error.response ? error.response.data : error.message);
            return rejectWithValue({ errorMessage: error.response ? error.response.data : error.message });
        };
    });

interface UpdatePaymentPlanDataArgs {
    paymentPlanId: string;
    updatedData: Partial<PaymentPlan>;
};

interface UpdatePaymentPlanDataError {
    errorMessage: string;
};

export const updatePaymentPlanData = createAsyncThunk<
    PaymentPlan,
    UpdatePaymentPlanDataArgs,
    { rejectValue: UpdatePaymentPlanDataError }>('paymentPlan/updatePaymentPlanData', async ({ paymentPlanId, updatedData }, { rejectWithValue }) => {
        console.log('Update Payment Plan Id', paymentPlanId);
        console.log('Update Payment Plan Body', updatedData);
        try {
            const response = await axiosInstance.put(`/payment-plans/${paymentPlanId}`, updatedData);
            console.log('Updated Payment Plan Data', response.data);
            return response.data;
        } catch (error) {
            console.error('Update Payment Plan Data Error', error.response ? error.response.data : error.message);
            return rejectWithValue({ errorMessage: error.response ? error.response.data : error.message });
        };
    });

const paymentSlice = createSlice({
    name: 'paymentPlan',
    initialState: {
        data: [] as PaymentPlan[],
        loading: false,
        error: null
    } as PaymentState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentPlanData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentPlanData.fulfilled, (state, action: PayloadAction<PaymentPlan[]>) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(fetchPaymentPlanData.rejected, (state, action: PayloadAction<FetchPaymentPlanDataError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.errorMessage ?? 'Unknown error';
            })
            .addCase(updatePaymentPlanData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentPlanData.fulfilled, (state, action: PayloadAction<PaymentPlan>) => {
                state.loading = false;
                state.error = null;
                state.data = state.data.map(item => item.id === action.payload.id ? action.payload : item);
            })
            .addCase(updatePaymentPlanData.rejected, (state, action: PayloadAction<UpdatePaymentPlanDataError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.errorMessage ?? 'Unknown error';
            });
    }
});

export default paymentSlice.reducer;
