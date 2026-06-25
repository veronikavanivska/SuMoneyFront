import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Status } from "../../components/ui/Status";
import { currencies, expenseCategories } from "../../constants/enums";
import { useAsync } from "../../hooks/useAsync";
import { expenseApi } from "../../services/expense.api";
import type { CreateExpenseRequest, ExpenseFilterRequest } from "../../services/types";
import { formatDate, formatMoney } from "../../utils/format";
import { ExpenseForm } from "./ExpenseForm";

export function ExpensesPage() {
  const { t } = useTranslation();
  const { delegationId } = useParams();

  const [filters, setFilters] = useState<ExpenseFilterRequest>({});
  const [modalOpen, setModalOpen] = useState(false);

  const expenses = useAsync(
    () => expenseApi.find(delegationId!, filters, 0, 30),
    [delegationId, filters]
  );

  const create = async (request: CreateExpenseRequest) => {
    await expenseApi.create(delegationId!, request);
    setModalOpen(false);
    await expenses.reload();
  };

  const remove = async (expenseId: number) => {
    await expenseApi.delete(delegationId!, expenseId);
    await expenses.reload();
  };

  const openReceipt = async (expenseId: number) => {
    const blob = await expenseApi.receiptBlob(delegationId!, expenseId);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Delegation #{delegationId}</span>
          <h1>{t("expenses.title")}</h1>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          {t("expenses.newExpense")}
        </Button>
      </div>

      <Card>
        <div className="filters-grid">
          <Input
            label={t("expenses.contains")}
            value={filters.contains || ""}
            onChange={(event) => setFilters({ ...filters, contains: event.target.value })}
          />

          <Select
            label={t("expenses.currency")}
            value={filters.currency || ""}
            emptyLabel={t("common.all")}
            onChange={(event) => setFilters({ ...filters, currency: event.target.value as any })}
            options={currencies.map((currency) => ({ label: currency, value: currency }))}
          />

          <Select
            label={t("expenses.category")}
            value={filters.category || ""}
            emptyLabel={t("common.all")}
            onChange={(event) => setFilters({ ...filters, category: event.target.value as any })}
            options={expenseCategories.map((category) => ({
              label: t(`categories.${category}`),
              value: category
            }))}
          />
        </div>
      </Card>

      <Card>
        <Status
          loading={expenses.loading}
          error={expenses.error}
          empty={expenses.data?.content.length === 0}
          emptyText={t("common.noData")}
        />

        <div className="list">
          {expenses.data?.content.map((expense) => (
            <div className="list-row" key={expense.id}>
              <div>
                <strong>{expense.title}</strong>
                <span>
                  {t(`categories.${expense.category}`)} · {formatDate(expense.expenseDate)}
                </span>
              </div>

              <div className="row-actions">
                <b>{formatMoney(expense.amount, expense.currency)}</b>
                {expense.hasReceipt && (
                  <Button variant="ghost" onClick={() => openReceipt(expense.id)}>
                    <FileText size={16} />
                  </Button>
                )}
                <Button variant="ghost" onClick={() => remove(expense.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        title={t("expenses.newExpense")}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ExpenseForm onSubmit={create} />
      </Modal>
    </div>
  );
}
