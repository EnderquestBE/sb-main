interface BankLogEntry {
  timestamp: Date;
  action: 'deposit' | 'withdraw' | 'income';
  amount: number;
  message: string;
}

export { BankLogEntry }