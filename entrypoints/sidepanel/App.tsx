import { useEffect, useState } from "react";
import {
  basicProfileFields,
  basicProfileLabels,
  emptyBasicProfile,
  type BasicProfile,
} from "../../src/domain/profile";
import { loadBasicProfile, saveBasicProfile } from "../../src/storage/profile-store";
import { planBlankFieldFill } from "../../src/filling/plan-fill";
import type { FillSummary } from "../../src/filling/types";
import {
  applyFillMatches,
  scanActivePage,
  undoLatestFill,
} from "../../src/browser/page-bridge";

type Activity = { tone: "info" | "success" | "error"; text: string };

export function App() {
  const [profile, setProfile] = useState<BasicProfile>(emptyBasicProfile);
  const [activity, setActivity] = useState<Activity>({ tone: "info", text: "准备就绪" });
  const [summary, setSummary] = useState<FillSummary | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void loadBasicProfile().then(setProfile);
  }, []);

  async function persistProfile() {
    await saveBasicProfile(profile);
    setActivity({ tone: "success", text: "基础资料已保存在本地" });
  }

  async function fillBlankFields() {
    setBusy(true);
    setSummary(null);
    try {
      await saveBasicProfile(profile);
      const snapshot = await scanActivePage();
      const plan = planBlankFieldFill(profile, snapshot.fields);
      const nextSummary = await applyFillMatches(plan.fillable, {
        skippedExisting: plan.skippedExisting.length,
        needsConfirmation: plan.needsConfirmation.length,
        unmatched: plan.unmatched.length,
      });
      setSummary(nextSummary);
      setActivity({
        tone: nextSummary.failed ? "error" : "success",
        text: `已检查 ${snapshot.fields.length} 个字段`,
      });
    } catch (error) {
      setActivity({
        tone: "error",
        text: error instanceof Error ? error.message : "填充失败",
      });
    } finally {
      setBusy(false);
    }
  }

  async function undo() {
    setBusy(true);
    try {
      const count = await undoLatestFill();
      setSummary(null);
      setActivity({ tone: "success", text: `已撤销 ${count} 个字段` });
    } catch (error) {
      setActivity({
        tone: "error",
        text: error instanceof Error ? error.message : "撤销失败",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header>
        <span className="eyebrow">LOCAL FIRST</span>
        <h1>网申填充助手</h1>
        <p>保存一份资料，只填当前页面的空白字段。</p>
      </header>

      <section className="card">
        <div className="section-heading">
          <div>
            <span className="step">01</span>
            <h2>基础信息</h2>
          </div>
          <span className="local-badge">仅本地</span>
        </div>
        <div className="fields">
          {basicProfileFields.map((field) => (
            <label key={field}>
              <span>{basicProfileLabels[field]}</span>
              <input
                value={profile[field]}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
        </div>
        <button className="secondary" onClick={() => void persistProfile()} disabled={busy}>
          保存资料
        </button>
      </section>

      <section className="card action-card">
        <div className="section-heading">
          <div>
            <span className="step">02</span>
            <h2>当前页面</h2>
          </div>
        </div>
        <button className="primary" onClick={() => void fillBlankFields()} disabled={busy}>
          {busy ? "处理中…" : "填充空白字段"}
        </button>
        <button className="secondary" onClick={() => void undo()} disabled={busy}>
          撤销本次填充
        </button>

        <p className={`activity ${activity.tone}`}>{activity.text}</p>

        {summary && (
          <div className="summary" aria-label="填充结果">
            <Result label="已填充" value={summary.filled} tone="good" />
            <Result label="已有值" value={summary.skippedExisting} />
            <Result label="需确认" value={summary.needsConfirmation} tone="warn" />
            <Result label="未匹配" value={summary.unmatched} />
            <Result label="失败" value={summary.failed} tone="bad" />
          </div>
        )}
      </section>

      <footer>不会自动提交 · 不处理附件 · 默认不上传数据</footer>
    </main>
  );
}

function Result({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  return (
    <div className={`result ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
