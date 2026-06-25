import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Status } from "../../components/ui/Status";
import { routes } from "../../constants/routes";
import { useAsync } from "../../hooks/useAsync";
import { delegationApi } from "../../services/delegation.api";
import type { DelegationFilterRequest } from "../../services/types";
import { formatDate } from "../../utils/format";
import { DelegationForm } from "./DelegationForm";

export function DelegationsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<DelegationFilterRequest>({});
  const [modalOpen, setModalOpen] = useState(false);

  const delegations = useAsync(() => delegationApi.find(filters, 0, 20), [filters]);

  const create = async (request: Parameters<typeof delegationApi.create>[0]) => {
    await delegationApi.create(request);
    setModalOpen(false);
    await delegations.reload();
  };

  const remove = async (delegationId: number) => {
    await delegationApi.delete(delegationId);
    await delegations.reload();
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">{t("common.appName")}</span>
          <h1>{t("delegations.title")}</h1>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          {t("delegations.newDelegation")}
        </Button>
      </div>

      <Card>
        <div className="filters-grid">
          <Input
            label={t("delegations.contains")}
            value={filters.contains || ""}
            onChange={(event) => setFilters({ ...filters, contains: event.target.value })}
          />
          <Input
            label={t("delegations.dateFrom")}
            type="date"
            value={filters.dateFrom || ""}
            onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })}
          />
          <Input
            label={t("delegations.dateTo")}
            type="date"
            value={filters.dateTo || ""}
            onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })}
          />
        </div>
      </Card>

      <Card>
        <Status
          loading={delegations.loading}
          error={delegations.error}
          empty={delegations.data?.content.length === 0}
          emptyText={t("common.noData")}
        />

        <div className="delegation-grid">
          {delegations.data?.content.map((delegation) => (
            <article className="delegation-card" key={delegation.id}>
              <div>
                <span className="card-chip">{delegation.destination || "—"}</span>
                <h3>{delegation.title}</h3>
                <p>
                  {formatDate(delegation.startDate)} — {formatDate(delegation.endDate)}
                </p>
              </div>

              <div className="card-actions">
                <Link to={routes.delegationDetails(delegation.id)}>
                  <Button variant="secondary">
                    {t("delegations.details")}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => remove(delegation.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Modal
        title={t("delegations.newDelegation")}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DelegationForm onSubmit={create} />
      </Modal>
    </div>
  );
}
