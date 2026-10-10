const demoProfiles = [
  {id:"demo-1",name:"Aarav",ageGroup:"16–17",education:"Class 11–12",category:"Technology",skills:"Web development, problem solving",bio:"Learning how to build useful digital tools and turning small experiments into real projects.",ideaTitle:"Study Buddy",ideaDescription:"A simple study planner that helps students break large topics into manageable tasks.",stage:"Building",demo:true},
  {id:"demo-2",name:"Riya",ageGroup:"13–15",education:"Class 9–10",category:"Environment",skills:"Research, writing, design",bio:"Interested in sustainability and finding practical ways to make everyday habits greener.",ideaTitle:"Green School",ideaDescription:"A student-led idea for tracking classroom recycling and encouraging less waste.",stage:"Researching",demo:true},
  {id:"demo-3",name:"Kabir",ageGroup:"16–17",education:"Class 11–12",category:"Business",skills:"Business research, communication",bio:"Exploring how small businesses can use simple technology to serve customers better.",ideaTitle:"LocalLift",ideaDescription:"A concept for helping local shops present their products and services online.",stage:"Just an idea",demo:true},
  {id:"demo-4",name:"Siya",ageGroup:"13–15",education:"Class 9–10",category:"Design",skills:"Illustration, UI ideas",bio:"I like visual storytelling and designing digital experiences that feel clear and friendly.",ideaTitle:"ClearClass",ideaDescription:"A visual learning-notes concept that makes complicated topics easier to review.",stage:"Just an idea",demo:true},
  {id:"demo-5",name:"Dev",ageGroup:"18+",education:"Self-learning",category:"Education",skills:"Teaching, content planning",bio:"Interested in making beginner-friendly learning resources for people starting from zero.",ideaTitle:"First Step Library",ideaDescription:"A curated collection of beginner roadmaps for learning useful skills without getting overwhelmed.",stage:"Launched",demo:true},
  {id:"demo-6",name:"Mira",ageGroup:"16–17",education:"Class 11–12",category:"Other",skills:"Research, storytelling",bio:"Curious about people, communities, and small ideas that can improve daily life.",ideaTitle:"Idea Journal",ideaDescription:"A guided journal that helps young creators test an idea by asking better questions.",stage:"Building",demo:true}
];

const grid = document.getElementById("profileGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stageFilter = document.getElementById("stageFilter");
const dialog = document.getElementById("profileDialog");
const form = document.getElementById("profileForm");
const toast = document.getElementById("toast");
const formMessage = document.getElementById("formMessage");

let sharedProfiles = [];
let backendReady = false;
let supabaseClient = null;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[character]));
}

function initials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0, 2)
    .map(part => part[0] || "").join("").toUpperCase();
}

function profileCard(profile) {
  const skills = String(profile.skills || "").split(",")
    .map(item => item.trim()).filter(Boolean).slice(0, 4);
  const tags = [profile.category, ...skills].filter(Boolean);
  return `
    <article class="profile-card">
      <div class="profile-top">
        <div class="avatar" aria-hidden="true">${escapeHTML(initials(profile.name))}</div>
        <div><p class="profile-name">${escapeHTML(profile.name)}</p>
          <div class="profile-meta">${escapeHTML(profile.education)} · ${escapeHTML(profile.ageGroup)}</div>
        </div>
        ${profile.demo ? '<span class="demo-tag">EXAMPLE</span>' : '<span class="demo-tag">COMMUNITY</span>'}
      </div>
      <h3>${escapeHTML(profile.ideaTitle)}</h3>
      <p class="bio">${escapeHTML(profile.ideaDescription || profile.bio)}</p>
      <div class="tag-row">${tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
      <div class="card-footer"><span>${escapeHTML(profile.category)}</span><span class="stage-label">${escapeHTML(profile.stage)}</span></div>
    </article>`;
}

function renderProfiles() {
  const profiles = [...sharedProfiles, ...demoProfiles];
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const stage = stageFilter.value;
  const filtered = profiles.filter(profile => {
    const searchable = [profile.name, profile.education, profile.skills, profile.bio,
      profile.ideaTitle, profile.ideaDescription, profile.category, profile.stage]
      .join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (category === "all" || profile.category === category) &&
      (stage === "all" || profile.stage === stage);
  });
  grid.innerHTML = filtered.map(profileCard).join("");
  emptyState.hidden = filtered.length !== 0;
}

function openDialog() {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  document.body.style.overflow = "hidden";
}
function closeDialog() {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  document.body.style.overflow = "";
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    ageGroup: row.age_group,
    education: row.education,
    category: row.category,
    skills: row.skills || "",
    bio: row.bio || "",
    ideaTitle: row.idea_title,
    ideaDescription: row.idea_description,
    stage: row.stage,
    demo: false
  };
}

async function loadSharedProfiles() {
  if (!backendReady) {
    renderProfiles();
    return;
  }
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id,name,age_group,education,category,skills,bio,idea_title,idea_description,stage,created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("UNSEEN profile load failed:", error);
    showToast("Could not load shared profiles. Check Supabase setup.");
    renderProfiles();
    return;
  }
  sharedProfiles = (data || []).map(mapRow);
  renderProfiles();
}

document.querySelectorAll("[data-open-profile]").forEach(button => button.addEventListener("click", openDialog));
document.getElementById("closeDialog").addEventListener("click", closeDialog);
document.getElementById("cancelDialog").addEventListener("click", closeDialog);
dialog.addEventListener("click", event => {
  if (event.target === dialog) closeDialog();
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(form);
  if (!formData.get("consent")) {
    formMessage.textContent = "Please confirm that you understand the public profile visibility.";
    return;
  }
  if (!backendReady) {
    formMessage.textContent = "Shared database is not configured yet. Add your Supabase URL and publishable key.";
    return;
  }

  const profile = {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : undefined,
    name: String(formData.get("name") || "").trim(),
    age_group: String(formData.get("ageGroup") || ""),
    education: String(formData.get("education") || ""),
    category: String(formData.get("category") || ""),
    skills: String(formData.get("skills") || "").trim(),
    bio: String(formData.get("bio") || "").trim(),
    idea_title: String(formData.get("ideaTitle") || "").trim(),
    idea_description: String(formData.get("ideaDescription") || "").trim(),
    stage: String(formData.get("stage") || ""),
    is_public: true
  };

  if (!profile.name || !profile.bio || !profile.idea_title || !profile.idea_description) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Saving...";
  formMessage.textContent = "";

  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      .insert(profile)
      .select("id,name,age_group,education,category,skills,bio,idea_title,idea_description,stage,created_at")
      .single();

    if (error) throw error;
    sharedProfiles.unshift(mapRow(data));
    form.reset();
    closeDialog();
    renderProfiles();
    showToast("Profile shared with the UNSEEN community!");
    document.getElementById("discover").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("UNSEEN profile save failed:", error);
    formMessage.textContent = error.message || "Could not save profile. Check your Supabase table and policies.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Save profile <span>↗</span>';
  }
});

[searchInput, categoryFilter, stageFilter].forEach(control => control.addEventListener("input", renderProfiles));
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

(function initSupabase() {
  const url = window.UNSEEN_SUPABASE_URL;
  const key = window.UNSEEN_SUPABASE_KEY;
  if (window.supabase && url && key &&
      !url.includes("PASTE_YOUR_") && !key.includes("PASTE_YOUR_")) {
    supabaseClient = window.supabase.createClient(url, key);
    backendReady = true;
    loadSharedProfiles();
  } else {
    console.warn("UNSEEN shared database is not configured. Set URL and publishable key in supabase-config.js.");
    renderProfiles();
  }
})();
