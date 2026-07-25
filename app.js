const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho&source=g.page.m.ia._&utm_source=gbp&laa=nmx-review-solicitation-ia2";
const CLINIC_NAME = "Dr Rajna's Homeopathy";
let treatmentEffectivenessRating = 5;
let doctorApproachRating = 5;
let clinicAmbienceRating = 5;
let staffBehaviorRating = 5;
let valueForMoneyRating = 5;
let lastData = null;
const $ = id => document.getElementById(id);
const pick = items => items[Math.floor(Math.random() * items.length)];
const clean = value => (value || "").trim().replace(/\s+/g, " ");
function injectClinicTheme() {
  const old = document.getElementById("clinicThemeStyles");
  if (old) old.remove();
  const style = document.createElement("style");
  style.id = "clinicThemeStyles";
  style.textContent = `
    :root {
      --clinic-bg-1: #fbf7f0;
      --clinic-bg-2: #f1f7f2;
      --clinic-card: rgba(255, 255, 255, 0.94);
      --clinic-text: #24312c;
      --clinic-muted: #66736d;
      --clinic-primary: #245c4a;
      --clinic-secondary: #7b5a2e;
      --clinic-border: #e2d8c8;
      --clinic-soft: #eef6f0;
      --clinic-star: #d99000;
    }
    body {
      min-height: 100vh;
      margin: 0;
      color: var(--clinic-text) !important;
      background:
        radial-gradient(circle at top left, rgba(216, 236, 221, 0.95), transparent 34%),
        radial-gradient(circle at bottom right, rgba(241, 225, 199, 0.95), transparent 36%),
        linear-gradient(135deg, var(--clinic-bg-1), var(--clinic-bg-2)) !important;
      font-family: Inter, Segoe UI, Roboto, Arial, sans-serif !important;
    }
    .container, .app, main, #app, #formScreen, #resultScreen {
      box-sizing: border-box;
    }
    .container, .app, main, #app {
      max-width: 980px !important;
      margin: 34px auto !important;
    }
    .card, .panel, .box, .form-card, .result-card, section, #formScreen, #resultScreen {
      border-color: var(--clinic-border) !important;
      border-radius: 24px !important;
      box-shadow: 0 20px 55px rgba(36, 92, 74, 0.12) !important;
    }
    #formScreen, #resultScreen {
      background: var(--clinic-card) !important;
      border: 1px solid var(--clinic-border) !important;
      padding: 28px !important;
    }
    h1, h2, h3, .section-title {
      color: var(--clinic-primary) !important;
      letter-spacing: -0.02em;
    }
    label, strong, .field-label, .rating-label {
      color: var(--clinic-text) !important;
      font-weight: 700 !important;
    }
    input, select, textarea {
      border: 1px solid #d9cdbd !important;
      background: #fffdf9 !important;
      border-radius: 14px !important;
      color: var(--clinic-text) !important;
      box-shadow: none !important;
      outline: none !important;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--clinic-primary) !important;
      box-shadow: 0 0 0 4px rgba(36, 92, 74, 0.12) !important;
    }

    /* Fix: keep every rating label and its 5 stars inside the rating card.
       The previous layout could inherit wide/absolute star styling from the host page,
       which made stars overflow to the right side of the screen. */
    .rating-row {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) 118px !important;
      align-items: center !important;
      column-gap: 14px !important;
      border-bottom: 1px dashed #e5dacb !important;
      padding: 12px 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
      position: relative !important;
    }
    .rating-row:last-child {
      border-bottom: 0 !important;
    }
    .rating-row label,
    .rating-row .rating-label,
    .rating-row strong {
      min-width: 0 !important;
      max-width: 100% !important;
      white-space: normal !important;
      overflow-wrap: anywhere !important;
      line-height: 1.25 !important;
    }
    .rating-row .stars,
    .rating-row [id$="Stars"] {
      display: flex !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 4px !important;
      width: 118px !important;
      min-width: 118px !important;
      max-width: 118px !important;
      height: auto !important;
      line-height: 1 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      position: static !important;
      inset: auto !important;
      transform: none !important;
      float: none !important;
      text-align: right !important;
    }
    .rating-row .star,
    .stars .star {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 19px !important;
      min-width: 19px !important;
      max-width: 19px !important;
      height: 22px !important;
      margin: 0 !important;
      padding: 0 !important;
      color: var(--clinic-star) !important;
      font-size: 20px !important;
      line-height: 1 !important;
      letter-spacing: 0 !important;
      cursor: pointer !important;
      position: static !important;
      transform: none !important;
    }
    .stars, .star {
      color: var(--clinic-star) !important;
    }
    button, .btn, #generateBtn {
      border: 0 !important;
      border-radius: 16px !important;
      background: linear-gradient(135deg, #245c4a, #3d8b65) !important;
      color: #fff !important;
      box-shadow: 0 12px 24px rgba(36, 92, 74, 0.18) !important;
      font-weight: 800 !important;
    }
    #apiSettingsBtn {
      background: #eef6f0 !important;
      color: var(--clinic-primary) !important;
      box-shadow: none !important;
      border: 1px solid #d7e6da !important;
    }
    #outputClinicHeader {
      color: var(--clinic-primary) !important;
      border-bottom: 1px solid var(--clinic-border);
      padding-bottom: 12px;
      margin-bottom: 16px !important;
    }
    #reviewOutput {
      min-height: 190px !important;
      line-height: 1.65 !important;
      font-size: 15px !important;
    }
    @media (max-width: 720px) {
      .container, .app, main, #app {
        max-width: calc(100vw - 24px) !important;
        margin: 16px auto !important;
      }
      #formScreen, #resultScreen {
        padding: 18px !important;
      }
      .rating-row {
        grid-template-columns: minmax(0, 1fr) 110px !important;
        column-gap: 10px !important;
      }
      .rating-row .stars,
      .rating-row [id$="Stars"] {
        width: 110px !important;
        min-width: 110px !important;
        max-width: 110px !important;
      }
      .rating-row .star,
      .stars .star {
        width: 18px !important;
        min-width: 18px !important;
        max-width: 18px !important;
        font-size: 19px !important;
      }
    }
  `;
  document.head.appendChild(style);
}
function removeFieldByText(pattern) {
  Array.from(document.querySelectorAll("label, strong, .label, .field-label, .rating-label, p, span, div")).forEach(el => {
    if (el.children.length > 0) return;
    if (!pattern.test(clean(el.textContent))) return;
    const field = el.closest(".field, .form-group, .input-group, .rating-row, .row, label");
    if (field && field !== document.body) field.remove();
    else el.remove();
  });
}
function closestField(el) {
  return el ? el.closest("label, .field, .form-group, .input-group, .rating-row, .row, div") : null;
}
function setText(el, text) {
  if (el) el.textContent = text;
}
function setLabelFor(controlId, labelText) {
  const control = $(controlId);
  if (!control) return;
  const explicit = document.querySelector(`label[for="${controlId}"]`);
  if (explicit) {
    explicit.textContent = labelText;
    return;
  }
  const field = closestField(control);
  const label = field ? field.querySelector("label, .label, .field-label, .rating-label, strong") : null;
  if (label && label !== control) label.textContent = labelText;
}
function removeFieldByControlId(controlId) {
  const control = $(controlId);
  if (!control) return;
  const field = control.closest(".field, .form-group, .input-group, .rating-row, .row");
  if (field && field !== document.body) {
    field.remove();
    return;
  }
  const explicit = document.querySelector(`label[for="${controlId}"]`);
  if (explicit) explicit.remove();
  const previous = control.previousElementSibling;
  if (previous && /^(LABEL|STRONG|SPAN|P)$/i.test(previous.tagName) && previous.children.length === 0) {
    previous.remove();
  }
  const next = control.nextElementSibling;
  if (next && /optional/i.test(clean(next.textContent)) && next.children.length === 0) {
    next.remove();
  }
  control.remove();
}
function removeTextElementByPattern(pattern) {
  Array.from(document.querySelectorAll("h1, h2, h3, h4, .title, .brand-title, .app-title, .logo-title, span, p, div")).forEach(el => {
    if (el.children.length > 0) return;
    if (pattern.test(clean(el.textContent))) el.remove();
  });
}
function languageElement() {
  return $("language");
}
function concernElement() {
  return $("treatmentConcern") || $("eventType");
}
function ratingId(name) {
  const legacyFirstRatingId = ["fo", "odStars"].join("");
  return {
    treatment: $("treatmentEffectivenessStars") ? "treatmentEffectivenessStars" : legacyFirstRatingId,
    doctor: $("doctorApproachStars") ? "doctorApproachStars" : "serviceStars",
    clinic: "clinicAmbienceStars",
    staff: "staffBehaviorStars",
    value: "valueForMoneyStars"
  }[name];
}
function updateTopText() {
  removeTextElementByPattern(/reviewgen|review gen|ai v/i);
  document.title = `${CLINIC_NAME} Review Generator`;
  const oldHeadings = Array.from(document.querySelectorAll("h1, h2, .hero h1, .heading h1"));
  oldHeadings.forEach(heading => {
    const text = clean(heading.textContent).toLowerCase();
    if (text === "generate natural customer reviews") heading.textContent = CLINIC_NAME;
  });
}
function ensureOutputHeader() {
  const resultScreen = $("resultScreen");
  if (!resultScreen) return;
  let header = $("outputClinicHeader");
  if (!header) {
    header = document.createElement("h2");
    header.id = "outputClinicHeader";
    header.className = "output-clinic-header";
    header.style.margin = "0 0 12px";
    header.style.color = "#4b006e";
    header.style.fontWeight = "800";
    header.style.textAlign = "center";
    const output = $("reviewOutput");
    if (output && output.parentNode === resultScreen) resultScreen.insertBefore(header, output);
    else resultScreen.insertBefore(header, resultScreen.firstChild);
  }
  header.textContent = CLINIC_NAME;
}
function ensureCustomConcernInput() {
  let custom = $("customTreatmentConcern") || $("customEventType");
  const concern = concernElement();
  if (!custom) {
    custom = document.createElement("input");
    if (concern && concern.parentNode) concern.parentNode.insertBefore(custom, concern.nextSibling);
  }
  custom.type = "text";
  custom.id = "customTreatmentConcern";
  custom.name = "customTreatmentConcern";
  custom.placeholder = "Enter treatment / concern";
  custom.autocomplete = "off";
  custom.style.display = "none";
  custom.style.marginTop = "8px";
  return custom;
}
function setupConcernDropdown() {
  const language = languageElement();
  if (language) setLabelFor("language", "Language");
  const concern = concernElement();
  if (!concern) return;
  concern.name = "treatmentConcern";
  setLabelFor(concern.id, "Treatment / Concern");
  if (concern.tagName === "SELECT") {
    const options = [
      ["", ""],
      ["Skin (Acne, Eczema, Psoriasis)", "Skin (Acne, Eczema, Psoriasis)"],
      ["Hair Fall", "Hair Fall"],
      ["Allergies", "Allergies"],
      ["Chronic Illness Management", "Chronic Illness Management"],
      ["Hormonal/PCOS", "Hormonal/PCOS"],
      ["Digestive Issues", "Digestive Issues"],
      ["Stress/Anxiety", "Stress/Anxiety"],
      ["Pediatric Care", "Pediatric Care"],
      ["Immunity Building", "Immunity Building"],
      ["Other", "Other"]
    ];
    concern.innerHTML = "";
    options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      concern.appendChild(option);
    });
  } else {
    concern.placeholder = "Enter treatment / concern";
  }
  const custom = ensureCustomConcernInput();
  function toggleCustomConcern() {
    const show = concern.value === "Other";
    custom.style.display = show ? "block" : "none";
    custom.required = show;
    if (!show) custom.value = "";
    if (show) custom.focus();
  }
  concern.addEventListener("change", toggleCustomConcern);
  toggleCustomConcern();
}
function removeOldGeneratedRatings() {
  document.querySelectorAll(".generated-clinic-rating-row").forEach(row => row.remove());
}
function makeRatingRow(labelText, id) {
  const row = document.createElement("div");
  row.className = "rating-row generated-clinic-rating-row";
  row.style.display = "grid";
  row.style.gridTemplateColumns = "minmax(0, 1fr) 118px";
  row.style.alignItems = "center";
  row.style.columnGap = "14px";
  row.style.width = "100%";
  row.style.maxWidth = "100%";
  row.style.overflow = "hidden";
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;
  label.style.fontWeight = "700";
  const stars = document.createElement("div");
  stars.id = id;
  stars.className = "stars";
  row.appendChild(label);
  row.appendChild(stars);
  return row;
}
function normaliseExistingRating(controlId, labelText) {
  const control = $(controlId);
  if (!control) return null;
  setLabelFor(controlId, labelText);
  control.classList.add("stars");
  const row = closestField(control);
  if (row) {
    row.classList.add("rating-row");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "minmax(0, 1fr) 118px";
    row.style.alignItems = "center";
    row.style.columnGap = "14px";
    row.style.width = "100%";
    row.style.maxWidth = "100%";
    row.style.overflow = "hidden";
  }
  return row;
}
function setupRatingLabels() {
  removeOldGeneratedRatings();
  const firstId = ratingId("treatment");
  const secondId = ratingId("doctor");
  const firstControl = $(firstId);
  if (firstControl && firstControl.id !== "treatmentEffectivenessStars") firstControl.id = "treatmentEffectivenessStars";
  const secondControl = $(secondId);
  if (secondControl && secondControl.id !== "doctorApproachStars") secondControl.id = "doctorApproachStars";
  const treatmentRow = normaliseExistingRating("treatmentEffectivenessStars", "Treatment Effectiveness ★");
  const doctorRow = normaliseExistingRating("doctorApproachStars", "Doctor's Approach / Listening ★");
  const anchor = doctorRow || treatmentRow;
  const parent = anchor ? anchor.parentNode : null;
  const before = $("likedMost") ? closestField($("likedMost")) : null;
  const rows = [
    makeRatingRow("Clinic Cleanliness/Ambience ★", "clinicAmbienceStars"),
    makeRatingRow("Staff Behavior ★", "staffBehaviorStars"),
    makeRatingRow("Value for Money ★", "valueForMoneyStars")
  ];
  if (parent && before && before.parentNode === parent) rows.forEach(row => parent.insertBefore(row, before));
  else if (anchor && parent) rows.forEach(row => parent.insertBefore(row, anchor.nextSibling));
  else rows.forEach(row => ($("formScreen") || document.body).appendChild(row));
  setLabelFor("likedMost", "What helped most?");
  if ($("likedMost")) $("likedMost").placeholder = "Example: detailed consultation, clear guidance, follow-up support";
  removeFieldByControlId("specialMention");
  removeFieldByText(/specific\s*(doctor|dish).*?(staff|service).*mention/i);
}
function buildStars(id, callback) {
  const container = $(id);
  if (!container) return;
  container.classList.add("stars");
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "star on";
    star.title = `${i} star`;
    star.onclick = () => {
      [...container.children].forEach((item, index) => item.classList.toggle("on", index < i));
      callback(i);
    };
    container.appendChild(star);
  }
}
function readInputs() {
  const concern = concernElement();
  const selectedConcern = clean(concern ? concern.value : "");
  const customConcern = clean($("customTreatmentConcern")?.value);
  return {
    language: $("language")?.value || "English",
    treatmentConcern: selectedConcern === "Other" ? customConcern : selectedConcern,
    length: $("length")?.value || "",
    likedMost: clean($("likedMost")?.value),
    treatmentEffectivenessRating,
    doctorApproachRating,
    clinicAmbienceRating,
    staffBehaviorRating,
    valueForMoneyRating
  };
}
function averageRating(data) {
  return (
    data.treatmentEffectivenessRating +
    data.doctorApproachRating +
    data.clinicAmbienceRating +
    data.staffBehaviorRating +
    data.valueForMoneyRating
  ) / 5;
}
function concernLine(concern) {
  const text = clean(concern);
  return text ? `I visited ${CLINIC_NAME} for ${text}.` : `I visited ${CLINIC_NAME} for a consultation.`;
}
function ratingSentence(kind, rating) {
  const bucket = rating >= 5 ? 5 : rating === 4 ? 4 : rating === 3 ? 3 : 1;
  const sentences = {
    treatment: {
      5: ["The treatment plan felt thoughtful, clear, and supportive for my concern.", "The consultation and treatment approach felt well planned and reassuring."],
      4: ["The treatment approach was good overall, with clear guidance and steady support.", "The treatment plan was explained well and felt helpful overall."],
      3: ["The treatment experience was satisfactory, with some scope for improvement."],
      1: ["The overall treatment process can be improved further."]
    },
    doctor: {
      5: ["The doctor listened patiently, understood the details, and explained everything calmly.", "I appreciated the way the doctor took time to listen and guide me properly."],
      4: ["The doctor listened well and explained the approach clearly.", "The consultation felt comfortable, and the doctor was supportive."],
      3: ["The doctor's approach was satisfactory, though the discussion could have been more detailed."],
      1: ["The consultation experience could be improved with clearer explanation and communication."]
    },
    clinic: {
      5: ["The clinic was clean, calm, and comfortable.", "The clinic environment felt clean and welcoming."],
      4: ["The clinic was clean and comfortable overall.", "The ambience was good and maintained well."],
      3: ["The clinic environment was satisfactory overall."],
      1: ["Cleanliness and ambience could be improved." ]
    },
    staff: {
      5: ["The staff was polite, helpful, and well coordinated.", "The clinic team handled the visit smoothly and respectfully."],
      4: ["The staff was cooperative and helpful overall.", "The clinic team managed the visit well."],
      3: ["Staff behavior was satisfactory, though coordination could be better."],
      1: ["Staff coordination could be improved for a smoother visit."]
    },
    value: {
      5: ["Overall, the consultation felt worth the money.", "The overall value felt fair and satisfying."],
      4: ["The experience felt reasonably priced overall.", "Value for money was good overall."],
      3: ["Value for money was average and could be better."],
      1: ["Value for money could be improved."]
    }
  };
  return pick(sentences[kind][bucket]);
}
function highlightSentence(data) {
  if (!data.likedMost) return "";
  return pick([`I especially liked ${data.likedMost}.`, `What stood out for me was ${data.likedMost}.`]);
}
function closingSentence(data) {
  if (averageRating(data) >= 4) {
    return pick([
      "Overall, it was a smooth and reassuring clinic experience.",
      "Overall, I had a positive experience and would recommend the clinic for similar concerns.",
      "Thank you to the doctor and clinic team for the patient and supportive experience."
    ]);
  }
  return pick([
    "Overall, the experience was decent, and with a few improvements it can become better.",
    "Overall, it was a satisfactory experience with some good parts and some scope for improvement.",
    "I appreciate the effort from the clinic team and hope the improvement areas are taken positively."
  ]);
}
function englishReview(data) {
  const pieces = [
    concernLine(data.treatmentConcern),
    ratingSentence("treatment", data.treatmentEffectivenessRating),
    ratingSentence("doctor", data.doctorApproachRating),
    ratingSentence("clinic", data.clinicAmbienceRating),
    ratingSentence("staff", data.staffBehaviorRating),
    ratingSentence("value", data.valueForMoneyRating),
    highlightSentence(data),
    closingSentence(data)
  ].filter(Boolean);
  let review = pieces.join(" ");
  if (data.length === "Short") {
    review = [pieces[0], pieces[1], pieces[2], closingSentence(data)].filter(Boolean).join(" ");
  }
  if (data.length === "Detailed") {
    review += " This review is based on my actual experience with the consultation, clinic environment, staff support, and overall value.";
  }
  return review.replace(/\s+/g, " ").trim();
}
function localReview(data) {
  if (data.language === "English") return englishReview(data);
  const concern = data.treatmentConcern || "consultation";
  const good = averageRating(data) >= 4;
  if (data.language === "Hindi") {
    return `मैं ${concern} के लिए ${CLINIC_NAME} गया/गई। डॉक्टर ने ध्यान से सुना और शांत तरीके से समझाया। क्लिनिक साफ और आरामदायक लगा, और स्टाफ भी सहयोगी रहा।${data.likedMost ? ` मुझे खास तौर पर ${data.likedMost} पसंद आया।` : ""}${good ? "कुल मिलाकर अनुभव अच्छा रहा और मैं similar concerns के लिए recommend करूंगा/करूंगी।" : "कुल मिलाकर अनुभव ठीक रहा, कुछ जगह सुधार की गुंजाइश है।"}`;
  }
  if (data.language === "Gujarati") {
    return `હું ${concern} માટે ${CLINIC_NAME} ગયો/ગઈ હતો/હતી. ડૉક્ટરે ધ્યાનથી સાંભળ્યું અને શાંતિથી સમજાવ્યું. ક્લિનિક સાફ અને આરામદાયક લાગ્યું, અને સ્ટાફ પણ સહયોગી રહ્યો.${data.likedMost ? ` મને ખાસ કરીને ${data.likedMost} ગમ્યું.` : ""}${good ? "કુલ મળીને અનુભવ સારો રહ્યો અને હું જરૂરથી recommend કરીશ." : "કુલ અનુભવ ઠીક રહ્યો, થોડા સુધારા માટે જગ્યા છે."}`;
  }
  if (data.language === "Marathi") {
    return `मी ${concern} साठी ${CLINIC_NAME} ला भेट दिली. डॉक्टरांनी लक्षपूर्वक ऐकले आणि शांतपणे मार्गदर्शन केले. क्लिनिक स्वच्छ आणि आरामदायक वाटले, आणि स्टाफही सहकार्य करणारा होता.${data.likedMost ? ` ${data.likedMost} खास आवडले.` : ""}${good ? "एकूण अनुभव चांगला राहिला आणि similar concerns साठी मी नक्की recommend करेन." : "एकूण अनुभव ठीक होता, काही सुधारणा केल्या तर अजून चांगले होईल."}`;
  }
  return englishReview(data);
}
function settings() {
  return {
    endpoint: localStorage.getItem("reviewgen_api_endpoint") || "",
    model: localStorage.getItem("reviewgen_api_model") || "gpt-4o-mini",
    key: localStorage.getItem("reviewgen_api_key") || ""
  };
}
function updateAIStatus() {
  const status = $("aiStatus");
  if (status) status.remove();
}
async function callAI(data, instruction = "") {
  const s = settings();
  if (!s.endpoint || !s.key) return null;
  const prompt = `Write one natural first-person Google review for ${CLINIC_NAME}. Do not say "customer feedback". Do not mention "selected ratings". Do not provide medical advice, diagnosis, dosage, cure guarantees, or exaggerated claims. Treatment/Concern:${data.treatmentConcern || "not specified"}. Language:${data.language}. Length:${data.length}. Treatment effectiveness:${data.treatmentEffectivenessRating}/5. Doctor approach/listening:${data.doctorApproachRating}/5. Clinic cleanliness/ambience:${data.clinicAmbienceRating}/5. Staff behavior:${data.staffBehaviorRating}/5. Value for money:${data.valueForMoneyRating}/5. Visitor liked:${data.likedMost || "not specified"}. Extra instruction:${instruction || "none"}. If ratings are below 4, write balanced polite feedback. Output only the review text.`;
  const response = await fetch(s.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${s.key}`
    },
    body: JSON.stringify({
      model: s.model,
      messages: [
        { role: "system", content: "You write authentic first-person clinic reviews. Avoid medical advice, diagnosis, dosage, cure guarantees, and exaggerated claims." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      presence_penalty: 0.4,
      frequency_penalty: 0.4
    })
  });
  if (!response.ok) throw new Error("AI API error " + response.status);
  const json = await response.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}
async function generate(instruction = "", useLast = false) {
  const data = useLast && lastData ? lastData : readInputs();
  lastData = data;
  let review = null;
  try {
    review = await callAI(data, instruction);
  } catch (error) {
    console.warn(error);
  }
  if (!review) review = localReview(data);
  ensureOutputHeader();
  $("reviewOutput").value = review;
  $("formScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");
}
function copyReview() {
  const output = $("reviewOutput");
  output.select();
  navigator.clipboard.writeText(output.value);
  alert("Review copied successfully!");
}
function openSettings() {
  const s = settings();
  $("apiEndpoint").value = s.endpoint;
  $("apiModel").value = s.model;
  $("apiKey").value = s.key;
  $("settingsDialog").showModal();
}
function saveSettings(event) {
  event.preventDefault();
  localStorage.setItem("reviewgen_api_endpoint", $("apiEndpoint").value.trim());
  localStorage.setItem("reviewgen_api_model", $("apiModel").value.trim() || "gpt-4o-mini");
  localStorage.setItem("reviewgen_api_key", $("apiKey").value.trim());
  $("settingsDialog").close();
  updateAIStatus();
}
function initialisePage() {
  injectClinicTheme();
  updateTopText();
  ensureOutputHeader();
  removeFieldByControlId("tone");
  removeFieldByText(/review\s*tone/i);
  removeFieldByText(/specific\s*(doctor|dish).*?(staff|service).*mention/i);
  removeTextElementByPattern(/reviewgen\s*ai\s*v?6\.5/i);
  updateAIStatus();
  setupConcernDropdown();
  setupRatingLabels();
  buildStars("treatmentEffectivenessStars", value => treatmentEffectivenessRating = value);
  buildStars("doctorApproachStars", value => doctorApproachRating = value);
  buildStars("clinicAmbienceStars", value => clinicAmbienceRating = value);
  buildStars("staffBehaviorStars", value => staffBehaviorRating = value);
  buildStars("valueForMoneyStars", value => valueForMoneyRating = value);
  updateAIStatus();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialisePage);
else initialisePage();
if ($("generateBtn")) $("generateBtn").onclick = () => generate();
if ($("freshBtn")) $("freshBtn").onclick = () => generate("", true);
if ($("rewriteBtn")) $("rewriteBtn").onclick = () => generate($("customInstruction").value.trim(), true);
if ($("copyBtn")) $("copyBtn").onclick = copyReview;
if ($("googleBtn")) $("googleBtn").onclick = () => window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
if ($("againBtn")) $("againBtn").onclick = () => {
  $("resultScreen").classList.add("hidden");
  $("formScreen").classList.remove("hidden");
};
if ($("apiSettingsBtn")) $("apiSettingsBtn").onclick = openSettings;
if ($("saveSettingsBtn")) $("saveSettingsBtn").onclick = saveSettings;
