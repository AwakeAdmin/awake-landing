/* Awake landing — waitlist signup */
document.addEventListener("DOMContentLoaded", () => { const e = document.getElementById("email"); if (e) e.setAttribute("placeholder", "you@email.com"); });

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
    const formData = new URLSearchParams();
    formData.append("form-name", "awake-waitlist");
    formData.append("email", email);
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
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
/* ---------- Hero video collage — overlap crossfade (no dark peek) ---------- */
(function cycleHeroVideos(){
  const vids = document.querySelectorAll('.hero-vid');
  if (vids.length < 2) return;
  const FADE_MS = 1600;
  let i = 0;
  let z = 1;
  setInterval(() => {
    const next = (i + 1) % vids.length;
    // Layer incoming on top of everything, then fade it in
    vids[next].style.zIndex = ++z;
    try { vids[next].currentTime = 0; vids[next].play().catch(()=>{}); } catch(e){}
    vids[next].classList.add('active');
    // Once new one is fully visible, drop the old one
    setTimeout(() => {
      vids[i].classList.remove('active');
      i = next;
    }, FADE_MS);
  }, 8000);
})();
