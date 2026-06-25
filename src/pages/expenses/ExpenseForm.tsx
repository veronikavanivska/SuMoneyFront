import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { currencies, expenseCategories } from "../../constants/enums";
import type { CreateExpenseRequest } from "../../services/types";
import { ReceiptInput } from "../../components/ui/ReceiptInput";

type Props = {
  onSubmit: (request: CreateExpenseRequest) => Promise<void>;
};

export function ExpenseForm({ onSubmit }: Props) {
  const { t } = useTranslation();

  const [form, setForm] = useState<CreateExpenseRequest>({
    title: "",
    amount: "",
    currency: "PLN",
    category: "OTHER",
    expenseDate: new Date().toISOString().slice(0, 10),
    note: "",
    receiptImage: null
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <Input
        label={t("expenses.titleField")}
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        required
      />

      <Input
        label={t("expenses.amount")}
        type="number"
        step="0.01"
        value={form.amount}
        onChange={(event) => setForm({ ...form, amount: event.target.value })}
        required
      />

      <Select
        label={t("expenses.currency")}
        value={form.currency}
        onChange={(event) =>
          setForm({ ...form, currency: event.target.value as CreateExpenseRequest["currency"] })
        }
        options={currencies.map((currency) => ({ label: currency, value: currency }))}
      />

      <Select
        label={t("expenses.category")}
        value={form.category}
        onChange={(event) =>
          setForm({ ...form, category: event.target.value as CreateExpenseRequest["category"] })
        }
        options={expenseCategories.map((category) => ({
          label: t(`categories.${category}`),
          value: category
        }))}
      />

      <Input
        label={t("expenses.expenseDate")}
        type="date"
        value={form.expenseDate}
        onChange={(event) => setForm({ ...form, expenseDate: event.target.value })}
      />

        <ReceiptInput
            label={t("expenses.receipt")}
            value={form.receiptImage}
            onChange={(file) =>
                setForm({
                    ...form,
                    receiptImage: file
                })
            }
        />

      <Textarea
        label={t("expenses.note")}
        value={form.note}
        onChange={(event) => setForm({ ...form, note: event.target.value })}
      />

      <Button type="submit">{t("common.save")}</Button>
    </form>
  );
}
