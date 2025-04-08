import { defineStore } from 'pinia';
import axios from 'axios';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null
  }),
  actions: {
    async createBooking(bookingData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/bookings', bookingData);
        this.currentBooking = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getBooking(id) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        this.currentBooking = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getUserBookings() {
      this.loading = true;
      try {
        const response = await axios.get('/api/bookings');
        this.bookings = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async cancelBooking(id) {
      this.loading = true;
      try {
        const response = await axios.put(`/api/bookings/${id}/cancel`);
        const index = this.bookings.findIndex(b => b._id === id);
        if (index !== -1) {
          this.bookings[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async initiateMpesaPayment(paymentData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/payments/mpesa', paymentData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});