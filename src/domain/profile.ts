export const basicProfileFields = [
  "fullName",
  "phone",
  "email",
  "school",
  "major",
] as const;

export type BasicProfileField = (typeof basicProfileFields)[number];

export type BasicProfile = Record<BasicProfileField, string>;

export const emptyBasicProfile: BasicProfile = {
  fullName: "",
  phone: "",
  email: "",
  school: "",
  major: "",
};

export const basicProfileLabels: Record<BasicProfileField, string> = {
  fullName: "姓名",
  phone: "手机号",
  email: "邮箱",
  school: "学校",
  major: "专业",
};
