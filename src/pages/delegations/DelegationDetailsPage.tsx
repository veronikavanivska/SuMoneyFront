import { useState } from "react";
import { FileText, Plus, Receipt, Trash2 } from "lucide-react";
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
import { delegationApi } from "../../services/delegation.api";
import { expenseApi } from "../../services/expense.api";
import type {
  CreateExpenseRequest,
  ExpenseFilterRequest
} from "../../services/types";
import { formatDate, formatMoney } from "../../utils/format";
import { ExpenseForm } from "../expenses/ExpenseForm";

export function DelegationDetailsPage() {
  const { t } = useTranslation();
  const { delegationId } = useParams();

  const [filters, setFilters] = useState<ExpenseFilterRequest>({});
  const [modalOpen, setModalOpen] = useState(false);

  const delegation = useAsync(
      () => delegationApi.getById(delegationId!),
      [delegationId]
  );

  const expenses = useAsync(
      () => expenseApi.find(delegationId!, filters, 0, 50),
      [delegationId, filters]
  );

  const createExpense = async (request: CreateExpenseRequest) => {
    await expenseApi.create(delegationId!, request);
    setModalOpen(false);
    await expenses.reload();
  };

  const removeExpense = async (expenseId: number) => {
    await expenseApi.delete(delegationId!, expenseId);
    await expenses.reload();
  };

  const openReceipt = async (expenseId: number) => {
    const blob = await expenseApi.receiptBlob(delegationId!, expenseId);
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
      <div className="delegation-details-page">
        <section className="delegation-details-hero">
          <div>
            <span className="eyebrow">{t("delegations.details")}</span>
            <h1>{delegation.data?.title || "—"}</h1>

            {delegation.data?.destination && (
                <p>{delegation.data.destination}</p>
            )}
          </div>

          {/*<Button onClick={() => setModalOpen(true)}>*/}
          {/*  <Plus size={18} />*/}
          {/*  {t("expenses.newExpense")}*/}
          {/*</Button>*/}
        </section>

        <Card>
          <Status loading={delegation.loading} error={delegation.error} />

          {delegation.data && (
              <div className="details-grid delegation-info-grid">
                <div>
                  <span>{t("delegations.destination")}</span>
                  <strong>{delegation.data.destination || "—"}</strong>
                </div>

                <div>
                  <span>{t("delegations.startDate")}</span>
                  <strong>{formatDate(delegation.data.startDate)}</strong>
                </div>

                <div>
                  <span>{t("delegations.endDate")}</span>
                  <strong>{formatDate(delegation.data.endDate)}</strong>
                </div>

                <div className="details-wide">
                  <span>{t("delegations.description")}</span>
                  <strong>{delegation.data.description || "—"}</strong>
                </div>
              </div>
          )}
        </Card>

        <section className="expenses-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">{t("expenses.title")}</span>
              <h2>{t("expenses.title")}</h2>
            </div>

            <Button onClick={() => setModalOpen(true)}>
              <Receipt size={18} />
              {t("expenses.newExpense")}
            </Button>
          </div>

          <Card>
            <div className="filters-grid">
              <Input
                  label={t("expenses.contains")}
                  value={filters.contains || ""}
                  onChange={(event) =>
                      setFilters({
                        ...filters,
                        contains: event.target.value
                      })
                  }
              />

              <Select
                  label={t("expenses.currency")}
                  value={filters.currency || ""}
                  emptyLabel={t("common.all")}
                  onChange={(event) =>
                      setFilters({
                        ...filters,
                        currency: event.target.value as ExpenseFilterRequest["currency"]
                      })
                  }
                  options={currencies.map((currency) => ({
                    label: currency,
                    value: currency
                  }))}
              />

              <Select
                  label={t("expenses.category")}
                  value={filters.category || ""}
                  emptyLabel={t("common.all")}
                  onChange={(event) =>
                      setFilters({
                        ...filters,
                        category: event.target.value as ExpenseFilterRequest["category"]
                      })
                  }
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

            <div className="expense-card-grid">
              {expenses.data?.content.map((expense) => (
                  <article className="expense-card" key={expense.id}>
                    <div className="expense-card-top">
                      <div className="expense-icon">
                        <Receipt size={20} />
                      </div>

                      <div className="expense-amount">
                        {formatMoney(expense.amount, expense.currency)}
                      </div>
                    </div>

                    <div className="expense-card-body">
                      <h3>{expense.title}</h3>

                      <p>
                        {t(`categories.${expense.category}`)} ·{" "}
                        {formatDate(expense.expenseDate)}
                      </p>

                      {expense.note && (
                          <span className="expense-note">
                      {expense.note}
                    </span>
                      )}
                    </div>

                    <div className="expense-card-actions">
                      {expense.hasReceipt && (
                          <Button
                              variant="secondary"
                              onClick={() => openReceipt(expense.id)}
                          >
                            <FileText size={16} />
                            {t("expenses.viewReceipt")}
                          </Button>
                      )}

                      <Button
                          variant="ghost"
                          onClick={() => removeExpense(expense.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </article>
              ))}
            </div>
          </Card>
        </section>

        <Modal
            title={t("expenses.newExpense")}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        >
          <ExpenseForm onSubmit={createExpense} />
        </Modal>
      </div>
  );
}