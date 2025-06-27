import { Customer, CustomerReport } from '../types/api';

const API_BASE_URL = 'http://localhost:8088/api';

export const apiService = {
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/report/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomerReport(email: string, date: string): Promise<CustomerReport> {
    try {
      const response = await fetch(`${API_BASE_URL}/report?email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customer report:', error);
      throw error;
    }
  },

  async getAllCustomerReports(date: string, customers: Customer[]): Promise<CustomerReport[]> {
    try {
      const reports = await Promise.allSettled(
        customers
          .filter(customer => customer.email && customer.email.trim() !== '')
          .map(customer => this.getCustomerReport(customer.email, date))
      );

      return reports
        .filter((result): result is PromiseFulfilledResult<CustomerReport> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching all customer reports:', error);
      throw error;
    }
  }
};