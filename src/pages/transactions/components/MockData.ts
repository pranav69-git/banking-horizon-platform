
// Mock data for accounts
export const mockAccounts = [
  {
    id: "SA-12345678",
    type: "savings",
    balance: 5840.50,
  },
  {
    id: "CA-87654321",
    type: "current",
    balance: 2150.75,
  },
];

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};
