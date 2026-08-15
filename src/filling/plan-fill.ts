import type { BasicProfile, BasicProfileField } from "../domain/profile";
import type { FillMatch, FillPlan, PageField } from "./types";

const aliases: Record<BasicProfileField, string[]> = {
  fullName: ["姓名", "名字", "name", "fullname", "full name"],
  phone: ["手机", "手机号", "联系电话", "phone", "mobile", "tel"],
  email: ["邮箱", "电子邮箱", "email", "e-mail"],
  school: ["学校", "院校", "毕业院校", "school", "university", "college"],
  major: ["专业", "所学专业", "major", "specialty"],
};

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s_:：*()（）-]/g, "");
}

function description(field: PageField): string {
  return normalize(
    [field.label, field.name, field.placeholder].filter(Boolean).join(" "),
  );
}

function candidatesFor(
  pageField: PageField,
  profile: BasicProfile,
): FillMatch[] {
  const text = description(pageField);
  return (Object.keys(aliases) as BasicProfileField[])
    .filter((profileField) => profile[profileField].trim() !== "")
    .map((profileField) => {
      const exact = aliases[profileField].some(
        (alias) => text === normalize(alias),
      );
      const partial = aliases[profileField].some((alias) =>
        text.includes(normalize(alias)),
      );
      return {
        pageFieldId: pageField.id,
        profileField,
        value: profile[profileField],
        confidence: exact || partial ? ("high" as const) : ("low" as const),
      };
    })
    .sort((left, right) =>
      left.confidence === right.confidence
        ? 0
        : left.confidence === "high"
          ? -1
          : 1,
    );
}

export function planBlankFieldFill(
  profile: BasicProfile,
  pageFields: PageField[],
): FillPlan {
  const plan: FillPlan = {
    fillable: [],
    skippedExisting: [],
    needsConfirmation: [],
    unmatched: [],
  };

  for (const pageField of pageFields) {
    if (pageField.value.trim() !== "") {
      plan.skippedExisting.push(pageField);
      continue;
    }

    const candidates = candidatesFor(pageField, profile);
    const confident = candidates.filter((candidate) => candidate.confidence === "high");
    if (confident.length === 1) {
      plan.fillable.push(confident[0]!);
    } else if (candidates.length > 0) {
      plan.needsConfirmation.push({ pageField, candidates: candidates.slice(0, 3) });
    } else {
      plan.unmatched.push(pageField);
    }
  }

  return plan;
}
