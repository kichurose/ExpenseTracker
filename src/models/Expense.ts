export class Expense {
  public Name: string;
  public Amount: number;
  public Status: boolean;

  constructor(name: string, amount: number, status: boolean) {
    this.Name = name;
    this.Amount = amount;
    this.Status = status;
  }
}
