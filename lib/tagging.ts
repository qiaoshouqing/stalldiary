import type { StallAccent } from "./types";

type ProductRule = {
  tag: string;
  pattern: RegExp;
  stallType: string;
  accent: StallAccent;
};

type ChannelRule = {
  tag: string;
  pattern: RegExp;
};

type MoodRule = {
  tag: string;
  pattern: RegExp;
};

export type StallAnalysis = {
  sourceUrl: string | null;
  title: string;
  description: string;
  productTags: string[];
  channelTags: string[];
  moodTags: string[];
  stallType: string;
  accent: StallAccent;
};

const productRules: ProductRule[] = [
  {
    tag: "咖啡",
    pattern: /咖啡|拿铁|美式|冷萃|手冲|coffee|latte|espresso|americano/i,
    stallType: "coffee",
    accent: "gold"
  },
  {
    tag: "甜品",
    pattern: /甜品|蛋糕|饼干|面包|可颂|布丁|曲奇|dessert|cake|cookie|bakery/i,
    stallType: "dessert",
    accent: "coral"
  },
  {
    tag: "手作饰品",
    pattern: /手作|手工|串珠|耳环|耳饰|项链|手链|戒指|饰品|bead|jewelry|accessor/i,
    stallType: "craft",
    accent: "teal"
  },
  {
    tag: "花植",
    pattern: /鲜花|花束|绿植|盆栽|多肉|植物|花艺|flower|plant|bouquet/i,
    stallType: "plant",
    accent: "green"
  },
  {
    tag: "玄学咨询",
    pattern: /塔罗|占星|星盘|八字|命理|紫微|合盘|疗愈|tarot|astrology/i,
    stallType: "mystic",
    accent: "ink"
  },
  {
    tag: "AI服务",
    pattern: /AI|人工智能|提示词|prompt|简历优化|网站搭建|自动化|agent|workflow/i,
    stallType: "ai-service",
    accent: "teal"
  },
  {
    tag: "内容产品",
    pattern: /文章|长文|视频|短视频|播客|newsletter|内容|专栏|频道|账号|自媒体|content|podcast/i,
    stallType: "content",
    accent: "gold"
  },
  {
    tag: "个人品牌",
    pattern: /个人品牌|IP|品牌|作品集|portfolio|主页|简介|bio|about/i,
    stallType: "brand",
    accent: "ink"
  },
  {
    tag: "二手杂货",
    pattern: /二手|闲置|中古|旧书|杂货|vintage|secondhand|zine/i,
    stallType: "goods",
    accent: "gold"
  },
  {
    tag: "课程活动",
    pattern: /课程|工作坊|活动|分享会|训练营|社群|直播|课|workshop|class|event|webinar/i,
    stallType: "event",
    accent: "green"
  }
];

const channelRules: ChannelRule[] = [
  { tag: "小红书", pattern: /xiaohongshu|xhslink|小红书|xhs/i },
  { tag: "抖音", pattern: /douyin|iesdouyin|抖音/i },
  { tag: "B站", pattern: /bilibili|b23\.tv|哔哩|B站/i },
  { tag: "X/Twitter", pattern: /twitter\.com|x\.com|推特|Twitter|tweet|推文|X平台/i },
  { tag: "YouTube", pattern: /youtube|youtu\.be|油管/i },
  { tag: "即刻", pattern: /okjike|jike|即刻/i },
  { tag: "微信", pattern: /mp\.weixin|weixin|微信|公众号|朋友圈/i },
  { tag: "公众号", pattern: /公众号|订阅号|服务号|mp\.weixin/i },
  { tag: "淘宝", pattern: /taobao|tmall|淘宝|天猫/i },
  { tag: "闲鱼", pattern: /goofish|xianyu|闲鱼/i },
  { tag: "官网", pattern: /官网|网站|landing page|homepage|site|blog/i },
  { tag: "线下", pattern: /线下|市集|摆摊|摊位|集市|street market/i },
  { tag: "链接", pattern: /https?:\/\//i }
];

const moodRules: MoodRule[] = [
  { tag: "新品", pattern: /新品|新款|上新|首发|new/i },
  { tag: "促销", pattern: /折扣|优惠|限时|特价|买一送一|sale|discount/i },
  { tag: "爆款", pattern: /爆款|卖爆|售罄|排队|火了|hot|sold out/i },
  { tag: "已发布", pattern: /发了|发布|发表|上线|post|posted|publish|published/i },
  { tag: "同步分发", pattern: /同步|转发|搬运|分发|republish|cross-post|crosspost/i },
  { tag: "视频", pattern: /视频|短视频|剪了|剪辑|拍了|录了|vlog|video|clip/i },
  { tag: "图文", pattern: /图文|笔记|图片|海报|poster|carousel/i },
  { tag: "长文", pattern: /长文|文章|博客|newsletter|post article|blog/i },
  { tag: "直播", pattern: /直播|开播|live|stream/i },
  { tag: "试水", pattern: /试水|测试|先发|看看反馈|experiment|pilot/i },
  { tag: "复盘", pattern: /复盘|总结|战报|日记|昨天/i }
];

export function analyzeStallInput(rawInput: string): StallAnalysis {
  const sourceText = normalizeSpaces(rawInput);
  const sourceUrl = extractFirstUrl(sourceText);
  const sourceForRules = `${sourceText} ${sourceUrl ?? ""}`;

  const matchedProducts = productRules.filter((rule) => rule.pattern.test(sourceForRules));
  const primaryProduct = matchedProducts[0] ?? {
    tag: sourceUrl ? "宣传线索" : "日常宣传",
    stallType: sourceUrl ? "link" : "daily",
    accent: "coral" as StallAccent
  };

  const productTags = unique([
    primaryProduct.tag,
    ...matchedProducts.slice(1, 3).map((rule) => rule.tag)
  ]);
  const channelTags = unique(
    channelRules.filter((rule) => rule.pattern.test(sourceForRules)).map((rule) => rule.tag)
  );
  const moodTags = unique(
    moodRules.filter((rule) => rule.pattern.test(sourceForRules)).map((rule) => rule.tag)
  );

  return {
    sourceUrl,
    title: buildTitle(sourceText, sourceUrl, primaryProduct.tag),
    description: buildDescription(sourceText, sourceUrl),
    productTags,
    channelTags: channelTags.length ? channelTags : ["手动记录"],
    moodTags: moodTags.length ? moodTags : ["待观察"],
    stallType: primaryProduct.stallType,
    accent: primaryProduct.accent
  };
}

function buildTitle(sourceText: string, sourceUrl: string | null, productTag: string) {
  const withoutUrl = cleanLooseLinkText(
    sourceUrl ? sourceText.replace(sourceUrl, "").trim() : sourceText
  );
  const firstLine = withoutUrl
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (firstLine) {
    return trimToLength(firstLine, 30);
  }

  if (sourceUrl) {
    return `${productTag} · ${getHostLabel(sourceUrl)}`;
  }

  return `${productTag} · 今日出摊`;
}

function buildDescription(sourceText: string, sourceUrl: string | null) {
  const cleaned = cleanLooseLinkText(sourceUrl ? sourceText.replace(sourceUrl, "").trim() : sourceText);

  if (cleaned) {
    return trimToLength(cleaned, 96);
  }

  if (sourceUrl) {
    return `来自 ${getHostLabel(sourceUrl)} 的新摊位线索。`;
  }

  return "今天的摊位记录还很轻，先把线索收进来。";
}

function extractFirstUrl(input: string) {
  const match = input.match(/https?:\/\/[^\s\u3000]+/i);

  if (!match) {
    return null;
  }

  return match[0].replace(/[),，。.!！?？]+$/u, "");
}

function getHostLabel(sourceUrl: string) {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "链接";
  }
}

function normalizeSpaces(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
}

function trimToLength(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function cleanLooseLinkText(value: string) {
  return value
    .replace(/(?:链接|地址|戳这里|link)[:：]?\s*$/iu, "")
    .replace(/[，,。；;\s]+$/u, "")
    .trim();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}
