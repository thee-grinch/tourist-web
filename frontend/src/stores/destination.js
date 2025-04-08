import { defineStore } from 'pinia';
import axios from 'axios';

export const useDestinationStore = defineStore('destination', {
  state: () => ({
    destinations: [],
    featuredDestinations: [],
    currentDestination: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchDestinations(query = '') {
      this.loading = true;
      try {
        const response = await axios.get(`/api/destinations?${query}`);
        this.destinations = response.data.data.destinations;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchFeaturedDestinations() {
      this.loading = true;
      try {
        const response = await axios.get('/api/destinations?limit=4&sort=-rating');
        this.featuredDestinations = response.data.data.destinations;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchDestinationById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/destinations/${id}`);
        this.currentDestination = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    getDestinationsByRegion: (state) => (region) => {
      return state.destinations.filter(d => d.region === region);
    }
  }
});