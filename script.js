/* Awake landing — waitlist signup */

/**
 * CONFIG — EDIT THIS ONE LINE BEFORE YOU DEPLOY
 * Point it at your live Awake backend once you have deployed it.
 * The backend must expose POST /api/waitlist { email }.
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

function showToast(msg, isError) {
  toast.textContent = msg;
  toast.classList.toggle("error", !!isError);
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ toast.classList.remove("show"); }, 3800);
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!validEmail(email)) {
    showToast("Please enter a valid email address.", true);
    emailInput.focus();
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Joining...";
  try {
    const res = await fetch(AWAKE_BACKEND_URL + "/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    });
    if (!res.ok) {
      const text = await res.text().catch(function(){ return ""; });
      throw new Error(text || "Request failed (" + res.status + ")");
    }
    const data = await res.json().catch(function(){ return {}; });
    form.reset();
    submitBtn.textContent = "You're on the list";
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
  countEl.textContent = n.toLocaleString() + " independent thinker" + (n === 1 ? "" : "s");
}

(async function(){
  try {
    const res = await fetch(AWAKE_BACKEND_URL + "/api/waitlist/count");
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data.count === "number") setCount(data.count);
  } catch (_) {}
})();

/* ---------- Hero video collage — overlap crossfade ---------- */
(function cycleHeroVideos(){
  const vids = document.querySelectorAll('.hero-vid');
  if (vids.length < 2) return;
  const FADE_MS = 1600;
  let i = 0;
  let z = 1;
  setInterval(function(){
    const next = (i + 1) % vids.length;
    vids[next].style.zIndex = ++z;
    try { vids[next].currentTime = 0; vids[next].play().catch(function(){}); } catch(e){}
    vids[next].classList.add('active');
    setTimeout(function(){
      vids[i].classList.remove('active');
      i = next;
    }, FADE_MS);
  }, 8000);
})();
