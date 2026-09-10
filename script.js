/* Awake landing — waitlist signup */

/**
 * CONFIG — EDIT THIS ONE LINE LATER
 *
 * Once you deploy the Awake app inside Emergent, you'll get a live backend URL.
 * Come back to this file, replace "https://YOUR-BACKEND-URL" with that URL,
 * and the waitlist form will start saving emails into your app.
 *
 * Example: "https://api.awakedating.app"
 */
const AWAKE_BACKEND_URL = "https://YOUR-BACKEND-URL";

/* ---------- Form handling ---------- */
const form = document.getElementById("waitlist");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submit-btn");
const formNote = document.getElementById("form-note");
const countEl = document.getElementById("count");
const toast = document.getElementById("toast");

function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3800);
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!validEmail(email)) {
    showToast("Please enter a valid email address.", true);
    emailInput.focus();
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Joining…";
  try {
    const res = await fetch(`${AWAKE_BACKEND_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
    const data = await res.json().catch(() => ({}));
    form.reset();
    submitBtn.textContent = "You're on the list ✓";
    formNote.textContent = "We'll email you the moment Awake goes live.";
    showToast("You're on the list. Welcome.");
    if (typeof data.count === "number") setCount(data.count);
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Join the waitlist";
    console.error(err);
    showToast("Something went wrong. Please try again.", true);
  }
});

function setCount(n) {
  if (typeof n !== "number" || n < 1) return;
  countEl.textContent = `${n.toLocaleString()} independent thinker${n === 1 ? "" : "s"}`;
}

// Fetch current waitlist count (optional, silently fails if backend not deployed yet)
(async () => {
  try {
    const res = await fetch(`${AWAKE_BACKEND_URL}/api/waitlist/count`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data.count === "number") setCount(data.count);
  } catch {
    /* backend not deployed yet — that's fine */
  }
})();
/* Hero video collage cycle */
(function cycleHeroVideos(){
  const vids = document.querySelectorAll('.hero-vid');
  if (vids.length < 2) return;
  vids.forEach(v => { v.addEventListener('loadeddata', () => { if (v.classList.contains('active')) v.play().catch(()=>{}); }); });
  let i = 0;
  setInterval(() => {
    vids[i].classList.remove('active');
    i = (i + 1) % vids.length;
    const next = vids[i];
    next.classList.add('active');
    try { next.currentTime = 0; next.play().catch(()=>{}); } catch(e){}
  }, 8000);
})();
