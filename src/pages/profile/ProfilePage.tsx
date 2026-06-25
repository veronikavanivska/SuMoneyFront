import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { authApi } from "../../services/auth.api";

export function ProfilePage() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await authApi.changePassword({ oldPassword, newPassword });
    setMessage(response);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Account</span>
          <h1>{t("nav.profile")}</h1>
        </div>
      </div>

      <Card title={t("auth.changePassword")}>
        <form className="form-grid" onSubmit={submit}>
          <Input
            label={t("auth.oldPassword")}
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            required
          />

          <Input
            label={t("auth.newPassword")}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />

          {message && <div className="status">{message}</div>}

          <Button type="submit">{t("common.save")}</Button>
        </form>
      </Card>
    </div>
  );
}
