import { TableRepository } from "../repositories/table.repository.js";

/**
 * TableService: Business logic for table management.
 */
export class TableService {
  private tableRepository: TableRepository;

  constructor() {
    this.tableRepository = new TableRepository();
  }

  async getAllTables() {
    return this.tableRepository.findAll();
  }

  async setTableStatus(id: number, status: string) {
    const table = await this.tableRepository.findById(id);
    if (!table) return null;
    
    return this.tableRepository.updateStatus(id, status);
  }
}
