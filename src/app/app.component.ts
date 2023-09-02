import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { numberValidator } from 'src/Validators/number-validators';

interface KeyValue {
  key: string;
  value1: number;
  value2: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ExpenseTracker';
  fileContent: string | undefined;
  public form: FormGroup;
  selectedFile: File | undefined;
  public untrackedExpenseArray: KeyValue[] = [];
  public trackedExpenses: KeyValue[] = [];
  public untrackedExpenses: Map<string, number> = new Map<string, number>();
  public total: number = 0;
  public totalIncome: number = 0;

  public get name() {
    return this.form.get('name');
  }

  public get amount() {
    return this.form.get('amount');
  }

  public get availableBalance() {
    if (this.totalIncome) {
      return this.totalIncome - this.total;
    }
    return 0;
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [''],
      amount: ['', numberValidator()],
    });
  }

  public untrackedDeleteArrayItem(keyvalue: KeyValue) {
    const index = this.untrackedExpenseArray.findIndex(
      (x) => x.key == keyvalue.key
    );
    if (index !== -1) {
      this.untrackedExpenseArray.splice(index, 1);
      this.total = this.total - keyvalue.value1;
    }
  }

  //tracked
  public deleteArrayItem(keyvalue: KeyValue) {
    const index = this.trackedExpenses.findIndex((x) => x.key == keyvalue.key);
    if (index !== -1) {
      this.trackedExpenses.splice(index, 1);
      this.total = this.total - keyvalue.value1;
    }
  }

  public hasErrors(control: AbstractControl | null): boolean {
    if (control?.errors) {
      return true;
    }
    return false;
  }

  public onFileSelected(file: File): void {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (): void => {
        let lines: string[] = [];
        const file: string = fileReader.result as string;
        lines = file.split(/\r|\n|\r/);
        lines.forEach((line) => {
          if (line !== '') {
            let appData: string[] = [];
            appData = line.split(',');
            appData = appData.filter((el) => el !== '');
            const expense = appData[0].trim();
            const amount = appData.slice(1, appData.length).toString().trim();

            if (expense && amount) {
              const amt = parseInt(amount);
              this.untrackedExpenses.set(expense, amt);
              this.untrackedExpenseArray.push({
                key: expense,
                value1: amt,
                value2: false,
              });
              this.total += amt;
            } else if (amount == '') {
              this.untrackedExpenses.set(expense, 0);
              this.untrackedExpenseArray.push({
                key: expense,
                value1: 0,
                value2: false,
              });
            }
          }
        });
      };
    }
  }

  public addExpense(
    name: AbstractControl | null,
    amount: AbstractControl | null
  ) {
    const invalid = this._validateInputs();
    if (!invalid && name?.value) {
      const parsedAmount = parseInt(amount?.value);

      if (this.untrackedExpenses.has(name.value)) {
        const oldAmount = this.untrackedExpenses.get(name.value) as number;
        this.total += parseInt(amount?.value) - oldAmount;
      } else {
        this.total += parsedAmount;
      }
      this.untrackedExpenses.set(name.value, parsedAmount);
      this.untrackedExpenseArray.push({
        key: name.value,
        value1: parsedAmount,
        value2: false,
      });
      console.log(this.total);
      console.log(this.untrackedExpenseArray);
      console.log(this.untrackedExpenses);
      this.name?.reset();
      this.amount?.reset();
    }
  }

  public untrackCheckBoxClicked(expense: KeyValue, event: any) {
    debugger;
    const value = (event.target as HTMLInputElement).checked;

    const index = this.untrackedExpenseArray.findIndex(
      (x) => x.key == expense.key
    );
    if (index !== -1) {
      this.untrackedExpenseArray[index].value2 = value;
    }

    if (value) {
      this.trackedExpenses.push({
        key: expense.key,
        value1: expense.value1,
        value2: value,
      });
      this.untrackedExpenseArray.splice(index, 1);
    }
    console.log(this.trackedExpenses);
  }

  // tracked
  public checkBoxClicked(expense: KeyValue, event: any) {
    debugger;
    const value = (event.target as HTMLInputElement).checked;

    const index = this.trackedExpenses.findIndex((x) => x.key == expense.key);
    if (index !== -1) {
      this.trackedExpenses[index].value2 = value;
    }

    if (!value) {
      this.untrackedExpenseArray.push({
        key: expense.key,
        value1: expense.value1,
        value2: value,
      });
      this.trackedExpenses.splice(index, 1);
    }
    console.log(this.trackedExpenses);
    // console.log(this.untrackedExpenseArray);
  }

  private _validateInputs(): boolean {
    if (this.name?.invalid || this.amount?.invalid) {
      return true;
    }
    return false;
  }

  public amountChanged(key: string, event: any) {
    const newAmount = (event.target as HTMLInputElement).value;
    const oldAmount = this.untrackedExpenses.get(key) as number;
    this.untrackedExpenses.set(key, parseInt(newAmount));
    this.untrackedExpenseArray.push({
      key: key,
      value1: parseInt(newAmount),
      value2: false,
    });
    console.log(this.untrackedExpenseArray);
    this.total += parseInt(newAmount) - oldAmount;
    console.log(this.untrackedExpenses);
    console.log(this.total);
  }

  public expenseChanged(keyValue: KeyValue, event: any) {
    const newKey = (event.target as HTMLInputElement).value;
    const newItem: KeyValue = {
      key: newKey,
      value1: keyValue.value1,
      value2: keyValue.value2,
    };
    const index = this.untrackedExpenseArray.findIndex(
      (x) => x.key == keyValue.key
    );
    if (index !== -1) {
      this.untrackedExpenseArray.splice(index, 1, newItem);
    }
  }

  public totalIncomeChanged(event: any) {
    const tot = (event.target as HTMLInputElement).value as string;
    this.totalIncome = parseInt(tot);
  }
}
