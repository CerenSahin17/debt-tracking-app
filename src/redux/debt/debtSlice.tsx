import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosSetup.tsx';

interface DebtState {
    data: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    detail: any | null;
};

interface DebtDetail {
    debtId: string;
    updatedData: any;
};

export const fetchDebtData = createAsyncThunk<any, void, { rejectValue: string | null }>('debt/fetchDebtData', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/debt');
        console.log('Debt Data', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Debt Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const debtDetail = createAsyncThunk<any, string, { rejectValue: string | null }>('debt/debtDetail', async (debtId, { rejectWithValue }) => {
    console.log('Debt Detail Id', debtId);
    try {
        const response = await axiosInstance.get(`/debt/${debtId}`);
        console.log('Detail Debt', response.data);
        return response.data;
    } catch (error) {
        console.error('Detail Debt Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const addDebt = createAsyncThunk<any, any, { rejectValue: string | null }>('debt/addDebt', async (debtData, { rejectWithValue }) => {
    console.log('Creat Debt Body', debtData);
    try {
        const response = await axiosInstance.post('/debt', debtData);
        console.log('Added Debt', response.data);
        return response.data;
    } catch (error) {
        console.error('Add Debt Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const deleteDebt = createAsyncThunk<any, string, { rejectValue: string | null }>('paymentPlan/deleteDebt', async (debtId, { rejectWithValue }) => {
    console.log('Delete Debt Id', debtId);
    try {
        const response = await axiosInstance.delete(`/debt/${debtId}`);
        console.log('Deleted Payment Plan Data', response.data);
        return response.data;
    } catch (error) {
        console.error('Update Payment Plan Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const updateDebt = createAsyncThunk<any, DebtDetail, { rejectValue: string | null }>('paymentPlan/updateDebt', async ({ debtId, updatedData }, { rejectWithValue }) => {
    console.log('Update Debt Id', debtId);
    console.log('Update Debt Body', updatedData);
    try {
        const response = await axiosInstance.put(`/debt/${debtId}`, updatedData);
        console.log('Updated Payment Plan Data', response.data);
        return response.data;
    } catch (error) {
        console.error('Update Payment Plan Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

const debtSlice = createSlice({
    name: 'debt',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        detail: null
    } as DebtState,
    reducers: {
        clearDebtDetail(state) {
            state.detail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDebtData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDebtData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchDebtData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload || action.error.message) as string | null;
            })
            .addCase(debtDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(debtDetail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.detail = action.payload;
            })
            .addCase(debtDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload || action.error.message) as string | null;

            })
            .addCase(addDebt.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addDebt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(addDebt.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload || action.error.message) as string | null;
            })
            .addCase(deleteDebt.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteDebt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(deleteDebt.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload || action.error.message) as string | null;
            })
            .addCase(updateDebt.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateDebt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(updateDebt.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload || action.error.message) as string | null;
            });
    }
});
export const { clearDebtDetail } = debtSlice.actions;

export default debtSlice.reducer;
