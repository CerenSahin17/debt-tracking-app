import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosSetup';

export const fetchDebtData = createAsyncThunk('debt/fetchDebtData', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/debt');
        console.log('Debt Data', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Debt Data Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

export const addDebt = createAsyncThunk('debt', async (debtData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/debt', debtData);
        console.log('Added Debt', response.data);
        return response.data;
    } catch (error) {
        console.error('Add Debt Error', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    };
});

const debtSlice = createSlice({
    name: 'debt',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
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
                state.error = action.payload || action.error.message;
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
                state.error = action.payload || action.error.message;
            });
    }
});
export default debtSlice.reducer;
