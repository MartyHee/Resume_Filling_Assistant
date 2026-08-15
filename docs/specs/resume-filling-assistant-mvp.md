## Problem Statement

国内应届生在牛客、北森及其他招聘网站进行网申时，需要反复把同一份个人资料填写到结构不一致、命名不统一且包含动态经历列表的表单中。手工填写耗时、容易遗漏，也可能因误覆盖已有内容或错误识别字段而破坏已经完成的表单。现有自动化方案还常要求上传个人资料、授予全部网站权限或自动提交，无法满足求职资料的隐私、安全和可控性要求。

Resume Filling Assistant 需要在不替用户提交申请的前提下，把一份本地全局档案可靠地映射到当前网页。它必须让用户看见、确认并撤销填充结果，对敏感字段实施更严格的主动授权，同时在 MVP 阶段优先把牛客和北森常见字段的正确填充率做到约 90%，且任何失败都不能破坏原表单。

## Solution

构建一个面向国内应届生的本地优先网申浏览器扩展。首发支持 Edge，采用共享核心与浏览器适配层的架构，为后续 Chrome、Firefox 支持保留清晰边界。

用户在扩展侧边栏中维护一份全局档案，也可从 PDF、TXT、MD 导入资料，或从当前网页反向补充资料。导入和反向补充都必须先展示差异，默认保留旧值，并识别重复经历。

扩展按需获得当前招聘网站权限，识别牛客、北森和通用网页表单。普通字段可整表填充或通过按资料类别排列的字段气泡逐项填充；默认只填空白字段。低置信度映射最多展示三个候选值，由用户确认后才填入，并将确认过的映射按网站、表单结构和字段特征保存在本地。动态经历通过独立的“同步全部经历”操作处理。

敏感资料选择性启用并加密保存。敏感字段只能由用户从字段气泡主动解锁，授权仅对本次页面有效。每次填充都可在当前页面一键撤销，结束后显示分类结果摘要并可定位异常字段。扩展不处理附件上传、不自动生成开放题答案、禁止自动提交，也不会默认上传诊断数据。

## User Stories

1. As a domestic graduate job seeker, I want to maintain one reusable profile, so that I do not repeatedly enter the same application information.
2. As a profile owner, I want to store basic personal information, so that common identity and contact fields can be filled consistently.
3. As a profile owner, I want to store job preferences, so that target role and location fields can be reused.
4. As a profile owner, I want to store education history, so that education sections can be populated from structured records.
5. As a profile owner, I want to store internship history, so that repeated internship sections can be synchronized.
6. As a profile owner, I want to store project history, so that project sections can be synchronized.
7. As a profile owner, I want to store publications, language examinations, skills, certificates and awards, campus experience, personal strengths, and portfolio links, so that the full range of graduate application fields is covered.
8. As a profile owner, I want to add custom fields, so that information outside the predefined categories remains reusable.
9. As a privacy-conscious user, I want ordinary profile data stored locally, so that routine use does not require a cloud account.
10. As a privacy-conscious user, I want sensitive profile categories to be optional, so that I can avoid storing information I do not want the extension to retain.
11. As a user who enables sensitive data, I want it encrypted with my password, so that local storage does not expose plaintext secrets.
12. As a user unlocking a sensitive field, I want the unlock to apply only to the current page session, so that later pages cannot silently reuse that authorization.
13. As a user, I want sensitive fields to require an explicit field-bubble action, so that bulk filling cannot expose sensitive values accidentally.
14. As a user, I want a clear warning that an encryption password cannot be recovered, so that I understand the consequence before enabling encryption.
15. As a user, I want to export and import encrypted backups, so that I can recover or migrate my profile without cloud synchronization.
16. As a multi-browser user, I want encrypted backup migration to work across supported browsers, so that changing browsers does not require rebuilding my profile.
17. As a user with an existing resume, I want to import PDF, TXT, or MD files into the local profile, so that initial setup is faster.
18. As an importing user, I want to preview differences before applying imported data, so that parsing cannot silently change my profile.
19. As an importing user, I want existing values preserved by default, so that imported content does not overwrite curated information without consent.
20. As an importing user, I want duplicate experiences detected, so that the profile does not accumulate repeated education, internship, project, or other records.
21. As a user viewing a completed application form, I want to extract candidate values back into my profile through difference confirmation, so that useful information already entered on a site can supplement my local data.
22. As an offline-first user, I want document and page parsing to run locally by default, so that my resume content is not sent to a server.
23. As a future cloud-parsing user, I want cloud parsing to require explicit opt-in, so that an update cannot silently change my privacy posture.
24. As an Edge user, I want to install the initial extension in developer mode, so that the MVP can be validated before store submission.
25. As a Chrome or Firefox user, I want future browser versions to behave consistently, so that the product can expand without fragmenting its core behavior.
26. As a job applicant, I want the extension to request access only for the site I choose to use, so that it does not retain permanent access to every website.
27. As a 牛客 applicant, I want common 牛客 fields recognized accurately, so that I can complete applications faster.
28. As a 北森 applicant, I want common 北森 fields recognized accurately, so that I can complete applications faster.
29. As an applicant on another site, I want generic form recognition, so that the extension remains useful outside explicitly supported sites.
30. As a user, I want the extension controls in a side panel, so that profile and fill actions remain visible without replacing the application page.
31. As a user filling one field, I want field bubbles grouped by profile category, so that I can find the relevant value quickly.
32. As a user with an empty form, I want to fill the whole form in one action, so that routine applications require fewer interactions.
33. As a cautious user, I want to fill a single field from its bubble, so that I can control changes precisely.
34. As a user with partially completed forms, I want filling to affect blank fields only by default, so that my existing answers remain unchanged.
35. As a user reviewing an uncertain mapping, I want to see no more than three candidate profile values, so that I can make a focused confirmation decision.
36. As a user confirming a mapping, I want the extension to remember it locally for the same site and form pattern, so that future recognition improves without cloud learning.
37. As a user revisiting a changed form, I want learned mappings scoped by site, form structure, and field features, so that an old confirmation is not applied to an unrelated field.
38. As a user with multiple experiences, I want a separate “同步全部经历” action, so that repeated dynamic sections are handled intentionally rather than during ordinary scalar-field filling.
39. As a user who just filled a page, I want to undo this page's latest fill in one action, so that I can recover from an incorrect result.
40. As a user completing a fill, I want a categorized result summary, so that I can distinguish filled, skipped, uncertain, sensitive, and failed fields.
41. As a user reviewing the result summary, I want to navigate directly to an abnormal field, so that I can correct it efficiently.
42. As a safety-conscious applicant, I want the extension to leave the form usable when recognition or filling fails, so that automation never destroys my work.
43. As an applicant, I want to submit the final application myself, so that the extension can never send an application without my deliberate action.
44. As an applicant, I want attachment uploads excluded from automation, so that the extension does not choose or transmit files on my behalf.
45. As an applicant, I want open-ended answers left to me, so that the extension does not fabricate application content with AI.
46. As a privacy-conscious user, I want diagnostic data to remain local by default, so that troubleshooting does not create hidden telemetry.
47. As a user seeking support, I want to preview and export a redacted diagnostic package, so that I can share useful evidence without exposing raw personal data.
48. As an MVP user, I want no account or sign-in requirement, so that I can use the extension locally with minimal setup.
49. As an MVP user, I want no long-term fill history, so that the extension does not retain an unnecessary record of my applications.
50. As a maintainer, I want measurable correctness on representative 牛客 and 北森 forms, so that the MVP's approximately 90% common-field target can be evaluated.

## Implementation Decisions

- The product is an independently implemented browser extension inspired only at a product-reference level by CampusApply-Agent; no CampusApply-Agent code will be used as the implementation base.
- Edge is the launch browser. Chrome and Firefox follow later through a shared browser-independent core and thin browser adaptation layers.
- The MVP has dedicated adapters for 牛客 and 北森 plus a generic form-recognition path for other sites.
- The primary extension surface is a side panel. In-page field bubbles are secondary, context-specific controls and are organized using the same profile categories as the local profile.
- The product owns exactly one global profile. Its built-in categories are basic information, job preferences, education, internships, projects, publications, language examinations, skills, certificates and awards, campus experience, personal strengths, and portfolio links. Users may add custom fields.
- Filling is split into scalar-field filling and dynamic-experience synchronization. Whole-form filling and single-field bubble filling operate on scalar fields; repeated experience sections are changed only through the separate “同步全部经历” action.
- The default write policy is blank-only. A field with an existing value is skipped unless a later explicitly designed interaction authorizes replacement; no implicit overwrite behavior is part of this MVP.
- Recognition produces mapping confidence. Low-confidence fields are not filled automatically and expose at most three ranked profile candidates for user confirmation.
- Confirmed mappings are stored locally and keyed by site identity, form-structure fingerprint, and field features. Learned mappings must not be treated as global synonyms detached from their context.
- A fill operation records the minimum page-local change set required to undo that operation. “Undo” restores the page state from immediately before the latest fill made on that page and does not create a long-term application history.
- Fill completion produces categorized results, including successful fills, skipped existing values, fields requiring confirmation, locked sensitive fields, and failures. Each abnormal result retains enough page context to focus or scroll to its field.
- PDF, TXT, and MD imports only update the local profile after a difference-confirmation flow. Existing values are selected by default, and structured repeated records are checked for duplicates.
- Reverse extraction from the current webpage uses the same difference-confirmation principle before supplementing the local profile.
- Parsing is offline by default. Any future cloud parsing capability is disabled until the user explicitly opts in and is not part of the MVP implementation.
- Ordinary profile data is stored locally. Sensitive data storage is optional and encrypted using a password-derived key; the password is not recoverable by the product.
- Sensitive values are excluded from whole-form filling. A sensitive value can be filled only after the user actively unlocks it from that field's bubble, and the authorization expires with the current page session.
- Encrypted backup export and import preserve sensitive-data protection and support migration among supported browsers without requiring an account or cloud service.
- Host access uses optional, site-specific runtime grants. The extension does not request persistent access to all websites.
- The extension never triggers final form submission and must not simulate or invoke submit controls as part of any fill flow.
- Attachment uploads and AI-generated answers for open-ended questions are excluded from all recognition and filling operations.
- Diagnostic data is not uploaded by default. The only MVP support workflow is a user-previewed, explicitly exported, redacted diagnostic package.
- The MVP has no account system, cloud synchronization, or long-term fill history.
- The MVP success target is approximately 90% correct filling of common fields on the representative 牛客 and 北森 test corpus. A failed or partial operation must preserve the original form's usability and pre-existing values.
- Distribution begins with a developer-mode Edge package. Edge Add-ons submission happens only after validation and is a release step rather than an MVP runtime capability.

## Testing Decisions

- Use one browser-level end-to-end seam. Install the extension as a black box in a test browser and exercise it through the side panel, field bubbles, and real page DOM behavior.
- Use representative local fixtures for common 牛客 forms, common 北森 forms, and generic forms. Fixtures model relevant form structures and dynamic behavior without depending on live third-party availability.
- Exercise local persistence and encryption through the extension's public interactions rather than replacing them with module mocks. Assert only user-observable side-panel state, field-bubble state, form values, browser-visible storage outcomes, exported artifacts, and page navigation/focus behavior.
- Cover profile creation and custom fields; PDF/TXT/MD import difference review; old-value preservation; duplicate-experience detection; reverse extraction; whole-form filling; single-field filling; blank-only behavior; low-confidence candidates; learned mappings; dynamic-experience synchronization; sensitive-field unlock scope; encrypted backup migration; undo; categorized summaries; abnormal-field navigation; and redacted diagnostic export.
- Include negative safety scenarios proving that existing values are not overwritten by default, sensitive values are not bulk-filled, attachments are not uploaded, open-ended answers are not generated, submit controls are never invoked, denied site access prevents page interaction, and failed fills leave the original form usable.
- Measure the approximately 90% common-field target against a versioned representative 牛客 and 北森 fixture corpus. Report correct, incorrect, skipped, and confirmation-required outcomes separately so that unsafe guesses cannot inflate correctness.
- There is no prior test suite in the empty repository. The browser-level seam defined here becomes the initial testing prior art; lower-level tests may be added later only when they protect complex pure logic without duplicating browser-observable coverage.

## Out of Scope

- Chrome and Firefox release packages in the initial Edge MVP, while preserving architecture for later support.
- Edge Add-ons store publication before the developer-mode package has been validated.
- User accounts, authentication, cloud synchronization, and server-side profile storage.
- Long-term application or fill history.
- Default or implicit cloud-based parsing.
- Permanent all-sites host permission.
- Automated attachment selection or upload.
- AI generation of open-ended application answers.
- Automatic or assisted final application submission.
- More than one global profile or job-specific profile variants.
- Automatic replacement of non-empty form fields.
- Background upload of analytics, diagnostics, resumes, form content, or learned mappings.
- Guaranteed support for every recruitment website or every historical 牛客/北森 form variant.

## Further Notes

- “约 90%” is an MVP validation target for common fields in the maintained representative corpus, not a promise that every arbitrary form will achieve that rate.
- Safety has priority over fill coverage: uncertain fields should require confirmation or remain untouched rather than be filled with a risky guess.
- The result summary is both a user trust mechanism and the primary way to expose partial success without treating the entire operation as failed.
- Site-, structure-, and feature-scoped learned mappings provide local adaptation while limiting incorrect cross-site generalization.
- No Git commit is created as part of producing or publishing this specification; committing remains subject to explicit human confirmation.
