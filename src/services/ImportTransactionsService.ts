/* eslint-disable no-restricted-syntax */
import csvParser from 'csv-parse';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  file: Buffer;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    const createdTransactions = [] as Transaction[];
    const createTransactionService = new CreateTransactionService();

    const records = csvParser(file, { columns: true, delimiter: ', ' });

    for await (const record of records) {
      const transaction = await createTransactionService.execute(record);
      createdTransactions.push(transaction);

      // Fake asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return createdTransactions;
  }
}

export default ImportTransactionsService;
