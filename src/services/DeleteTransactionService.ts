import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transation = await transactionsRepository.findOne();

    if (!transation) {
      throw new AppError('Transaction does not exists');
    }

    transactionsRepository.remove(transation);
  }
}

export default DeleteTransactionService;
