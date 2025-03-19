import { usersData } from './users.data';

export const factoriesData = [
  {
    factoryOwnerId: 'factory-id',
    information: {
      name: 'Sample Factory 1',
      address: '123 Factory Street',
      phone: '0123456789',
      email: 'factory1@example.com',
    },
    contract: {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      terms: 'Standard contract terms',
    },
  },
]; 