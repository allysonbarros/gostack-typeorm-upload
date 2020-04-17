import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    let categoryObj = await categoryRepository.findOne({ title: category });

    if (!categoryObj) {
      const newCategory = categoryRepository.create({ title: category });
      categoryObj = await categoryRepository.save(newCategory);
    }

    const currentBalance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > currentBalance.total) {
      throw new AppError(
        'The transaction amount exceeds the current balance.',
        400,
      );
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryObj.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
