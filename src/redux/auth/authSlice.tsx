import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

interface AuthResponse {
  data: string;
};

const initialState: AuthState = {
  user: localStorage.getItem('token'),
  status: 'idle',
  error: null
};

const LOGIN_URL = 'https://study.logiper.com/auth/login';
const REGISTER_URL = 'https://study.logiper.com/auth/register';

export const login = createAsyncThunk<AuthResponse, { email: string, password: string }, { rejectValue: string }>(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_URL, userData);
      console.log('Login Data', response.data);
      localStorage.setItem('token', response.data.data);
      return response.data;
    } catch (error: any) {
      console.error('Login Error', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    };
  }
);

export const register = createAsyncThunk<AuthResponse, { name: string, email: string, password: string }, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER_URL, userData);
      console.log('Register Data', response.data);
      localStorage.setItem('token', response.data.data);
      return response.data;
    } catch (error: any) {
      console.error('Register Error', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
