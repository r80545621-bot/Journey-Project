
const quests = [
    {
      id: 1,
      title: "تعلّمي ٥ كلمات جديدة",
      description: "تعلّمي خمس كلمات إنجليزية واستخدميها في جمل.",
      category: "Learning",
      icon: "📚",
      xp: 15
    },
    {
      id: 2,
      title: "ابني شيئًا جديدًا",
      description: "أنشئي جزءًا صغيرًا من موقع وجرّبي تنسيقه.",
      category: "Coding",
      icon: "💻",
      xp: 25
    },
    {
      id: 3,
      title: "امنحي نفسك بعض الحركة",
      description: "استمتعي بالمشي أو التمدد أو نشاط تحبينه.",
      category: "Wellness",
      icon: "🌿",
      xp: 20
    },
    {
      id: 4,
      title: "أبدعي شيئًا",
      description: "ارسمي أو اكتبي أو صمّمي شيئًا يعبر عنكِ.",
      category: "Creativity",
      icon: "🎨",
      xp: 15
    },
    {
      id: 5,
      title: "اقرئي قليلًا",
      description: "اقرئي لمدة ١٥ دقيقة من كتاب أو مقال مفيد.",
      category: "Learning",
      icon: "📖",
      xp: 10
    },
    {
      id: 6,
      title: "اختاري هدفك القادم",
      description: "حددي خطوة صغيرة تساعدك على تعلّم شيء جديد.",
      category: "Creativity",
      icon: "🌟",
      xp: 15
    }
  ];
  
  const completed = new Set();
  let activeFilter = "All";
  let toastTimer;
  
  const categoryNames = {
    Learning: "التعلّم",
    Coding: "البرمجة",
    Wellness: "العافية",
    Creativity: "الإبداع"
  };
  
  function arabicNumber(number) {
    return String(number).replace(/\d/g, digit => "٠١٢٣٤٥٦٧٨٩"[digit]);
  }
  
  const questGrid = document.getElementById("questGrid");
  const totalXp = document.getElementById("totalXp");
  const completedCount = document.getElementById("completedCount");
  const badgeCount = document.getElementById("badgeCount");
  const progressFill = document.getElementById("progressFill");
  const levelLabel = document.getElementById("levelLabel");
  const xpLabel = document.getElementById("xpLabel");
  const nextXpLabel = document.getElementById("nextXpLabel");
  const questCounter = document.getElementById("questCounter");
  const badgeList = document.getElementById("badgeList");
  const toast = document.getElementById("toast");
  
  function getXP() {
    return quests
      .filter(quest => completed.has(quest.id))
      .reduce((sum, quest) => sum + quest.xp, 0);
  }
  
  function renderQuests() {
    const visibleQuests = quests.filter(quest =>
      activeFilter === "All" || quest.category === activeFilter
    );
  
    questGrid.innerHTML = visibleQuests.map(quest => {
      const isDone = completed.has(quest.id);
      const category = quest.category.toLowerCase();
  
      return `
        <article class="quest-card ${isDone ? "is-complete" : ""}">
          <div class="quest-top">
            <span class="quest-icon">${quest.icon}</span>
            <span class="quest-tag tag-${category}">
              ${categoryNames[quest.category]}
            </span>
          </div>
  
          <h3>${quest.title}</h3>
          <p>${quest.description}</p>
  
          <div class="quest-bottom">
            <span class="xp-reward">
              ✦ +${arabicNumber(quest.xp)} نقطة
            </span>
  
            <button
              class="quest-btn ${isDone ? "completed" : ""}"
              data-id="${quest.id}"
              ${isDone ? "disabled" : ""}
            >
              ${isDone ? "✓ اكتملت" : "ابدئي المهمة"}
            </button>
          </div>
        </article>
      `;
    }).join("");
  }
  
  function renderProgress() {
    const xp = getXP();
    const level = Math.floor(xp / 50) + 1;
    const progress = xp % 50;
  
    totalXp.textContent = `${arabicNumber(xp)} نقطة`;
    completedCount.textContent = arabicNumber(completed.size);
  
    questCounter.textContent =
      `${arabicNumber(completed.size)} من ${arabicNumber(quests.length)} مهام مكتملة`;
  
    levelLabel.textContent = `المستوى ${arabicNumber(level)}`;
    xpLabel.textContent =
      `${arabicNumber(progress)} من ${arabicNumber(50)} نقطة`;
  
    nextXpLabel.textContent =
      `${arabicNumber(50 - progress)} نقطة للمستوى التالي`;
  
    progressFill.style.width = `${(progress / 50) * 100}%`;
  
    renderBadges();
  }
  
  function renderBadges() {
    const badges = [];
  
    if (completed.size >= 1) {
      badges.push({
        icon: "🌱",
        name: "الخطوة الأولى",
        detail: "أكملتِ أول مهمة"
      });
    }
  
    if (completed.size >= 3) {
      badges.push({
        icon: "⚡",
        name: "صانعة الإنجاز",
        detail: "أكملتِ ثلاث مهام"
      });
    }
  
    if (completed.size >= 6) {
      badges.push({
        icon: "👑",
        name: "بطلة الإنجاز",
        detail: "أكملتِ كل المهام"
      });
    }
  
    badgeCount.textContent = arabicNumber(badges.length);
  
    badgeList.innerHTML = badges.length
      ? badges.map(badge => `
          <div class="achievement">
            <span class="achievement-icon">${badge.icon}</span>
            <div>
              <strong>${badge.name}</strong>
              <small>${badge.detail}</small>
            </div>
          </div>
        `).join("")
      : `<div class="empty-badges">
           أكملي أول مهمة لتحصلي على وسامك الأول ✧
         </div>`;
  }
  
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
  
    clearTimeout(toastTimer);
  
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }
  
  questGrid.addEventListener("click", event => {
    const button = event.target.closest(".quest-btn");
  
    if (!button || button.disabled) return;
  
    const id = Number(button.dataset.id);
    const quest = quests.find(item => item.id === id);
  
    if (!quest || completed.has(id)) return;
  
    completed.add(id);
  
    renderQuests();
    renderProgress();
  
    showToast(`أحسنتِ! حصلتِ على ${arabicNumber(quest.xp)} نقطة ✨`);
  
    if (completed.size === quests.length) {
      showToast("رائع! أنجزتِ جميع المهام! 👑");
    }
  });
  
  document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest(".filter");
  
    if (!button) return;
  
    activeFilter = button.dataset.filter;
  
    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });
  
    renderQuests();
  });
  
  document.getElementById("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("light");
  
    const isLight = document.body.classList.contains("light");
  
    document.getElementById("themeBtn").textContent =
      isLight ? "☀" : "☾";
  
    showToast(isLight ? "تم تفعيل المظهر الفاتح ☀" : "تم تفعيل المظهر الداكن ☾");
  });
  
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach(item => {
        item.classList.remove("active");
      });
  
      link.classList.add("active");
    });
  });
  
  renderQuests();
  renderProgress();
  