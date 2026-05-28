export type Locale = "zh-Hans" | "zh-Hant" | "en" | "ja" | "ko";

export const localeLabels: Record<Locale, string> = {
  "zh-Hans": "简体",
  "zh-Hant": "繁體",
  en: "EN",
  ja: "日本語",
  ko: "한국어"
};

export const translations = {
  "zh-Hans": {
    language: {
      label: "语言",
      aria: "选择界面语言"
    },
    hero: {
      eyebrow: "今日宣传摊",
      lede: "记录小红书、B站、X/Twitter、公众号等发布，把每次宣传摆成可复盘的小摊。",
      actionsAria: "核心用途",
      platforms: "平台发布",
      media: "视频/图文",
      autoArchive: "自动归档",
      statsAria: "宣传统计"
    },
    stats: {
      records: "发布记录",
      products: "宣传品类",
      platforms: "触达平台",
      latest: "最近开摊",
      neverOpened: "未开摊"
    },
    composer: {
      aria: "新增宣传记录",
      kicker: "开摊记录台",
      title: "贴发布链接，或写下这次宣传",
      autoBadge: "自动识别标签",
      inputLabel: "宣传记录内容",
      placeholder: "例如：小红书发了新品，B站剪了短视频，X 同步链接 https://...",
      helper: "平台、产品和宣传动作会自动归档。",
      submit: "记一摊",
      dbError: "线上数据库暂时没连上，记录台稍后再试。"
    },
    productPicker: {
      aria: "选择出摊产品",
      title: "这次摆哪个摊",
      autoDetect: "自动识别",
      empty: "还没有固定摊位，可以先新增一个产品。",
      inputLabel: "新增产品",
      placeholder: "新增摊位，例如 StallDiary",
      add: "加摊"
    },
    entries: {
      aria: "宣传出摊日记",
      kicker: "宣传摊位街",
      title: "已经摆出去的摊",
      loadingTitle: "正在收摊位",
      loadingBody: "加载最近的宣传记录。",
      filterEmptyTitle: "这个项目还没出摊",
      filterEmptyBody: "切回全部项目，或先给这个项目补一条记录。",
      emptyTitle: "今天还没开摊",
      emptyBody: "第一条发布记录会出现在这里。",
      filterAria: "按项目筛选出摊日志",
      filterLabel: "项目筛选",
      allProjects: "全部项目",
      unassigned: "未选择项目",
      untitledProject: "未命名项目"
    },
    activity: {
      aria: "宣传和代码频率对比",
      kicker: "频率地图",
      title: "出摊和写代码的节奏",
      rangeFallback: "过去一年",
      promoTotal: "出摊次数",
      codeTotal: "代码贡献",
      promoDays: "出摊天数",
      codeDays: "代码天数",
      overlapDays: "重合天数",
      loading: "正在整理频率。",
      pairAria: "过去一年的宣传和代码频率热力图",
      noData: "还没有足够数据。",
      note: "代码频率暂时没有从 GitHub 取到，稍后会自动重试。",
      promoLabel: "宣传",
      codeLabel: "代码",
      heatmapAria: "{label}频率贡献图",
      heatmapCell: "{date} · {label} {count} 次"
    },
    card: {
      openSource: "打开发布"
    },
    errors: {
      loadStalls: "加载宣传记录失败。",
      requiredInput: "先贴一条发布链接，或写下这次宣传内容。",
      saveFailed: "保存失败。",
      productNameRequired: "先写一个摊位名。",
      productCreateFailed: "新增摊位失败。",
      loadActivity: "加载频率失败。",
      loadProducts: "加载摊位失败。"
    },
    stallTypes: {
      "ai-service": "AI服务摊",
      brand: "品牌宣传",
      content: "内容宣传",
      coffee: "咖啡宣传",
      craft: "手作宣传",
      daily: "日常宣传",
      dessert: "甜品宣传",
      event: "活动宣传",
      goods: "杂货宣传",
      link: "链接宣传",
      mystic: "玄学宣传",
      plant: "花植宣传",
      product: "产品出摊",
      fallback: "宣传摊"
    }
  },
  "zh-Hant": {
    language: {
      label: "語言",
      aria: "選擇介面語言"
    },
    hero: {
      eyebrow: "今日宣傳攤",
      lede: "記錄小紅書、B站、X/Twitter、公眾號等發布，把每次宣傳整理成可複盤的小攤。",
      actionsAria: "核心用途",
      platforms: "平台發布",
      media: "影片/圖文",
      autoArchive: "自動歸檔",
      statsAria: "宣傳統計"
    },
    stats: {
      records: "發布記錄",
      products: "宣傳品類",
      platforms: "觸達平台",
      latest: "最近開攤",
      neverOpened: "未開攤"
    },
    composer: {
      aria: "新增宣傳記錄",
      kicker: "開攤記錄台",
      title: "貼發布連結，或寫下這次宣傳",
      autoBadge: "自動識別標籤",
      inputLabel: "宣傳記錄內容",
      placeholder: "例如：小紅書發了新品，B站剪了短影片，X 同步連結 https://...",
      helper: "平台、產品和宣傳動作會自動歸檔。",
      submit: "記一攤",
      dbError: "線上資料庫暫時沒連上，記錄台稍後再試。"
    },
    productPicker: {
      aria: "選擇出攤產品",
      title: "這次擺哪個攤",
      autoDetect: "自動識別",
      empty: "還沒有固定攤位，可以先新增一個產品。",
      inputLabel: "新增產品",
      placeholder: "新增攤位，例如 StallDiary",
      add: "加攤"
    },
    entries: {
      aria: "宣傳出攤日記",
      kicker: "宣傳攤位街",
      title: "已經擺出去的攤",
      loadingTitle: "正在收攤位",
      loadingBody: "載入最近的宣傳記錄。",
      filterEmptyTitle: "這個項目還沒出攤",
      filterEmptyBody: "切回全部項目，或先給這個項目補一條記錄。",
      emptyTitle: "今天還沒開攤",
      emptyBody: "第一條發布記錄會出現在這裡。",
      filterAria: "按項目篩選出攤日誌",
      filterLabel: "項目篩選",
      allProjects: "全部項目",
      unassigned: "未選擇項目",
      untitledProject: "未命名項目"
    },
    activity: {
      aria: "宣傳和程式碼頻率對比",
      kicker: "頻率地圖",
      title: "出攤和寫程式碼的節奏",
      rangeFallback: "過去一年",
      promoTotal: "出攤次數",
      codeTotal: "程式碼貢獻",
      promoDays: "出攤天數",
      codeDays: "程式碼天數",
      overlapDays: "重合天數",
      loading: "正在整理頻率。",
      pairAria: "過去一年的宣傳和程式碼頻率熱力圖",
      noData: "還沒有足夠資料。",
      note: "程式碼頻率暫時沒有從 GitHub 取到，稍後會自動重試。",
      promoLabel: "宣傳",
      codeLabel: "程式碼",
      heatmapAria: "{label}頻率貢獻圖",
      heatmapCell: "{date} · {label} {count} 次"
    },
    card: {
      openSource: "打開發布"
    },
    errors: {
      loadStalls: "載入宣傳記錄失敗。",
      requiredInput: "先貼一條發布連結，或寫下這次宣傳內容。",
      saveFailed: "儲存失敗。",
      productNameRequired: "先寫一個攤位名。",
      productCreateFailed: "新增攤位失敗。",
      loadActivity: "載入頻率失敗。",
      loadProducts: "載入攤位失敗。"
    },
    stallTypes: {
      "ai-service": "AI服務攤",
      brand: "品牌宣傳",
      content: "內容宣傳",
      coffee: "咖啡宣傳",
      craft: "手作宣傳",
      daily: "日常宣傳",
      dessert: "甜品宣傳",
      event: "活動宣傳",
      goods: "雜貨宣傳",
      link: "連結宣傳",
      mystic: "玄學宣傳",
      plant: "花植宣傳",
      product: "產品出攤",
      fallback: "宣傳攤"
    }
  },
  en: {
    language: {
      label: "Language",
      aria: "Choose interface language"
    },
    hero: {
      eyebrow: "Today's promo stall",
      lede: "Log posts from Xiaohongshu, Bilibili, X/Twitter, WeChat and more, then turn every promotion into a stall you can review.",
      actionsAria: "Core uses",
      platforms: "Platform posts",
      media: "Video / posts",
      autoArchive: "Auto archive",
      statsAria: "Promotion stats"
    },
    stats: {
      records: "Posts",
      products: "Products",
      platforms: "Platforms",
      latest: "Latest stall",
      neverOpened: "Not started"
    },
    composer: {
      aria: "Add promotion log",
      kicker: "Stall counter",
      title: "Paste a post link, or write down this promotion",
      autoBadge: "Auto tags",
      inputLabel: "Promotion log content",
      placeholder: "Example: New post on Xiaohongshu, short video on Bilibili, X link https://...",
      helper: "Platform, product and promotion actions will be archived automatically.",
      submit: "Log stall",
      dbError: "The online database is temporarily unavailable. Try again later."
    },
    productPicker: {
      aria: "Choose promotion product",
      title: "Which stall is this?",
      autoDetect: "Auto detect",
      empty: "No fixed stall yet. Add a product first.",
      inputLabel: "Add product",
      placeholder: "Add a stall, e.g. StallDiary",
      add: "Add"
    },
    entries: {
      aria: "Promotion stall diary",
      kicker: "Stall street",
      title: "Stalls already opened",
      loadingTitle: "Collecting stalls",
      loadingBody: "Loading recent promotion logs.",
      filterEmptyTitle: "No logs for this project yet",
      filterEmptyBody: "Switch back to all projects, or add one log for this project.",
      emptyTitle: "No stall opened today",
      emptyBody: "Your first promotion log will appear here.",
      filterAria: "Filter stall logs by project",
      filterLabel: "Project filter",
      allProjects: "All projects",
      unassigned: "Unassigned",
      untitledProject: "Untitled project"
    },
    activity: {
      aria: "Promotion and code frequency comparison",
      kicker: "Frequency map",
      title: "Promotion and coding rhythm",
      rangeFallback: "Past year",
      promoTotal: "Promotions",
      codeTotal: "Code contributions",
      promoDays: "Promo days",
      codeDays: "Code days",
      overlapDays: "Overlap days",
      loading: "Preparing frequency.",
      pairAria: "Promotion and code heatmaps for the past year",
      noData: "Not enough data yet.",
      note: "Code frequency was not available from GitHub. It will retry later.",
      promoLabel: "Promotion",
      codeLabel: "Code",
      heatmapAria: "{label} frequency heatmap",
      heatmapCell: "{date} · {label} {count}"
    },
    card: {
      openSource: "Open post"
    },
    errors: {
      loadStalls: "Failed to load promotion logs.",
      requiredInput: "Paste a post link, or write down this promotion first.",
      saveFailed: "Failed to save.",
      productNameRequired: "Enter a stall name first.",
      productCreateFailed: "Failed to add stall.",
      loadActivity: "Failed to load frequency.",
      loadProducts: "Failed to load stalls."
    },
    stallTypes: {
      "ai-service": "AI service",
      brand: "Brand promo",
      content: "Content promo",
      coffee: "Coffee promo",
      craft: "Craft promo",
      daily: "Daily promo",
      dessert: "Dessert promo",
      event: "Event promo",
      goods: "Goods promo",
      link: "Link promo",
      mystic: "Mystic promo",
      plant: "Plant promo",
      product: "Product stall",
      fallback: "Promo stall"
    }
  },
  ja: {
    language: {
      label: "言語",
      aria: "表示言語を選択"
    },
    hero: {
      eyebrow: "今日の宣伝屋台",
      lede: "小紅書、Bilibili、X/Twitter、WeChat などの投稿を記録し、宣伝の動きをあとで振り返れる小さな屋台にします。",
      actionsAria: "主な用途",
      platforms: "投稿管理",
      media: "動画/記事",
      autoArchive: "自動整理",
      statsAria: "宣伝統計"
    },
    stats: {
      records: "投稿記録",
      products: "宣伝品目",
      platforms: "到達平台",
      latest: "直近の出店",
      neverOpened: "未出店"
    },
    composer: {
      aria: "宣伝記録を追加",
      kicker: "出店記録台",
      title: "投稿リンクを貼るか、今回の宣伝を書き残す",
      autoBadge: "自動タグ",
      inputLabel: "宣伝記録の内容",
      placeholder: "例：小紅書に新作を投稿、Bilibili に短い動画、X にリンク https://...",
      helper: "平台、商品、宣伝アクションを自動で整理します。",
      submit: "記録する",
      dbError: "オンラインデータベースに一時的に接続できません。少し後で再試行してください。"
    },
    productPicker: {
      aria: "出店する商品を選択",
      title: "今回はどの屋台？",
      autoDetect: "自動判定",
      empty: "固定屋台はまだありません。先に商品を追加できます。",
      inputLabel: "商品を追加",
      placeholder: "屋台を追加、例：StallDiary",
      add: "追加"
    },
    entries: {
      aria: "宣伝出店日記",
      kicker: "宣伝屋台通り",
      title: "これまでに出した屋台",
      loadingTitle: "屋台を集めています",
      loadingBody: "最近の宣伝記録を読み込み中です。",
      filterEmptyTitle: "このプロジェクトはまだ出店していません",
      filterEmptyBody: "全プロジェクトに戻すか、このプロジェクトの記録を追加してください。",
      emptyTitle: "今日はまだ出店していません",
      emptyBody: "最初の投稿記録がここに表示されます。",
      filterAria: "プロジェクト別に出店ログを絞り込む",
      filterLabel: "プロジェクト",
      allProjects: "すべて",
      unassigned: "未選択",
      untitledProject: "名称未設定"
    },
    activity: {
      aria: "宣伝とコード頻度の比較",
      kicker: "頻度マップ",
      title: "出店とコードを書くリズム",
      rangeFallback: "過去1年",
      promoTotal: "出店回数",
      codeTotal: "コード貢献",
      promoDays: "出店日数",
      codeDays: "コード日数",
      overlapDays: "重複日数",
      loading: "頻度を整理しています。",
      pairAria: "過去1年の宣伝とコード頻度ヒートマップ",
      noData: "まだ十分なデータがありません。",
      note: "GitHub からコード頻度を取得できませんでした。後でもう一度試します。",
      promoLabel: "宣伝",
      codeLabel: "コード",
      heatmapAria: "{label}の頻度ヒートマップ",
      heatmapCell: "{date} · {label} {count}回"
    },
    card: {
      openSource: "投稿を開く"
    },
    errors: {
      loadStalls: "宣伝記録の読み込みに失敗しました。",
      requiredInput: "先に投稿リンクを貼るか、今回の宣伝を書いてください。",
      saveFailed: "保存に失敗しました。",
      productNameRequired: "先に屋台名を入力してください。",
      productCreateFailed: "屋台の追加に失敗しました。",
      loadActivity: "頻度の読み込みに失敗しました。",
      loadProducts: "屋台の読み込みに失敗しました。"
    },
    stallTypes: {
      "ai-service": "AIサービス",
      brand: "ブランド宣伝",
      content: "コンテンツ宣伝",
      coffee: "コーヒー宣伝",
      craft: "手作り宣伝",
      daily: "日常宣伝",
      dessert: "スイーツ宣伝",
      event: "イベント宣伝",
      goods: "雑貨宣伝",
      link: "リンク宣伝",
      mystic: "占い宣伝",
      plant: "花と植物",
      product: "商品屋台",
      fallback: "宣伝屋台"
    }
  },
  ko: {
    language: {
      label: "언어",
      aria: "인터페이스 언어 선택"
    },
    hero: {
      eyebrow: "오늘의 홍보 가판대",
      lede: "샤오홍슈, Bilibili, X/Twitter, 위챗 등의 게시물을 기록하고, 매번의 홍보를 다시 볼 수 있는 작은 가판대로 정리합니다.",
      actionsAria: "핵심 용도",
      platforms: "플랫폼 게시",
      media: "영상/글",
      autoArchive: "자동 보관",
      statsAria: "홍보 통계"
    },
    stats: {
      records: "게시 기록",
      products: "홍보 품목",
      platforms: "도달 플랫폼",
      latest: "최근 개장",
      neverOpened: "미개장"
    },
    composer: {
      aria: "홍보 기록 추가",
      kicker: "가판대 기록대",
      title: "게시 링크를 붙이거나 이번 홍보를 적어두기",
      autoBadge: "자동 태그",
      inputLabel: "홍보 기록 내용",
      placeholder: "예: 샤오홍슈에 신제품 게시, Bilibili 짧은 영상, X 링크 https://...",
      helper: "플랫폼, 제품, 홍보 동작을 자동으로 보관합니다.",
      submit: "기록하기",
      dbError: "온라인 데이터베이스에 잠시 연결할 수 없습니다. 나중에 다시 시도하세요."
    },
    productPicker: {
      aria: "홍보 제품 선택",
      title: "이번에는 어떤 가판대?",
      autoDetect: "자동 인식",
      empty: "고정 가판대가 아직 없습니다. 먼저 제품을 추가할 수 있습니다.",
      inputLabel: "제품 추가",
      placeholder: "가판대 추가, 예: StallDiary",
      add: "추가"
    },
    entries: {
      aria: "홍보 가판대 일지",
      kicker: "홍보 가판대 거리",
      title: "이미 열었던 가판대",
      loadingTitle: "가판대를 불러오는 중",
      loadingBody: "최근 홍보 기록을 불러옵니다.",
      filterEmptyTitle: "이 프로젝트는 아직 기록이 없습니다",
      filterEmptyBody: "전체 프로젝트로 돌아가거나 이 프로젝트 기록을 하나 추가하세요.",
      emptyTitle: "오늘은 아직 열지 않았습니다",
      emptyBody: "첫 번째 게시 기록이 여기에 표시됩니다.",
      filterAria: "프로젝트별 홍보 로그 필터",
      filterLabel: "프로젝트 필터",
      allProjects: "전체 프로젝트",
      unassigned: "미선택",
      untitledProject: "이름 없는 프로젝트"
    },
    activity: {
      aria: "홍보와 코드 빈도 비교",
      kicker: "빈도 지도",
      title: "홍보와 코딩의 리듬",
      rangeFallback: "지난 1년",
      promoTotal: "홍보 횟수",
      codeTotal: "코드 기여",
      promoDays: "홍보 일수",
      codeDays: "코딩 일수",
      overlapDays: "겹친 날",
      loading: "빈도를 정리하는 중입니다.",
      pairAria: "지난 1년의 홍보와 코드 빈도 히트맵",
      noData: "아직 충분한 데이터가 없습니다.",
      note: "GitHub 에서 코드 빈도를 가져오지 못했습니다. 나중에 자동으로 다시 시도합니다.",
      promoLabel: "홍보",
      codeLabel: "코드",
      heatmapAria: "{label} 빈도 히트맵",
      heatmapCell: "{date} · {label} {count}회"
    },
    card: {
      openSource: "게시물 열기"
    },
    errors: {
      loadStalls: "홍보 기록을 불러오지 못했습니다.",
      requiredInput: "먼저 게시 링크를 붙이거나 이번 홍보 내용을 적어주세요.",
      saveFailed: "저장하지 못했습니다.",
      productNameRequired: "먼저 가판대 이름을 입력하세요.",
      productCreateFailed: "가판대를 추가하지 못했습니다.",
      loadActivity: "빈도를 불러오지 못했습니다.",
      loadProducts: "가판대를 불러오지 못했습니다."
    },
    stallTypes: {
      "ai-service": "AI 서비스",
      brand: "브랜드 홍보",
      content: "콘텐츠 홍보",
      coffee: "커피 홍보",
      craft: "수공예 홍보",
      daily: "일상 홍보",
      dessert: "디저트 홍보",
      event: "이벤트 홍보",
      goods: "잡화 홍보",
      link: "링크 홍보",
      mystic: "점성/타로 홍보",
      plant: "꽃과 식물",
      product: "제품 가판대",
      fallback: "홍보 가판대"
    }
  }
} as const;

export type Translation = (typeof translations)[Locale];

const localeStorageKey = "stalldiary.locale";
const legacyLocaleStorageKey = "stalllog.locale";

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "zh-Hans";
  }

  const queryLocale = parseLocale(new URLSearchParams(window.location.search).get("lang"));

  if (queryLocale) {
    return queryLocale;
  }

  const savedLocale = parseLocale(
    window.localStorage.getItem(localeStorageKey) ??
      window.localStorage.getItem(legacyLocaleStorageKey)
  );

  if (savedLocale) {
    return savedLocale;
  }

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const language of browserLanguages) {
    const locale = parseLocale(language);

    if (locale) {
      return locale;
    }
  }

  return "zh-Hans";
}

export function persistLocale(locale: Locale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localeStorageKey, locale);
  document.documentElement.lang = toIntlLocale(locale);
}

export function toIntlLocale(locale: Locale) {
  const intlLocales: Record<Locale, string> = {
    "zh-Hans": "zh-CN",
    "zh-Hant": "zh-TW",
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR"
  };

  return intlLocales[locale];
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function parseLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (normalized === "zh-hans" || normalized === "zh-cn" || normalized === "zh-sg") {
    return "zh-Hans";
  }

  if (
    normalized === "zh-hant" ||
    normalized === "zh-tw" ||
    normalized === "zh-hk" ||
    normalized === "zh-mo"
  ) {
    return "zh-Hant";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  if (normalized.startsWith("ja")) {
    return "ja";
  }

  if (normalized.startsWith("ko")) {
    return "ko";
  }

  if (normalized.startsWith("zh")) {
    return "zh-Hans";
  }

  return null;
}
