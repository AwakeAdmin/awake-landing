/* Awake landing — waitlist signup */

const AWAKE_BACKEND_URL = "https://YOUR-BACKEND-URL";

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

if (form) {
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
      if (!res.ok) throw new Error("bad");
      const data = await res.json().catch(function(){ return {}; });
      form.reset();
      submitBtn.textContent = "You're on the list";
      formNote.textContent = "We'll email you the moment Awake goes live.";
      showToast("You're on the list. Welcome.");
      if (data && typeof data.count === "number") setCount(data.count);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Join the waitlist";
      showToast("Something went wrong. Please try again.", true);
    }
  });
}

function setCount(n) {
  if (typeof n !== "number" || n < 1 || !countEl) return;
  countEl.textContent = n.toLocaleString() + " independent thinker" + (n === 1 ? "" : "s");
}

/* Hero video crossfade — simple and safe */
(function () {
  var vids = document.querySelectorAll(".hero-vid");
  if (vids.length < 2) return;
  var i = 0;
  vids[0].play().catch(function () {});
  document.addEventListener("touchstart", function () {
    for (var j = 0; j < vids.length; j++) vids[j].play().catch(function () {});
  }, { once: true, passive: true });
  setInterval(function () {
    vids[i].classList.remove("active");
    i = (i + 1) % vids.length;
    try { vids[i].currentTime = 0; vids[i].play().catch(function () {}); } catch (e) {}
    vids[i].classList.add("active");
  }, 8000);
})();
