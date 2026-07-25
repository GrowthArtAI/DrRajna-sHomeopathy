const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho&source=g.page.m.ia._&utm_source=gbp&laa=nmx-review-solicitation-ia2";
const CLINIC_NAME = "Dr Rajna's Homeopathy";

const ratings = {
  treatmentEffectivenessRating: 5,
  doctorApproachRating: 5,
  clinicAmbienceRating: 5,
  staffBehaviorRating: 5,
  valueForMoneyRating: 5
};

let lastData = null;
const $ = id => document.getElementById(id);
const pick = items => items[Math.floor(Math.random() * items.length)];
const clean = value => (value || "").trim().replace(/\s+/g, " ");

function setupConcernDropdown() {
  const concern = $("treatmentConcern");
  const custom = $("customTreatmentConcern");
  if (!concern || !custom) return;

  function toggleCustomConcern() {
    const show = concern.value === "Other";
    custom.classList.toggle("hidden", !show);
    custom.required = show;
    if (!show) custom.value = "";
    if (show) custom.focus();
  }

  concern.addEventListener("change", toggleCustomConcern);
  toggleCustomConcern();
}

function buildStars(containerId, ratingKey) {
  const container = $(containerId);
  if (!container) return;

  container.innerHTML = "";
  container.classList.add("stars");

  const paint = value => {
    [...container.children].forEach((star, index) => {
      const selected = index < value;
      star.classList.toggle("on", selected);
      star.setAttribute("aria-checked", String(index + 1 === value));
    });
  };

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star";
    star.textContent = "★";
    star.title = `${i} star${i > 1 ? "s" : ""}`;
    star.setAttribute("role", "radio");
    star.setAttribute("aria-label", `${i} star${i > 1 ? "s" : ""}`);

    star.addEventListener("mouseenter", () => paint(i));
    star.addEventListener("focus", () => paint(i));
    star.addEventListener("click", () => {
      ratings[ratingKey] = i;
      paint(i);
    });
    star.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        ratings[ratingKey] = i;
        paint(i);
      }
    });

    container.appendChild(star);
  }

  container.addEventListener("mouseleave", () => paint(ratings[ratingKey]));
  container.addEventListener("focusout", () => paint(ratings[ratingKey]));
  paint(ratings[ratingKey]);
}

function readInputs() {
  const selectedConcern = clean($("treatmentConcern")?.value);
  const customConcern = clean($("customTreatmentConcern")?.value);

  return {
    language: $("language")?.value || "English",
    treatmentConcern: selectedConcern === "Other" ? customConcern : selectedConcern,
    length: $("length")?.value || "Short",
    likedMost: clean($("likedMost")?.value),
    ...ratings
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

function ratingTone(rating) {
  if (rating >= 5) return "highly satisfied";
  if (rating === 4) return "positive with a small suggestion";
  if (rating === 3) return "mixed but fair";
  if (rating === 2) return "dissatisfied but polite";
  return "poor but respectful";
}

function sentenceFor(category, rating) {
  const bank = {
    treatment: {
      5: ["The treatment plan felt thoughtful, clear, and supportive for my concern.", "The consultation and treatment approach felt well planned and reassuring."],
      4: ["The treatment approach was good overall, with clear guidance and steady support.", "The treatment plan was explained well and felt helpful overall."],
      3: ["The treatment experience was acceptable, but I felt there was room for more clarity and follow-up."],
      2: ["The treatment process did not fully meet my expectations and could be explained in a clearer way."],
      1: ["The treatment experience was disappointing for me and needs improvement." ]
    },
    doctor: {
      5: ["The doctor listened patiently, understood the details, and explained everything calmly.", "I appreciated the way the doctor took time to listen and guide me properly."],
      4: ["The doctor listened well and explained the approach clearly.", "The consultation felt comfortable, and the doctor was supportive."],
      3: ["The doctor's approach was satisfactory, though the discussion could have been more detailed."],
      2: ["The consultation could have been better with more time, clearer explanation, and stronger communication."],
      1: ["The consultation experience did not feel satisfactory and communication needs improvement." ]
    },
    clinic: {
      5: ["The clinic was clean, calm, and comfortable.", "The clinic environment felt clean and welcoming."],
      4: ["The clinic was clean and comfortable overall.", "The ambience was good and maintained well."],
      3: ["The clinic environment was manageable, but there is scope to improve cleanliness and comfort."],
      2: ["The cleanliness and ambience did not feel fully satisfactory and could be improved."],
      1: ["The clinic cleanliness and ambience need clear improvement." ]
    },
    staff: {
      5: ["The staff was polite, helpful, and well coordinated.", "The clinic team handled the visit smoothly and respectfully."],
      4: ["The staff was cooperative and helpful overall.", "The clinic team managed the visit well."],
      3: ["Staff behavior was okay, though coordination could be better."],
      2: ["Staff coordination and responsiveness could be improved for a smoother visit."],
      1: ["The staff experience was not satisfactory and needs improvement." ]
    },
    value: {
      5: ["Overall, the consultation felt worth the money.", "The overall value felt fair and satisfying."],
      4: ["The experience felt reasonably priced overall.", "Value for money was good overall."],
      3: ["Value for money felt average and could be better."],
      2: ["The value for money did not feel fully justified to me."],
      1: ["The overall value for money was disappointing." ]
    }
  };
  return pick(bank[category][rating] || bank[category][1]);
}

function concernLine(data) {
  return data.treatmentConcern
    ? `I visited ${CLINIC_NAME} for ${data.treatmentConcern}.`
    : `I visited ${CLINIC_NAME} for a consultation.`;
}

function highlightSentence(data) {
  if (!data.likedMost) return "";
  return pick([`I especially liked ${data.likedMost}.`, `What stood out for me was ${data.likedMost}.`]);
}

function closingSentence(data) {
  const avg = averageRating(data);
  const minRating = Math.min(
    data.treatmentEffectivenessRating,
    data.doctorApproachRating,
    data.clinicAmbienceRating,
    data.staffBehaviorRating,
    data.valueForMoneyRating
  );

  if (avg >= 4.6 && minRating >= 4) {
    return pick([
      "Overall, it was a smooth and reassuring clinic experience.",
      "Overall, I had a positive experience and would recommend the clinic for similar concerns.",
      "Thank you to the doctor and clinic team for the patient and supportive experience."
    ]);
  }

  if (avg >= 3.5) {
    return pick([
      "Overall, it was a good experience with a few small areas that can be improved.",
      "Overall, I had a mostly positive experience and hope the minor improvement areas are considered."
    ]);
  }

  if (avg >= 2.5) {
    return pick([
      "Overall, the experience was mixed, with some good parts and some areas that need improvement.",
      "I appreciate the effort from the clinic team and hope the feedback is taken constructively."
    ]);
  }

  return pick([
    "Overall, my experience was not satisfactory, and I hope the clinic works on these improvement areas.",
    "I am sharing this respectfully so the clinic can improve the experience for future visitors."
  ]);
}

function englishReview(data) {
  const pieces = [
    concernLine(data),
    sentenceFor("treatment", data.treatmentEffectivenessRating),
    sentenceFor("doctor", data.doctorApproachRating),
    sentenceFor("clinic", data.clinicAmbienceRating),
    sentenceFor("staff", data.staffBehaviorRating),
    sentenceFor("value", data.valueForMoneyRating),
    highlightSentence(data),
    closingSentence(data)
  ].filter(Boolean);

  let review;
  if (data.length === "Short") {
    review = [pieces[0], pieces[1], pieces[2], closingSentence(data)].filter(Boolean).join(" ");
  } else if (data.length === "Detailed") {
    review = pieces.join(" ") + " This review is based on my experience with the consultation, clinic environment, staff support, and overall value.";
  } else {
    review = pieces.join(" ");
  }

  return review.replace(/\s+/g, " ").trim();
}

function localReview(data) {
  if (data.language === "English") return englishReview(data);

  const concern = data.treatmentConcern || "consultation";
  const avg = averageRating(data);
  const good = avg >= 4;
  const mixed = avg >= 2.5 && avg < 4;

  if (data.language === "Hindi") {
    return `मैं ${concern} के लिए ${CLINIC_NAME} गया/गई। मेरा overall rating experience ${avg.toFixed(1)}/5 रहा। डॉक्टर की listening ${ratingTone(data.doctorApproachRating)} लगी, treatment experience ${ratingTone(data.treatmentEffectivenessRating)} रहा, clinic cleanliness ${ratingTone(data.clinicAmbienceRating)} लगी, staff behavior ${ratingTone(data.staffBehaviorRating)} रहा, और value for money ${ratingTone(data.valueForMoneyRating)} लगा।${data.likedMost ? ` मुझे खास तौर पर ${data.likedMost} अच्छा लगा।` : ""}${good ? " कुल मिलाकर अनुभव अच्छा रहा।" : mixed ? " कुल मिलाकर अनुभव मिला-जुला रहा और कुछ सुधार की गुंजाइश है।" : " कुल मिलाकर अनुभव संतोषजनक नहीं रहा और सुधार की जरूरत है।"}`;
  }

  if (data.language === "Gujarati") {
    return `હું ${concern} માટે ${CLINIC_NAME} ગયો/ગઈ હતો/હતી. મારો overall rating experience ${avg.toFixed(1)}/5 રહ્યો. Doctor listening ${ratingTone(data.doctorApproachRating)} હતી, treatment experience ${ratingTone(data.treatmentEffectivenessRating)} રહ્યો, clinic cleanliness ${ratingTone(data.clinicAmbienceRating)} હતી, staff behavior ${ratingTone(data.staffBehaviorRating)} રહ્યો, અને value for money ${ratingTone(data.valueForMoneyRating)} લાગ્યું.${data.likedMost ? ` મને ખાસ કરીને ${data.likedMost} ગમ્યું.` : ""}${good ? " કુલ મળીને અનુભવ સારો રહ્યો." : mixed ? " કુલ અનુભવ મિશ્ર રહ્યો અને થોડો સુધારો થઈ શકે છે." : " કુલ અનુભવ સંતોષકારક નહોતો અને સુધારાની જરૂર છે."}`;
  }

  if (data.language === "Marathi") {
    return `मी ${concern} साठी ${CLINIC_NAME} ला भेट दिली. माझा overall rating experience ${avg.toFixed(1)}/5 होता. Doctor listening ${ratingTone(data.doctorApproachRating)} वाटले, treatment experience ${ratingTone(data.treatmentEffectivenessRating)} होता, clinic cleanliness ${ratingTone(data.clinicAmbienceRating)} वाटली, staff behavior ${ratingTone(data.staffBehaviorRating)} होता, आणि value for money ${ratingTone(data.valueForMoneyRating)} वाटले.${data.likedMost ? ` ${data.likedMost} खास आवडले.` : ""}${good ? " एकूण अनुभव चांगला होता." : mixed ? " एकूण अनुभव मिश्र होता आणि काही सुधारणा होऊ शकतात." : " एकूण अनुभव समाधानकारक नव्हता आणि सुधारणा गरजेची आहे."}`;
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

async function callAI(data, instruction = "") {
  const s = settings();
  if (!s.endpoint || !s.key) return null;

  const prompt = `Write one natural first-person Google review for ${CLINIC_NAME}.
Do not say "customer feedback". Do not say "selected ratings". Do not provide medical advice, diagnosis, dosage, cure guarantees, or exaggerated claims.
Use the selected ratings strictly:
5 stars = highly satisfied.
4 stars = positive with minor suggestions.
3 stars = mixed experience.
2 stars = dissatisfied but polite.
1 star = poor experience but respectful.
Do not generate an overly positive review if any category is rated 3 or below.
Make the tone naturally match the exact ratings below.
Treatment/Concern: ${data.treatmentConcern || "not specified"}
Language: ${data.language}
Length: ${data.length}
Treatment effectiveness: ${data.treatmentEffectivenessRating}/5
Doctor approach/listening: ${data.doctorApproachRating}/5
Clinic cleanliness/ambience: ${data.clinicAmbienceRating}/5
Staff behavior: ${data.staffBehaviorRating}/5
Value for money: ${data.valueForMoneyRating}/5
Visitor liked: ${data.likedMost || "not specified"}
Extra instruction: ${instruction || "none"}
Output only the review text.`;

  const response = await fetch(s.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${s.key}`
    },
    body: JSON.stringify({
      model: s.model,
      messages: [
        { role: "system", content: "You write authentic first-person clinic reviews. Match the review tone strictly to the user's category ratings. Avoid medical advice, diagnosis, dosage, cure guarantees, and exaggerated claims." },
        { role: "user", content: prompt }
      ],
      temperature: 0.75,
      presence_penalty: 0.2,
      frequency_penalty: 0.2
    })
  });

  if (!response.ok) throw new Error("AI API error " + response.status);
  const json = await response.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

async function generate(instruction = "", useLast = false) {
  const data = useLast && lastData ? { ...lastData, ...ratings } : readInputs();
  lastData = data;

  let review = null;
  try {
    review = await callAI(data, instruction);
  } catch (error) {
    console.warn(error);
  }

  if (!review) review = localReview(data);
  $("reviewOutput").value = review;
  $("formScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");
}

async function copyReview() {
  const output = $("reviewOutput");
  output.select();
  try {
    await navigator.clipboard.writeText(output.value);
    alert("Review copied successfully!");
  } catch {
    document.execCommand("copy");
    alert("Review copied successfully!");
  }
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
}

function initialisePage() {
  setupConcernDropdown();
  buildStars("treatmentEffectivenessStars", "treatmentEffectivenessRating");
  buildStars("doctorApproachStars", "doctorApproachRating");
  buildStars("clinicAmbienceStars", "clinicAmbienceRating");
  buildStars("staffBehaviorStars", "staffBehaviorRating");
  buildStars("valueForMoneyStars", "valueForMoneyRating");

  $("generateBtn")?.addEventListener("click", () => generate());
  $("freshBtn")?.addEventListener("click", () => generate("", true));
  $("rewriteBtn")?.addEventListener("click", () => generate(clean($("customInstruction")?.value), true));
  $("copyBtn")?.addEventListener("click", copyReview);
  $("googleBtn")?.addEventListener("click", () => window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer"));
  $("againBtn")?.addEventListener("click", () => {
    $("resultScreen").classList.add("hidden");
    $("formScreen").classList.remove("hidden");
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialisePage);
else initialisePage();
