/* FIELDNOTES interactions: mobile navigation, proposal cards, cycle explorer, checklist */
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Expandable proposal cards
  document.querySelectorAll(".proposal-card").forEach(card => {
    card.addEventListener("click", () => {
      const willOpen = card.getAttribute("aria-expanded") !== "true";
      card.setAttribute("aria-expanded", String(willOpen));
      const label = card.querySelector(".expand-label");
      if (label) label.textContent = willOpen ? "Hide details −" : "View details +";
    });
  });

  // Interactive action research cycle
  const cycleStages = {
    plan: {
      number: "01",
      kicker: "STAGE 01 / SET THE DIRECTION",
      title: "Planning &<br>problem definition",
      text: "The researcher identifies the classroom issue, sets the objectives, and decides what evidence would help answer the research question.",
      connectionTitle: "Defines what observation should look for",
      connectionText: "The plan sets the focus and indicators that will guide data collection during the intervention."
    },
    act: {
      number: "02",
      kicker: "STAGE 02 / PUT THE PLAN INTO ACTION",
      title: "Action &<br>intervention",
      text: "The planned teaching strategy is introduced. In this study, the intervention uses Socratic questioning, scaffolded drafts, and feedback to support critical thinking.",
      connectionTitle: "Creates the learning experience to observe",
      connectionText: "The researcher records how students respond while the intervention is being implemented."
    },
    observe: {
      number: "03",
      kicker: "STAGE 03 / SELECTED STAGE",
      title: "Observation &<br>data collection",
      text: "The researcher records what students do, say, and produce while the intervention is taking place. This creates evidence for reflection instead of relying on impressions alone.",
      connectionTitle: "Connects action to reflection",
      connectionText: "It captures the effects of the intervention and provides material to interpret during reflection."
    },
    reflect: {
      number: "04",
      kicker: "STAGE 04 / INTERPRET THE EVIDENCE",
      title: "Reflection &<br>evaluation",
      text: "The researcher reviews and interprets the evidence, considers what has changed, and identifies the strengths and limitations of the intervention.",
      connectionTitle: "Feeds the next planning stage",
      connectionText: "Reflection informs whether to continue, adapt, or replace a strategy before beginning another cycle."
    }
  };
  const cycleOrder = ["plan", "act", "observe", "reflect"];
  let currentCycle = "observe";
  const detailFields = {
    number: document.getElementById("cycleDetailNumber"),
    kicker: document.getElementById("cycleDetailKicker"),
    title: document.getElementById("cycleDetailTitle"),
    text: document.getElementById("cycleDetailText"),
    connectionTitle: document.getElementById("cycleConnectionTitle"),
    connectionText: document.getElementById("cycleConnectionText")
  };
  function showCycleStage(stageName) {
    const stage = cycleStages[stageName];
    if (!stage) return;
    currentCycle = stageName;
    document.querySelectorAll(".cycle-node").forEach(node => {
      const selected = node.dataset.cycle === stageName;
      node.classList.toggle("is-selected", selected);
      node.setAttribute("aria-pressed", String(selected));
    });
    if (detailFields.number) detailFields.number.textContent = stage.number;
    if (detailFields.kicker) detailFields.kicker.textContent = stage.kicker;
    if (detailFields.title) detailFields.title.innerHTML = stage.title;
    if (detailFields.text) detailFields.text.textContent = stage.text;
    if (detailFields.connectionTitle) detailFields.connectionTitle.textContent = stage.connectionTitle;
    if (detailFields.connectionText) detailFields.connectionText.textContent = stage.connectionText;
  }
  document.querySelectorAll(".cycle-node").forEach(node => {
    node.addEventListener("click", () => showCycleStage(node.dataset.cycle));
  });
  const previousButton = document.getElementById("cyclePrev");
  const nextButton = document.getElementById("cycleNext");
  if (previousButton) previousButton.addEventListener("click", () => {
    const index = cycleOrder.indexOf(currentCycle);
    showCycleStage(cycleOrder[(index - 1 + cycleOrder.length) % cycleOrder.length]);
  });
  if (nextButton) nextButton.addEventListener("click", () => {
    const index = cycleOrder.indexOf(currentCycle);
    showCycleStage(cycleOrder[(index + 1) % cycleOrder.length]);
  });

  // Fieldwork checklist progress
  const checks = Array.from(document.querySelectorAll(".process-check"));
  const progressText = document.getElementById("checkProgress");
  const progressFill = document.getElementById("progressFill");
  const progressMessage = document.getElementById("progressMessage");
  const resetButton = document.getElementById("resetChecklist");
  function updateProgress() {
    if (!checks.length) return;
    const completed = checks.filter(check => check.checked).length;
    if (progressText) progressText.textContent = `${completed} / ${checks.length}`;
    if (progressFill) progressFill.style.width = `${(completed / checks.length) * 100}%`;
    if (progressMessage) {
      progressMessage.textContent = completed === checks.length
        ? "All steps checked. You are ready to organise and review the evidence."
        : completed === 0
          ? "Check off each step as it is completed."
          : `${checks.length - completed} step${checks.length - completed === 1 ? "" : "s"} remaining. Keep the process consistent.`;
    }
  }
  checks.forEach(check => check.addEventListener("change", updateProgress));
  if (resetButton) resetButton.addEventListener("click", () => {
    checks.forEach(check => { check.checked = false; });
    updateProgress();
  });
  updateProgress();
});
