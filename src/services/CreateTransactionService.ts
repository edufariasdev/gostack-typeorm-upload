import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

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
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const balance = await transactionRepository.getBalance();
    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (type == 'outcome' && balance.total < value) {
      throw new AppError('insufficient funds', 400);
    }

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
