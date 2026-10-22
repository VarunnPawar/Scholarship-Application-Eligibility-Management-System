// ---- Data (mirrors the sample rows in the SQL script) ----
const D = {
  students: [
    [1, "Rahul Sharma", "rahul@gmail.com", "BTech CSE", 2, 180000, "OBC", 8.2],
    [2, "Priya Verma", "priya@gmail.com", "BTech AI ML", 1, 120000, "SC", 9.1],
    [3, "Aman Singh", "aman@gmail.com", "BTech CSE", 3, 350000, "General", 7.5],
    [4, "Neha Gupta", "neha@gmail.com", "BTech IT", 2, 200000, "EWS", 8.7],
  ].map((r) => ({
    id: r[0],
    name: r[1],
    email: r[2],
    course: r[3],
    year: r[4],
    income: r[5],
    cat: r[6],
    cgpa: r[7],
  })),
  schol: [
    [1, "Merit Scholarship", 8.0, 300000, "All", 25000, "2026-12-31"],
    [2, "Need Based Scholarship", 7.0, 200000, "All", 20000, "2026-11-30"],
    [3, "OBC Scholarship", 6.0, 250000, "OBC", 15000, "2026-12-15"],
    [4, "SC Scholarship", 6.0, 250000, "SC", 18000, "2026-12-20"],
  ].map((r) => ({
    id: r[0],
    name: r[1],
    minCgpa: r[2],
    maxIncome: r[3],
    cat: r[4],
    amount: r[5],
    deadline: r[6],
  })),
  apps: [
    [1, 1, 1, "Approved", "Eligible for scholarship"],
    [2, 1, 3, "Pending", "Application submitted"],
    [3, 2, 1, "Pending", "Application submitted"],
    [4, 2, 4, "Pending", "Application submitted"],
    [5, 3, 1, "Rejected", "Does not meet criteria"],
    [6, 4, 2, "Pending", "Application submitted"],
  ].map((r) => ({
    id: r[0],
    sid: r[1],
    schid: r[2],
    status: r[3],
    remarks: r[4],
    date: "2026-10-22",
  })),
};
const ST = (id) => D.students.find((s) => s.id == id),
  SC = (id) => D.schol.find((s) => s.id == id);
const nextId = (a) => Math.max(0, ...a.map((x) => x.id)) + 1;
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0, 10);
const chip = (s) => `<span class="chip ${s}">${s}</span>`;
function toast(m) {
  const t = document.getElementById("toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}

// Eligibility rule, same as query 11 in the SQL script
function check(s, sc) {
  const why = [];
  if (s.cgpa < sc.minCgpa)
    why.push(
      `CGPA ${s.cgpa.toFixed(2)} is below the minimum ${sc.minCgpa.toFixed(2)}`,
    );
  if (s.income > sc.maxIncome)
    why.push(
      `Family income ${inr(s.income)} is above the limit ${inr(sc.maxIncome)}`,
    );
  if (sc.cat != "All" && s.cat != sc.cat)
    why.push(`Only for ${sc.cat} category`);
  if (sc.deadline && sc.deadline < today())
    why.push(`Deadline passed on ${sc.deadline}`);
  return why;
}

// ---- Dialog form helper ----
function form(title, fields, submit, label = "Save") {
  const f = document.getElementById("frm"),
    d = document.getElementById("dlg");
  f.innerHTML =
    `<h3>${title}</h3>` +
    fields
      .map(
        (x) =>
          `<label>${x.label}${x.options ? `<select name="${x.name}">${x.options.map((o) => `<option value="${esc(o[0])}" ${o[0] == x.val ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select>` : `<input name="${x.name}" type="${x.type || "text"}" ${x.req ? "required" : ""} ${x.attr || ""} value="${esc(x.val ?? "")}">`}</label>`,
      )
      .join("") +
    `<div class="err" id="err"></div><div class="acts"><button type="button" class="btn ghost" id="cx">Cancel</button><button class="btn">${label}</button></div>`;
  f.onsubmit = (e) => {
    e.preventDefault();
    const m = submit(Object.fromEntries(new FormData(f)));
    if (m) {
      document.getElementById("err").textContent = m;
      return;
    }
    d.close();
    render();
  };
  document.getElementById("cx").onclick = () => d.close();
  d.showModal();
}

const head = (t, p, x = "") =>
  `<div class="head"><div><h2>${t}</h2><p>${p}</p></div>${x}</div>`;
const ui = { view: "dashboard", sid: 1, q: "", st: "" };

// ---- Views ----
const views = {
  dashboard() {
    const cnt = (s) => D.apps.filter((a) => a.status == s).length;
    const approved = D.apps
      .filter((a) => a.status == "Approved")
      .reduce((t, a) => t + SC(a.schid).amount, 0);
    const avg = D.students.length
      ? (
          D.students.reduce((t, s) => t + s.cgpa, 0) / D.students.length
        ).toFixed(2)
      : "–";
    const notApplied = D.students.filter(
      (s) => !D.apps.some((a) => a.sid == s.id),
    );
    const st = [
      [D.students.length, "Students"],
      [avg, "Average CGPA"],
      [cnt("Pending"), "Pending"],
      [cnt("Approved"), "Approved"],
      [cnt("Rejected"), "Rejected"],
    ];
    return (
      head("Overview", "Where every application stands right now.") +
      `<div class="stats">${st.map((s) => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("")}<div class="stat hi"><b>${inr(approved)}</b><span>Total approved amount</span></div></div>
 <div class="cols"><div class="panel"><h3>Applications per scholarship</h3>${D.schol.map((sc) => `<div class="line"><span>${esc(sc.name)}</span><b>${D.apps.filter((a) => a.schid == sc.id).length}</b></div>`).join("")}</div>
 <div class="panel"><h3>Students who have not applied</h3>${notApplied.length ? notApplied.map((s) => `<div class="line"><span>${esc(s.name)}</span><button class="btn ghost sm" onclick="ui.sid=${s.id};go('eligibility')">Check eligibility</button></div>`).join("") : "<p>Every student has applied for at least one scholarship.</p>"}</div></div>`
    );
  },
  eligibility() {
    const s = ST(ui.sid);
    if (!s)
      return (
        head(
          "Eligibility",
          "Pick a student to see which scholarships they qualify for.",
        ) + '<div class="empty">No students yet. Add a student first.</div>'
      );
    const res = D.schol.map((sc) => ({
      sc,
      why: check(s, sc),
      app: D.apps.find((a) => a.sid == s.id && a.schid == sc.id),
    }));
    const ok = res.filter((r) => !r.why.length);
    return (
      head(
        "Eligibility check",
        "See which scholarships a student qualifies for, and why not.",
      ) +
      `<div class="tools"><select id="pick" onchange="ui.sid=+this.value;render()">${D.students.map((x) => `<option value="${x.id}" ${x.id == s.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select><span>${esc(s.course)}, year ${s.year} · CGPA ${s.cgpa.toFixed(2)} · income ${inr(s.income)} · ${esc(s.cat)}</span></div>
 <div class="summary"><b>${esc(s.name)}</b> qualifies for <b>${ok.length}</b> of ${res.length} scholarships, worth up to <b>${inr(ok.reduce((t, r) => t + r.sc.amount, 0))}</b>.</div>
 <div class="grid">${res
   .map(
     (
       r,
     ) => `<div class="card ${r.why.length ? "no" : "ok"}"><div class="top"><h3>${esc(r.sc.name)}</h3><span class="amt">${inr(r.sc.amount)}</span></div>
 <p>Needs CGPA ${r.sc.minCgpa.toFixed(2)}+ and income up to ${inr(r.sc.maxIncome)} · ${esc(r.sc.cat)} · due ${r.sc.deadline || "open"}</p>
 ${r.why.length ? `<ul>${r.why.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
 <div class="bottom">${r.why.length ? '<span class="chip no">Not eligible</span>' : '<span class="chip ok">Eligible</span>'}${r.app ? chip(r.app.status) + "<small>Already applied</small>" : r.why.length ? "" : `<button class="btn sm" onclick="apply(${s.id},${r.sc.id})">Apply now</button>`}</div></div>`,
   )
   .join("")}</div>`
    );
  },
  students() {
    const q = ui.q.toLowerCase(),
      rows = D.students.filter((s) => s.name.toLowerCase().includes(q));
    return (
      head(
        "Students",
        "Everyone registered for scholarships.",
        '<button class="btn" onclick="addStudent()">Add student</button>',
      ) +
      `<div class="tools"><input placeholder="Search by name" value="${esc(ui.q)}" oninput="ui.q=this.value;render(1)"></div>` +
      (rows.length
        ? `<div class="wrap"><table><tr><th>Name</th><th>Course</th><th>Year</th><th>CGPA</th><th>Family income</th><th>Category</th><th></th></tr>${rows.map((s) => `<tr><td>${esc(s.name)}<br><small>${esc(s.email)}</small></td><td>${esc(s.course)}</td><td>${s.year}</td><td>${s.cgpa.toFixed(2)}</td><td>${inr(s.income)}</td><td>${esc(s.cat)}</td><td><button class="btn ghost sm" onclick="ui.sid=${s.id};go('eligibility')">Check eligibility</button></td></tr>`).join("")}</table></div>`
        : '<div class="empty">No students match that name.</div>')
    );
  },
  scholarships() {
    const rows = [...D.schol].sort((a, b) => b.amount - a.amount);
    return (
      head(
        "Scholarships",
        "Sorted by amount, highest first.",
        '<button class="btn" onclick="addSchol()">Add scholarship</button>',
      ) +
      `<div class="grid">${rows.map((sc) => `<div class="card no"><div class="top"><h3>${esc(sc.name)}</h3><span class="amt">${inr(sc.amount)}</span></div><p>Minimum CGPA ${sc.minCgpa.toFixed(2)} · income up to ${inr(sc.maxIncome)}</p><p>Category: ${esc(sc.cat)}</p><div class="bottom"><span class="chip ${sc.deadline && sc.deadline < today() ? "no" : ""}">${sc.deadline ? (sc.deadline < today() ? "Closed " : "Due ") + sc.deadline : "No deadline"}</span><small>${D.apps.filter((a) => a.schid == sc.id).length} applications</small></div></div>`).join("")}</div>`
    );
  },
  applications() {
    const rows = D.apps.filter((a) => !ui.st || a.status == ui.st);
    return (
      head(
        "Applications",
        "Review, approve or reject what students submitted.",
      ) +
      `<div class="tools">${["", "Pending", "Approved", "Rejected"].map((s) => `<button class="btn sm ${ui.st == s ? "" : "ghost"}" onclick="ui.st='${s}';render()">${s || "All"}</button>`).join("")}</div>` +
      (rows.length
        ? `<div class="wrap"><table><tr><th>Student</th><th>Scholarship</th><th>Applied</th><th>Status</th><th>Remarks</th><th></th></tr>${rows.map((a) => `<tr><td>${esc(ST(a.sid).name)}</td><td>${esc(SC(a.schid).name)}<br><small>${inr(SC(a.schid).amount)}</small></td><td>${a.date}</td><td>${chip(a.status)}</td><td>${esc(a.remarks)}</td><td><div class="acts">${a.status == "Pending" ? `<button class="btn sm" onclick="setApp(${a.id},'Approved','Eligible for scholarship')">Approve</button><button class="btn ghost sm" onclick="setApp(${a.id},'Rejected','Does not meet criteria')">Reject</button>` : ""}<button class="btn ghost sm danger" onclick="delApp(${a.id})">Delete</button></div></td></tr>`).join("")}</table></div>`
        : '<div class="empty">No applications with this status.</div>')
    );
  },
};
const titles = {
  dashboard: "Overview",
  eligibility: "Eligibility",
  students: "Students",
  scholarships: "Scholarships",
  applications: "Applications",
};
function go(v) {
  ui.view = v;
  if (v != "students") ui.q = "";
  ui.st = "";
  render();
}
function render(keepFocus) {
  document.getElementById("nav").innerHTML = Object.keys(titles)
    .map(
      (k) =>
        `<button ${k == ui.view ? 'aria-current="page"' : ""} onclick="go('${k}')">${titles[k]}</button>`,
    )
    .join("");
  const pos = keepFocus ? document.activeElement.selectionStart : 0;
  document.getElementById("main").innerHTML = views[ui.view]();
  if (keepFocus) {
    const i = document.querySelector(".tools input");
    if (i) {
      i.focus();
      i.setSelectionRange(pos, pos);
    }
  }
}

// ---- Actions ----
function apply(sid, schid) {
  if (D.apps.some((a) => a.sid == sid && a.schid == schid)) {
    toast("Already applied");
    return;
  }
  D.apps.push({
    id: nextId(D.apps),
    sid,
    schid,
    status: "Pending",
    remarks: "Application submitted",
    date: today(),
  });
  toast("Application submitted");
  render();
}
function setApp(id, status, remarks) {
  const a = D.apps.find((x) => x.id == id);
  a.status = status;
  a.remarks = remarks;
  toast("Application " + status.toLowerCase());
  render();
}
function delApp(id) {
  if (confirm("Delete this application?")) {
    D.apps = D.apps.filter((a) => a.id != id);
    toast("Application deleted");
    render();
  }
}
function addStudent() {
  form(
    "Add student",
    [
      { name: "name", label: "Full name", req: 1 },
      { name: "email", label: "Email", type: "email", req: 1 },
      { name: "course", label: "Course", req: 1 },
      {
        name: "year",
        label: "Year of study",
        type: "number",
        req: 1,
        val: 1,
        attr: 'min="1" max="6"',
      },
      {
        name: "income",
        label: "Family income (₹ per year)",
        type: "number",
        req: 1,
        attr: 'min="0"',
      },
      {
        name: "cat",
        label: "Category",
        options: ["General", "OBC", "SC", "ST", "EWS"].map((x) => [x, x]),
      },
      {
        name: "cgpa",
        label: "CGPA (0 to 10)",
        type: "number",
        req: 1,
        attr: 'min="0" max="10" step="0.01"',
      },
    ],
    (v) => {
      if (
        D.students.some((s) => s.email.toLowerCase() == v.email.toLowerCase())
      )
        return "That email is already registered.";
      D.students.push({
        id: nextId(D.students),
        name: v.name,
        email: v.email,
        course: v.course,
        year: +v.year,
        income: +v.income,
        cat: v.cat,
        cgpa: +v.cgpa,
      });
      toast("Student added");
    },
  );
}
function addSchol() {
  form(
    "Add scholarship",
    [
      { name: "name", label: "Scholarship name", req: 1 },
      {
        name: "minCgpa",
        label: "Minimum CGPA",
        type: "number",
        req: 1,
        attr: 'min="0" max="10" step="0.01"',
      },
      {
        name: "maxIncome",
        label: "Maximum family income (₹)",
        type: "number",
        req: 1,
        attr: 'min="0"',
      },
      {
        name: "cat",
        label: "Eligible category",
        options: ["All", "General", "OBC", "SC", "ST", "EWS"].map((x) => [
          x,
          x,
        ]),
      },
      {
        name: "amount",
        label: "Amount (₹)",
        type: "number",
        req: 1,
        attr: 'min="1"',
      },
      { name: "deadline", label: "Deadline", type: "date" },
    ],
    (v) => {
      D.schol.push({
        id: nextId(D.schol),
        name: v.name,
        minCgpa: +v.minCgpa,
        maxIncome: +v.maxIncome,
        cat: v.cat,
        amount: +v.amount,
        deadline: v.deadline || null,
      });
      toast("Scholarship added");
    },
  );
}
render();
