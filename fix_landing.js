const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Re-apply the pure white professional background colors
html = html.replace('--cream:#F6F2E7;', '--cream:#F8FAFC;');
html = html.replace('--paper:#FFFDF8;', '--paper:#FFFFFF;');

// 2. Restore the full Landing() function with Flow and Roles
const oldLandingStart = html.indexOf('function Landing(){');
const oldLandingEnd = html.indexOf('function Auth(){'); // The function right after Landing()

const fullLanding = `function Landing(){
  const wrap = el("div");

  const hero = el("div","hero");
  hero.innerHTML = \`
    <div class="eyebrow">🌿 Community-powered cleanliness</div>
    <h1>See waste. <em>Report it.</em><br/>Watch it disappear.</h1>
    <p>SWM connects citizens, municipal admins and cleanup workers on one bridge — so a photo of an overflowing bin turns into a resolved street, with proof.</p>
  \`;
  const cta = el("div","hero-cta");
  const b1 = el("button","btn-primary"); b1.textContent="Report waste now"; b1.onclick=()=>{state.authRole="citizen";state.authAction="signup";nav("auth");};
  const b2 = el("button","btn-secondary"); b2.textContent="Login to dashboard"; b2.onclick=()=>nav("auth");
  cta.appendChild(b1); cta.appendChild(b2);
  hero.appendChild(cta);
  wrap.appendChild(hero);

  const flow = el("div","flow");
  flow.innerHTML = \`<h2>How it works</h2><div class="sub">One complaint, six honest steps, zero guesswork.</div>\`;
  const track = el("div","flow-track");
  const steps = [
    ["Spot it","Citizen sees garbage or a mess nearby."],
    ["Report it","Photo + location + description submitted."],
    ["Reviewed","Admin checks the complaint and assigns a worker."],
    ["Cleaned","Worker visits the spot and clears it."],
    ["Verified","Admin checks the after-photo and confirms."],
    ["Resolved","Citizen sees the before/after result."],
  ];
  steps.forEach((s,i)=>{
    const st = el("div","flow-step");
    st.innerHTML = \`<div class="flow-num">\${i+1}</div><span class="flabel">\${s[0]}</span><p>\${s[1]}</p>\`;
    track.appendChild(st);
  });
  flow.appendChild(track);
  wrap.appendChild(flow);

  const roles = el("div","roles");
  const rdata = [
    ["🧍","Citizen","Report waste in seconds, track every complaint's status, and see the before/after proof once it's cleaned."],
    ["🛡️","Admin","Review incoming reports, assign the right worker, verify completed cleanups and watch city-wide stats."],
    ["🧹","Worker","See only what's assigned to you, mark work in progress, and close it out with an after photo."],
  ];
  rdata.forEach(r=>{
    const c = el("div","role-card");
    c.innerHTML = \`<div class="ricon">\${r[0]}</div><h3>\${r[1]}</h3><p>\${r[2]}</p>\`;
    roles.appendChild(c);
  });
  wrap.appendChild(roles);

  return wrap;
}

`;

html = html.substring(0, oldLandingStart) + fullLanding + html.substring(oldLandingEnd);
fs.writeFileSync(file, html);
console.log('Restored Landing page sections and professional white theme!');
