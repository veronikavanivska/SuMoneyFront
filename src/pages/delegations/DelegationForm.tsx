import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import type { CreateDelegationRequest } from "../../services/types";

type Props = {
  onSubmit: (request: CreateDelegationRequest) => Promise<void>;
};

export function DelegationForm({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateDelegationRequest>({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <Input
        label={t("delegations.titleField")}
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        required
      />

      <Input
        label={t("delegations.destination")}
        value={form.destination}
        onChange={(event) => setForm({ ...form, destination: event.target.value })}
      />

      <Input
        label={t("delegations.startDate")}
        type="date"
        value={form.startDate}
        onChange={(event) => setForm({ ...form, startDate: event.target.value })}
      />

      <Input
        label={t("delegations.endDate")}
        type="date"
        value={form.endDate}
        onChange={(event) => setForm({ ...form, endDate: event.target.value })}
      />

      <Textarea
        label={t("delegations.description")}
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
      />

      <Button type="submit">{t("common.save")}</Button>
    </form>
  );
}
