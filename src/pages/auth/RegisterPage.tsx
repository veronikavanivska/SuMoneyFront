import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { routes } from "../../constants/routes";
import { authApi } from "../../services/auth.api";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await authApi.register({ email, password });
      navigate(routes.login);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-visual">
          <div className="brand-mark large">S</div>
          <h1>{t("common.appName")}</h1>
          <p>{t("auth.welcome")}</p>

          {/*<div className="credit-card-preview">*/}
          {/*  <span>Expense Wallet</span>*/}
          {/*  <strong>PLN · EUR · USD</strong>*/}
          {/*  <small>delegations / receipts / stats</small>*/}
          {/*</div>*/}
        </div>

        <form className="auth-form" onSubmit={submit}>
          <UserPlus size={36} />
          <h2>{t("auth.registerTitle")}</h2>

          <Input
            label={t("auth.email")}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <Input
            label={t("auth.password")}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <div className="status status-error">{error}</div>}

          <Button type="submit" disabled={submitting}>
            {t("auth.signUp")}
          </Button>

          <p className="auth-switch">
            {t("auth.haveAccount")} <Link to={routes.login}>{t("auth.goToLogin")}</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
