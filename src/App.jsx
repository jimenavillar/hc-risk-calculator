import { useState } from "react";

const BETAS = {
  maternal_age: -0.032796600,
  maternal_height: -0.079129000,
  father_age: 0.021561800,
  bmi2: -0.687095000,
  bmi3: -0.750219600,
  edu2: -0.653100800,
  edu3: -0.892951800,
  married: 0.615393600,
  work_outside: -0.154592000,
  smoke: 0.890466100,
  birth2: 0.033805800,
  birth3: -0.451955500,
  birth4: -0.071519200,
  diabetes: 0.165881500,
  thyroid: -0.401693400,
  cardiac: 0.166552700,
  hypertension: -0.209996500,
  respiratory: 0.390833100,
  kidney: -0.582354100,
  malaria: -0.507895800,
  tb: 0.856787600,
  baseline: 10.953710000,
};

function calcRisk(inputs) {
  const logit =
    BETAS.baseline +
    BETAS.maternal_age * inputs.maternal_age +
    BETAS.maternal_height * inputs.maternal_height +
    BETAS.father_age * inputs.father_age +
    (inputs.bmi === "normal" ? 0 : inputs.bmi === "overweight" ? BETAS.bmi2 : BETAS.bmi3) +
    (inputs.edu === "university" ? BETAS.edu3 : 0) +
    (inputs.married ? BETAS.married : 0) +
    (inputs.work_outside ? 0 : BETAS.work_outside) +
    (inputs.smoke ? BETAS.smoke : 0) +
    (inputs.births_num === 0 ? 0 : inputs.births_num === 1 ? BETAS.birth2 : inputs.births_num === 2 ? BETAS.birth3 : BETAS.birth4) +
    (inputs.diabetes ? BETAS.diabetes : 0) +
    (inputs.thyroid ? BETAS.thyroid : 0) +
    (inputs.cardiac ? BETAS.cardiac : 0) +
    (inputs.hypertension ? BETAS.hypertension : 0) +
    (inputs.respiratory ? BETAS.respiratory : 0) +
    (inputs.kidney ? BETAS.kidney : 0) +
    (inputs.malaria ? BETAS.malaria : 0) +
    (inputs.tb ? BETAS.tb : 0);
  return 1 / (1 + Math.exp(-logit));
}

const defaultInputs = {
  maternal_age: 28,
  maternal_height: 160,
  father_age: 30,
  bmi: "normal",
  edu: "none_primary",
  married: false,
  work_outside: false,
  smoke: false,
  prev_pregnancies: false,
  births_num: 0,
  diabetes: false,
  thyroid: false,
  cardiac: false,
  hypertension: false,
  respiratory: false,
  kidney: false,
  malaria: false,
  tb: false,
};

const STEPS = ["Demographics & Lifestyle", "Medical History", "Result"];

function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem" }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < step ? "#1D9E75" : i === step ? "#0F6E56" : "var(--color-background-secondary)",
              border: i === step ? "2px solid #0F6E56" : i < step ? "2px solid #1D9E75" : "1.5px solid var(--color-border-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i <= step ? "#fff" : "var(--color-text-tertiary)",
              fontSize: 13, fontWeight: 500, transition: "all 0.25s",
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === step ? "#0F6E56" : "var(--color-text-tertiary)", whiteSpace: "nowrap", fontWeight: i === step ? 500 : 400 }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < step ? "#1D9E75" : "var(--color-border-tertiary)", margin: "0 6px", marginBottom: 18, transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 6px" }}>{hint}</p>}
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, unit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="number" value={value} min={min} max={max}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 90 }}
      />
      {unit && <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>{unit}</span>}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(opt => (
        <label key={opt.value} style={{
          display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
          padding: "6px 14px", borderRadius: "var(--border-radius-md)",
          border: value === opt.value ? "1.5px solid #1D9E75" : "1px solid var(--color-border-secondary)",
          background: value === opt.value ? "#E1F5EE" : "var(--color-background-primary)",
          fontSize: 13, fontWeight: value === opt.value ? 500 : 400,
          color: value === opt.value ? "#0F6E56" : "var(--color-text-primary)",
          transition: "all 0.15s",
        }}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ display: "none" }} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", padding: "8px 12px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)" }}>
      <div onClick={() => onChange(!value)} style={{
        width: 38, height: 22, borderRadius: 11, position: "relative",
        background: value ? "#1D9E75" : "var(--color-border-secondary)",
        transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3, left: value ? 19 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
      <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{label}</span>
    </label>
  );
}

function RiskResult({ risk }) {
  const pct = (risk * 100).toFixed(1);
  const above05 = risk >= 0.05;
  const above10 = risk >= 0.10;
  const above15 = risk >= 0.15;

  const activeBucket = !above05 ? 0 : !above10 ? 1 : !above15 ? 2 : 3;

  const buckets = [
    { label: "Below 0.05", desc: "Predicted probability < 5%", bg: "#E1F5EE", color: "#0F6E56", border: "#5DCAA5", dimBg: "var(--color-background-primary)" },
    { label: "Between 0.05 and 0.10", desc: "Predicted probability 5–10%", bg: "#EAF3DE", color: "#3B6D11", border: "#97C459", dimBg: "var(--color-background-primary)" },
    { label: "Between 0.10 and 0.15", desc: "Predicted probability 10–15%", bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27", dimBg: "var(--color-background-primary)" },
    { label: "Above 0.15", desc: "Predicted probability > 15%", bg: "#FCEBEB", color: "#791F1F", border: "#F09595", dimBg: "var(--color-background-primary)" },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: 28, fontWeight: 500, color: buckets[activeBucket].color }}>{pct}%</span>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>Select the matching option in the data collection form:</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {buckets.map((b, i) => {
          const active = i === activeBucket;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: "var(--border-radius-md)",
              border: active ? `2px solid ${b.border}` : "1px solid var(--color-border-tertiary)",
              background: active ? b.bg : "var(--color-background-primary)",
              opacity: active ? 1 : 0.5,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: active ? b.color : "var(--color-background-secondary)",
                border: active ? "none" : "1px solid var(--color-border-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: active ? "#fff" : "var(--color-text-tertiary)", fontWeight: 500,
              }}>
                {active ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? b.color : "var(--color-text-secondary)" }}>{b.label}</div>
                <div style={{ fontSize: 11, color: active ? b.color : "var(--color-text-tertiary)", opacity: active ? 0.8 : 1 }}>{b.desc}</div>
              </div>
              {active && <span style={{ fontSize: 11, fontWeight: 500, color: b.color, background: b.bg, border: `1px solid ${b.border}`, borderRadius: "var(--border-radius-md)", padding: "2px 8px", whiteSpace: "nowrap" }}>Select this</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(defaultInputs);
  const [patientId, setPatientId] = useState("");

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: val }));

  const risk = calcRisk(inputs);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>Low Birth Weight Risk Calculator</h2>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>Enter patient details to estimate LBW risk</p>
      </div>

      <ProgressBar step={step} />

      {step === 0 && (
        <div>
          <Field label="Patient ID (optional)">
            <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} placeholder="e.g. 6070" style={{ width: "100%" }} />
          </Field>
          <Field label="Maternal age">
            <NumberInput value={inputs.maternal_age} onChange={v => set("maternal_age", v)} min={14} max={55} unit="years" />
          </Field>
          <Field label="Maternal height">
            <NumberInput value={inputs.maternal_height} onChange={v => set("maternal_height", v)} min={120} max={200} unit="cm" />
          </Field>
          <Field label="Father's age">
            <NumberInput value={inputs.father_age} onChange={v => set("father_age", v)} min={14} max={80} unit="years" />
          </Field>
          <Field label="Maternal BMI category">
            <RadioGroup name="bmi" value={inputs.bmi} onChange={v => set("bmi", v)} options={[
              { value: "normal", label: "Normal (< 25)" },
              { value: "overweight", label: "Overweight (25–30)" },
              { value: "obese", label: "Obese (> 30)" },
            ]} />
          </Field>
          <Field label="Education level">
            <RadioGroup name="edu" value={inputs.edu} onChange={v => set("edu", v)} options={[
              { value: "none_primary", label: "None / Primary" },
              { value: "secondary", label: "Secondary / Technical" },
              { value: "university", label: "University" },
            ]} />
          </Field>
          <Field label="Previous pregnancies" hint="Select if the patient has had a previous pregnancy">
            <Toggle value={inputs.prev_pregnancies} onChange={v => set("prev_pregnancies", v)} label="Has had previous pregnancies" />
          </Field>
          <Field label="Previous births" hint="Select if the patient has had a previous birth">
            <Toggle value={inputs.births_num > 0} onChange={v => set("births_num", v ? 1 : 0)} label="Has had previous births" />
          </Field>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1.25rem", marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Lifestyle</p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 6px" }}>Select all that apply</p>
            <Toggle value={inputs.married} onChange={v => set("married", v)} label="Married or living as married" />
            <Toggle value={inputs.work_outside} onChange={v => set("work_outside", v)} label="Works outside the home" />
            <Toggle value={inputs.smoke} onChange={v => set("smoke", v)} label="Smoked during pregnancy" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1rem" }}>Select any conditions in the patient's medical history.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["diabetes", "Diabetes"],
              ["thyroid", "Thyroid / endocrine disorder"],
              ["cardiac", "Cardiac issue"],
              ["hypertension", "Hypertension"],
              ["respiratory", "Respiratory illness"],
              ["kidney", "Kidney disease"],
              ["malaria", "Malaria"],
              ["tb", "Tuberculosis"],
            ].map(([key, label]) => (
              <Toggle key={key} value={inputs[key]} onChange={v => set(key, v)} label={label} />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          {patientId && (
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "0.5rem", textAlign: "center" }}>Patient ID: <strong>{patientId}</strong></p>
          )}
          <RiskResult risk={risk} />
          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-secondary)", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>Please report the risk assessment to the data collection tool.</p>
          </div>
          <button onClick={() => { setInputs(defaultInputs); setPatientId(""); setStep(0); }} style={{ width: "100%", marginTop: "1rem", padding: "10px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", border: "1px solid var(--color-border-secondary)", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Start new patient
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: 8 }}>
        {step > 0 && step < 2 ? (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "10px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}>
            ← Back
          </button>
        ) : <div style={{ flex: 1 }} />}

        {step < 1 && (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: "10px", borderRadius: "var(--border-radius-md)", border: "none", background: "#1D9E75", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Continue →
          </button>
        )}
        {step === 1 && (
          <button onClick={() => setStep(2)} style={{ flex: 1, padding: "10px", borderRadius: "var(--border-radius-md)", border: "none", background: "#1D9E75", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            Calculate risk →
          </button>
        )}
      </div>
    </div>
  );
}
