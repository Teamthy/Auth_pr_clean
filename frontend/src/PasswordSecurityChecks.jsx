import { getPasswordChecks, getPasswordStrength } from "./validators";

export default function PasswordSecurityChecks({ password }) {
  const checks = getPasswordChecks(password);
  const strength = getPasswordStrength(password);

  return (
    <div className="password-checks">
      <div className="password-strength-row">
        <span>Password strength</span>
        <span className={strength.colorClass}>{strength.label}</span>
      </div>
      <div className="password-strength-meter">
        <div
          className={`password-strength-fill ${strength.meterClass}`}
          style={{ width: strength.width }}
        ></div>
      </div>
      <ul className="password-rules">
        {checks.map((rule) => (
          <li key={rule.id} className={rule.passed ? "rule-passed" : "rule-pending"}>
            {rule.label}
            {!rule.required ? " (recommended)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
