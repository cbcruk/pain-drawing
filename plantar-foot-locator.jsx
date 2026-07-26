import React, { useState, useRef, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------
   구조 데이터는 path 문자열이 아니라 "중심선 + 폭"으로 저장한다.
   path는 렌더 시점에 생성. 손으로 수정 가능한 형태를 유지하는 게 핵심.
------------------------------------------------------------------- */

const r2 = (n) => Math.round(n * 100) / 100;

function smoothClosed(p) {
  if (p.length < 3) return "";
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(p[p.length - 1], p[0]);
  let d = `M ${r2(m0[0])} ${r2(m0[1])}`;
  for (let i = 0; i < p.length; i++) {
    const cur = p[i];
    const m = mid(cur, p[(i + 1) % p.length]);
    d += ` Q ${r2(cur[0])} ${r2(cur[1])} ${r2(m[0])} ${r2(m[1])}`;
  }
  return d + " Z";
}

/** 중심선 pts와 각 지점의 폭 ws로 리본(근육 배) 폴리곤 생성 */
function ribbon(pts, ws) {
  const n = pts.length;
  const norm = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  });
  const side = (s) =>
    pts.map((p, i) => [
      p[0] + norm[i][0] * ((ws[i] / 2) * s),
      p[1] + norm[i][1] * ((ws[i] / 2) * s),
    ]);
  return smoothClosed([...side(1), ...side(-1).reverse()]);
}

function shapePath(sh) {
  if (sh.t === "c") {
    const [cx, cy, rr] = sh.v;
    return `M ${cx - rr} ${cy} a ${rr} ${rr} 0 1 0 ${rr * 2} 0 a ${rr} ${rr} 0 1 0 ${-rr * 2} 0 Z`;
  }
  return ribbon(sh.p, sh.w);
}

/* ---------------------------- 조직 유형 ---------------------------- */

const TISSUE = {
  muscle: { fill: "#A85D4C", label: "근육" },
  tendon: { fill: "#D0BA88", label: "힘줄" },
  fascia: { fill: "#93A192", label: "건막" },
  bone: { fill: "#B8AF96", label: "뼈" },
};

/* ------------------------------ 층 ------------------------------- */

const LAYERS = [
  { d: 0, ko: "건막", en: "aponeurosis" },
  { d: 1, ko: "1층 · 표층", en: "first layer" },
  { d: 2, ko: "2층", en: "second layer" },
  { d: 3, ko: "3층", en: "third layer" },
  { d: 4, ko: "4층 · 심층", en: "fourth layer" },
];

/* --------------------------- 구조 데이터 --------------------------- */
/* 오른발 · 족저면 · 발가락 위쪽 · 무지는 화면 오른쪽 */

const STRUCTURES = [
  {
    id: "pa-medial",
    layer: 0,
    kind: "fascia",
    ko: "족저건막 내측대",
    en: "plantar aponeurosis, medial band",
    la: "aponeurosis plantaris",
    shapes: [
      { t: "r", p: [[176, 632], [196, 520], [206, 430], [214, 340], [226, 272]], w: [14, 20, 22, 20, 15] },
    ],
    origin: "종골 내측결절",
    insertion: "무지 굴근건초 · 제1중족지절 관절낭",
    action: "내측 세로 아치 정적 지지, 윈들라스 기전 전달",
    nerve: "—",
    notes: ["무지외전근 바로 심부에 있어 촉진만으로는 구분이 어렵다"],
  },
  {
    id: "pa-central",
    layer: 0,
    kind: "fascia",
    ko: "족저건막 중앙대",
    en: "plantar aponeurosis, central band",
    la: "aponeurosis plantaris",
    shapes: [
      { t: "r", p: [[160, 636], [154, 540], [150, 450], [146, 360], [142, 290]], w: [20, 34, 44, 50, 44] },
    ],
    origin: "종골 내측결절",
    insertion: "2~5지 굴근건초 · 족지 기저부로 부챗살 분지",
    action: "아치 정적 지지, 밀어차기 시 장력 전달",
    nerve: "—",
    notes: ["족저근막염 압통이 가장 흔한 밴드"],
  },
  {
    id: "pa-lateral",
    layer: 0,
    kind: "fascia",
    ko: "족저건막 외측대",
    en: "plantar aponeurosis, lateral band",
    la: "aponeurosis plantaris",
    shapes: [
      { t: "r", p: [[140, 630], [120, 530], [104, 440], [92, 360], [86, 300]], w: [12, 16, 18, 17, 14] },
    ],
    origin: "종골 외측 방향",
    insertion: "제5중족골 조면 부근",
    action: "외측 세로 아치 지지",
    nerve: "—",
    notes: [],
  },

  {
    id: "abductor-hallucis",
    layer: 1,
    kind: "muscle",
    ko: "무지외전근",
    en: "abductor hallucis",
    la: "musculus abductor hallucis",
    shapes: [
      { t: "r", p: [[188, 618], [202, 540], [212, 460], [220, 380], [228, 306], [238, 254]], w: [30, 34, 32, 28, 21, 13] },
    ],
    origin: "종골 내측돌기, 굴근지대, 족저건막",
    insertion: "무지 근위지골 저부 내측",
    action: "무지 외전·굴곡, 내측 세로 아치 동적 지지",
    nerve: "내측족저신경",
    notes: [
      "아치 안쪽 능선으로 만져지는 근육",
      "심부 근막과 족저방형근 사이에서 외측족저신경 제1분지가 눌릴 수 있다 (백스터 신경 포착)",
    ],
  },
  {
    id: "flexor-digitorum-brevis",
    layer: 1,
    kind: "muscle",
    ko: "단지굴근",
    en: "flexor digitorum brevis",
    la: "musculus flexor digitorum brevis",
    shapes: [
      { t: "r", p: [[152, 626], [147, 545], [143, 462], [139, 392]], w: [22, 40, 44, 38] },
      { t: "r", p: [[170, 382], [184, 308], [192, 258]], w: [9, 8, 6] },
      { t: "r", p: [[151, 384], [157, 308], [160, 256]], w: [9, 8, 6] },
      { t: "r", p: [[129, 388], [125, 312], [121, 262]], w: [9, 8, 6] },
      { t: "r", p: [[110, 394], [98, 322], [90, 278]], w: [9, 8, 6] },
    ],
    origin: "종골 내측돌기, 족저건막",
    insertion: "2~5지 중위지골 양측",
    action: "2~5지 근위·중위지절 굴곡",
    nerve: "내측족저신경",
    notes: ["각 힘줄이 갈라져 장지굴근건이 통과한다"],
  },
  {
    id: "abductor-digiti-minimi",
    layer: 1,
    kind: "muscle",
    ko: "소지외전근",
    en: "abductor digiti minimi",
    la: "musculus abductor digiti minimi",
    shapes: [
      { t: "r", p: [[116, 624], [100, 540], [88, 458], [80, 388], [76, 322], [82, 284]], w: [26, 30, 28, 24, 17, 11] },
    ],
    origin: "종골 내·외측돌기, 족저건막",
    insertion: "제5지 근위지골 저부 외측",
    action: "제5지 외전·굴곡, 외측 아치 지지",
    nerve: "외측족저신경",
    notes: [],
  },

  {
    id: "quadratus-plantae",
    layer: 2,
    kind: "muscle",
    ko: "족저방형근",
    en: "quadratus plantae",
    la: "musculus quadratus plantae",
    shapes: [
      { t: "r", p: [[178, 602], [170, 562], [162, 522]], w: [30, 28, 22] },
      { t: "r", p: [[120, 600], [140, 558], [158, 524]], w: [24, 24, 20] },
    ],
    origin: "종골 하면 내측·외측 (두 개의 두)",
    insertion: "장지굴근건 외측연",
    action: "장지굴근의 사선 견인을 세로 방향으로 교정",
    nerve: "외측족저신경",
    notes: ["이 근육이 없으면 발가락이 안쪽으로 휘며 굽는다"],
  },
  {
    id: "fdl-tendon",
    layer: 2,
    kind: "tendon",
    ko: "장지굴근 힘줄",
    en: "flexor digitorum longus tendon",
    la: "tendo musculi flexoris digitorum longi",
    shapes: [
      { t: "r", p: [[206, 600], [188, 545], [172, 496], [161, 450]], w: [11, 11, 12, 12] },
      { t: "r", p: [[172, 442], [186, 342], [196, 246]], w: [8, 7, 5] },
      { t: "r", p: [[156, 444], [161, 342], [164, 244]], w: [8, 7, 5] },
      { t: "r", p: [[140, 448], [128, 346], [120, 248]], w: [8, 7, 5] },
      { t: "r", p: [[124, 454], [104, 352], [92, 268]], w: [8, 7, 5] },
    ],
    origin: "근육 배는 종아리 후면 심부 구획",
    insertion: "2~5지 원위지골 저부",
    action: "2~5지 말단 굴곡, 밀어차기 보조",
    nerve: "경골신경",
    notes: ["헨리 결절에서 장무지굴근 힘줄과 교차한다"],
  },
  {
    id: "lumbricals",
    layer: 2,
    kind: "muscle",
    ko: "충양근",
    en: "lumbricals",
    la: "musculi lumbricales pedis",
    shapes: [
      { t: "r", p: [[176, 428], [188, 362], [194, 318]], w: [10, 8, 6] },
      { t: "r", p: [[158, 430], [163, 364], [166, 320]], w: [10, 8, 6] },
      { t: "r", p: [[141, 434], [133, 368], [128, 324]], w: [10, 8, 6] },
      { t: "r", p: [[124, 440], [110, 374], [102, 330]], w: [10, 8, 6] },
    ],
    origin: "장지굴근 힘줄",
    insertion: "2~5지 신전건막 내측",
    action: "중족지절 굴곡 + 지절 신전",
    nerve: "제1충양근은 내측족저신경, 나머지는 외측족저신경",
    notes: [],
  },
  {
    id: "fhl-tendon",
    layer: 2,
    kind: "tendon",
    ko: "장무지굴근 힘줄",
    en: "flexor hallucis longus tendon",
    la: "tendo musculi flexoris hallucis longi",
    shapes: [
      { t: "r", p: [[206, 588], [192, 520], [198, 452], [212, 362], [228, 290], [240, 198]], w: [12, 12, 12, 11, 10, 7] },
    ],
    origin: "근육 배는 비골 후면 (종아리 심부)",
    insertion: "무지 원위지골 저부",
    action: "무지 말단 굴곡, 밀어차기 마지막 추진",
    nerve: "경골신경",
    notes: [
      "재거돌기 아래를 돌아 종자골 두 개 사이를 통과한다",
      "발바닥이 아픈데 원인은 종아리인 전형적인 경우",
    ],
  },

  {
    id: "flexor-hallucis-brevis",
    layer: 3,
    kind: "muscle",
    ko: "단무지굴근",
    en: "flexor hallucis brevis",
    la: "musculus flexor hallucis brevis",
    shapes: [
      { t: "r", p: [[172, 422], [196, 372], [214, 322], [228, 288]], w: [20, 26, 26, 18] },
    ],
    origin: "입방골, 외측설상골, 후경골근 힘줄",
    insertion: "무지 근위지골 저부 (내측두·외측두)",
    action: "제1중족지절 굴곡, 밀어차기 시 하중 전달",
    nerve: "내측족저신경",
    notes: ["각 두의 힘줄 안에 종자골이 하나씩 들어 있다"],
  },
  {
    id: "sesamoids",
    layer: 3,
    kind: "bone",
    ko: "종자골",
    en: "sesamoid bones (tibial · fibular)",
    la: "ossa sesamoidea",
    shapes: [
      { t: "c", v: [237, 280, 7.5] },
      { t: "c", v: [220, 290, 7.5] },
    ],
    origin: "—",
    insertion: "단무지굴근 힘줄 내 매몰",
    action: "제1중족지절의 지렛대 팔을 늘리고 힘줄을 보호",
    nerve: "—",
    notes: ["체중이 직접 실리는 위치", "종자골염, 터프토가 발생하는 지점"],
  },
  {
    id: "adductor-hallucis-oblique",
    layer: 3,
    kind: "muscle",
    ko: "무지내전근 사두",
    en: "adductor hallucis, oblique head",
    la: "musculus adductor hallucis",
    shapes: [
      { t: "r", p: [[134, 402], [164, 352], [194, 312], [214, 292]], w: [24, 26, 22, 14] },
    ],
    origin: "제2~4중족골 저부, 장비골근 건초",
    insertion: "무지 근위지골 저부 외측 (외측 종자골 경유)",
    action: "무지 내전, 횡아치 지지",
    nerve: "외측족저신경 심지",
    notes: [],
  },
  {
    id: "adductor-hallucis-transverse",
    layer: 3,
    kind: "muscle",
    ko: "무지내전근 횡두",
    en: "adductor hallucis, transverse head",
    la: "musculus adductor hallucis",
    shapes: [
      { t: "r", p: [[96, 292], [140, 282], [180, 280], [212, 288]], w: [12, 13, 13, 12] },
    ],
    origin: "제3~5중족지절 관절낭, 심횡중족인대",
    insertion: "무지 근위지골 저부 외측",
    action: "중족골두를 모아 횡아치 유지",
    nerve: "외측족저신경 심지",
    notes: ["약해지면 전족부가 벌어지며 개장족 경향"],
  },
  {
    id: "flexor-digiti-minimi-brevis",
    layer: 3,
    kind: "muscle",
    ko: "단소지굴근",
    en: "flexor digiti minimi brevis",
    la: "musculus flexor digiti minimi brevis",
    shapes: [
      { t: "r", p: [[84, 396], [80, 350], [80, 302]], w: [18, 18, 13] },
    ],
    origin: "제5중족골 저부, 장비골근 건초",
    insertion: "제5지 근위지골 저부",
    action: "제5중족지절 굴곡",
    nerve: "외측족저신경 천지",
    notes: [],
  },

  {
    id: "plantar-interossei",
    layer: 4,
    kind: "muscle",
    ko: "저측골간근",
    en: "plantar interossei",
    la: "musculi interossei plantares",
    shapes: [
      { t: "r", p: [[161, 392], [164, 326], [166, 286]], w: [12, 11, 9] },
      { t: "r", p: [[130, 398], [128, 330], [126, 290]], w: [12, 11, 9] },
      { t: "r", p: [[96, 404], [90, 336], [86, 298]], w: [12, 11, 9] },
    ],
    origin: "제3~5중족골 내측면 (단두)",
    insertion: "해당 족지 근위지골 저부 내측",
    action: "제2지 축으로 족지 내전 (ADduct)",
    nerve: "외측족저신경",
    notes: [],
  },
  {
    id: "dorsal-interossei",
    layer: 4,
    kind: "muscle",
    ko: "배측골간근",
    en: "dorsal interossei",
    la: "musculi interossei dorsales",
    shapes: [
      { t: "r", p: [[200, 392], [202, 328], [204, 290]], w: [13, 12, 10] },
      { t: "r", p: [[168, 392], [172, 328], [174, 288]], w: [13, 12, 10] },
      { t: "r", p: [[137, 396], [135, 330], [133, 290]], w: [13, 12, 10] },
      { t: "r", p: [[105, 400], [101, 334], [98, 294]], w: [13, 12, 10] },
    ],
    origin: "인접한 두 중족골 (양두)",
    insertion: "제2~4지 근위지골 저부",
    action: "제2지 축으로 족지 외전 (ABduct)",
    nerve: "외측족저신경",
    notes: ["가장 깊은 층이지만 중족골 사이라 배측에서도 만져진다"],
  },
  {
    id: "fibularis-longus-tendon",
    layer: 4,
    kind: "tendon",
    ko: "장비골근 힘줄",
    en: "fibularis (peroneus) longus tendon",
    la: "tendo musculi fibularis longi",
    shapes: [
      { t: "r", p: [[86, 440], [128, 420], [170, 408], [206, 402]], w: [11, 11, 11, 11] },
    ],
    origin: "근육 배는 종아리 외측 구획",
    insertion: "내측설상골, 제1중족골 저부",
    action: "제1중족골을 바닥으로 눌러 밀어차기 준비, 횡아치 지지",
    nerve: "천비골신경",
    notes: ["발바닥을 가로질러 외측에서 내측으로 건너간다"],
  },
  {
    id: "tibialis-posterior-tendon",
    layer: 4,
    kind: "tendon",
    ko: "후경골근 힘줄",
    en: "tibialis posterior tendon",
    la: "tendo musculi tibialis posterioris",
    shapes: [
      { t: "r", p: [[214, 522], [217, 480], [200, 452], [172, 432]], w: [12, 12, 10, 8] },
    ],
    origin: "근육 배는 종아리 후면 심부",
    insertion: "주상골 조면, 설상골, 제2~4중족골 저부",
    action: "내측 세로 아치의 주 지지자, 후족부 내번",
    nerve: "경골신경",
    notes: ["여기가 약해지면 무지외전근이 아치 지지를 떠맡는다"],
  },
];

/* ------------------------------ 뼈 ------------------------------- */

const BONES = [
  { p: [[150, 668], [152, 618], [158, 572]], w: [90, 86, 64] },
  { p: [[172, 542], [182, 500]], w: [68, 60] },
  { p: [[152, 470], [147, 428]], w: [108, 112] },
  { p: [[206, 400], [230, 278]], w: [20, 24] },
  { p: [[176, 394], [192, 264]], w: [15, 18] },
  { p: [[148, 398], [158, 268]], w: [14, 17] },
  { p: [[120, 406], [122, 278]], w: [13, 16] },
  { p: [[86, 400], [88, 290]], w: [20, 17] },
  { p: [[234, 258], [240, 210]], w: [22, 19] },
  { p: [[242, 200], [244, 170]], w: [17, 14] },
  { p: [[194, 252], [198, 182]], w: [13, 10] },
  { p: [[160, 256], [162, 190]], w: [12, 9] },
  { p: [[122, 266], [118, 200]], w: [12, 9] },
  { p: [[88, 282], [82, 226]], w: [13, 9] },
];

const OUTLINE =
  "M 150 692 C 112 692, 96 664, 98 626 C 101 566, 104 522, 102 478 " +
  "C 100 432, 68 400, 62 348 C 57 306, 54 280, 64 262 C 72 250, 90 246, 110 248 " +
  "L 200 244 C 226 242, 250 252, 252 274 C 255 298, 250 340, 240 388 " +
  "C 230 444, 216 504, 210 562 C 204 622, 190 692, 150 692 Z";

const TOES = [
  [218, 150, 38, 96, 18],
  [180, 168, 32, 80, 14],
  [146, 176, 30, 74, 13],
  [108, 186, 34, 68, 13],
  [72, 200, 32, 62, 13],
];

const BBOX = { x: 54, y: 150, w: 202, h: 542 };

/* ----------------------------- 컴포넌트 ----------------------------- */

export default function PlantarFootLocator() {
  const [layer, setLayer] = useState(1);
  const [showBones, setShowBones] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [pin, setPin] = useState(null);
  const [copied, setCopied] = useState(false);

  const svgRef = useRef(null);
  const shapeRefs = useRef({});

  const paths = useMemo(() => {
    const out = {};
    for (const s of STRUCTURES) out[s.id] = s.shapes.map(shapePath);
    return out;
  }, []);

  const bonePaths = useMemo(() => BONES.map((b) => ribbon(b.p, b.w)), []);
  const byId = useMemo(
    () => Object.fromEntries(STRUCTURES.map((s) => [s.id, s])),
    []
  );

  const toLocal = useCallback((evt) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(ctm.inverse());
    return [pt.x, pt.y];
  }, []);

  /** 한 점 아래에 놓인 모든 층의 구조를 깊이 순으로 수집 */
  const probe = useCallback((x, y) => {
    const hits = [];
    for (const s of STRUCTURES) {
      const els = shapeRefs.current[s.id] || [];
      let inside = false;
      for (const el of els) {
        if (!el) continue;
        try {
          if (el.isPointInFill(new DOMPoint(x, y))) {
            inside = true;
            break;
          }
        } catch {
          /* isPointInFill 미지원 환경 */
        }
      }
      if (inside) hits.push(s);
    }
    return hits.sort((a, b) => a.layer - b.layer);
  }, []);

  const handleClick = useCallback(
    (evt) => {
      const local = toLocal(evt);
      if (!local) return;
      const [x, y] = local;
      const hits = probe(x, y);
      setPin({ x, y, hits });
      const onLayer = hits.find((h) => h.layer === layer);
      setSelected(onLayer ? onLayer.id : hits[0] ? hits[0].id : null);
    },
    [toLocal, probe, layer]
  );

  const pickStructure = useCallback((id) => {
    setSelected(id);
    setLayer(byId[id].layer);
  }, [byId]);

  const exportText = useMemo(() => {
    if (!pin) return "";
    const nx = ((pin.x - BBOX.x) / BBOX.w).toFixed(2);
    const ny = ((pin.y - BBOX.y) / BBOX.h).toFixed(2);
    const lines = [
      "Region: plantar foot, right",
      `Point: (${nx}, ${ny}) normalized — 0,0 = 원위 외측`,
      `Radius: ~6mm (지시 불확실성)`,
    ];
    if (pin.hits.length === 0) {
      lines.push("Structures: none — 발 윤곽 밖이거나 구조가 매핑되지 않은 지점");
    } else {
      lines.push("Structures under this point (superficial → deep):");
      for (const h of pin.hits) {
        lines.push(`  L${h.layer}  ${h.en}  (${h.ko})  [${TISSUE[h.kind].label}]`);
      }
    }
    return lines.join("\n");
  }, [pin]);

  const copy = useCallback(() => {
    if (!exportText) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(exportText).then(done).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = exportText;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
  }, [exportText]);

  const sel = selected ? byId[selected] : null;
  const visible = STRUCTURES.filter((s) => s.layer === layer);

  const ink = "#1A1F1C";
  const paper = "#E9EBE6";
  const rule = "#C6CBC1";
  const accent = "#1E5F55";

  return (
    <div
      className="min-h-screen w-full p-6 md:p-10"
      style={{
        background: paper,
        color: ink,
        fontFamily:
          "ui-sans-serif, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
      }}
    >
      <style>{`
        .serif { font-family: 'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif; }
        .mono  { font-family: ui-monospace,'SF Mono',Menlo,Consolas,monospace; }
        .shape { transition: opacity .18s ease, fill .18s ease; cursor: pointer; }
        .shape:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .shape { transition: none; } }
      `}</style>

      <header className="max-w-5xl mx-auto mb-8">
        <div className="mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "#6B7469" }}>
          Plantar foot · right · 4 layers
        </div>
        <h1 className="serif text-3xl md:text-4xl mt-1">발바닥 층별 구조 탐색</h1>
        <p className="text-sm mt-3 max-w-xl leading-relaxed" style={{ color: "#4A544B" }}>
          발 위의 한 점을 누르면 그 아래 놓인 구조가 깊이 순으로 나옵니다.
          단일 정답이 아니라 후보 목록입니다.
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)] gap-8">
        {/* ---------------- 도해 ---------------- */}
        <div className="flex gap-4">
          {/* 깊이 레일 */}
          <div className="flex flex-col justify-center gap-1 pt-4">
            {LAYERS.map((l) => {
              const on = l.d === layer;
              const hit = pin?.hits.some((h) => h.layer === l.d);
              return (
                <button
                  key={l.d}
                  onClick={() => setLayer(l.d)}
                  className="group text-left w-[92px] px-2 py-2 border-l-2"
                  style={{
                    borderColor: on ? accent : hit ? "#9AA79B" : rule,
                    background: on ? "rgba(30,95,85,.07)" : "transparent",
                  }}
                >
                  <div className="mono text-[10px]" style={{ color: on ? accent : "#7A8379" }}>
                    L{l.d}
                  </div>
                  <div className="text-[11px] leading-tight" style={{ color: on ? ink : "#5C665D" }}>
                    {l.ko}
                  </div>
                  {hit && !on && (
                    <div className="mono text-[9px] mt-0.5" style={{ color: "#8A6A3B" }}>
                      ● 후보
                    </div>
                  )}
                </button>
              );
            })}
            <label className="flex items-center gap-2 mt-4 px-2 text-[11px] cursor-pointer" style={{ color: "#5C665D" }}>
              <input
                type="checkbox"
                checked={showBones}
                onChange={(e) => setShowBones(e.target.checked)}
                className="accent-current"
              />
              뼈 참조
            </label>
          </div>

          <svg
            ref={svgRef}
            viewBox="40 130 230 580"
            className="w-[300px] md:w-[340px] h-auto shrink-0"
            onClick={handleClick}
            role="img"
            aria-label="오른발 족저면 도해"
          >
            <path d={OUTLINE} fill="#DFE2DB" stroke={rule} strokeWidth="1" />
            {TOES.map(([x, y, w, h, rx], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={rx} fill="#DFE2DB" stroke={rule} strokeWidth="1" />
            ))}

            {showBones &&
              bonePaths.map((d, i) => (
                <path key={i} d={d} fill={TISSUE.bone.fill} opacity="0.28" pointerEvents="none" />
              ))}

            {STRUCTURES.map((s) => {
              const on = s.layer === layer;
              const isSel = s.id === selected;
              const isHov = s.id === hovered;
              return (
                <g
                  key={s.id}
                  opacity={on ? 1 : 0}
                  pointerEvents={on ? "auto" : "none"}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {paths[s.id].map((d, i) => (
                    <path
                      key={i}
                      ref={(el) => {
                        if (!shapeRefs.current[s.id]) shapeRefs.current[s.id] = [];
                        shapeRefs.current[s.id][i] = el;
                      }}
                      d={d}
                      className="shape"
                      tabIndex={on && i === 0 ? 0 : -1}
                      role={i === 0 ? "button" : undefined}
                      aria-label={i === 0 ? s.ko : undefined}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(s.id);
                        }
                      }}
                      fill={TISSUE[s.kind].fill}
                      fillOpacity={isSel ? 0.95 : isHov ? 0.8 : 0.62}
                      stroke={isSel ? accent : "#5F6A5F"}
                      strokeWidth={isSel ? 2 : 0.7}
                      strokeOpacity={isSel ? 1 : 0.5}
                    />
                  ))}
                </g>
              );
            })}

            {pin && (
              <g pointerEvents="none">
                <circle cx={pin.x} cy={pin.y} r="14" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.45" />
                <circle cx={pin.x} cy={pin.y} r="3" fill={accent} />
              </g>
            )}
          </svg>
        </div>

        {/* ---------------- 패널 ---------------- */}
        <div className="min-w-0">
          {/* 코어 리드아웃 */}
          <section className="mb-7">
            <div className="mono text-[10px] tracking-[0.16em] uppercase mb-3" style={{ color: "#6B7469" }}>
              지시 지점 · core readout
            </div>
            {!pin ? (
              <div className="text-sm py-6 px-4 border border-dashed leading-relaxed" style={{ borderColor: rule, color: "#6B7469" }}>
                발 도해를 눌러 지점을 지정하세요. 그 아래 놓인 모든 층의 구조가 나열됩니다.
              </div>
            ) : (
              <div className="border" style={{ borderColor: rule }}>
                {LAYERS.map((l) => {
                  const hs = pin.hits.filter((h) => h.layer === l.d);
                  return (
                    <div
                      key={l.d}
                      className="flex items-stretch border-b last:border-b-0"
                      style={{ borderColor: rule, background: l.d === layer ? "rgba(30,95,85,.05)" : "transparent" }}
                    >
                      <div className="mono text-[10px] px-2.5 py-2.5 w-11 shrink-0 border-r" style={{ borderColor: rule, color: "#7A8379" }}>
                        L{l.d}
                      </div>
                      <div className="px-3 py-2 flex-1 min-w-0">
                        {hs.length === 0 ? (
                          <span className="text-[12px]" style={{ color: "#9AA096" }}>—</span>
                        ) : (
                          hs.map((h) => (
                            <button
                              key={h.id}
                              onClick={() => pickStructure(h.id)}
                              className="block text-left w-full py-0.5"
                            >
                              <span className="text-[13px]" style={{ color: h.id === selected ? accent : ink, fontWeight: h.id === selected ? 600 : 400 }}>
                                {h.ko}
                              </span>
                              <span className="mono text-[11px] ml-2" style={{ color: "#7A8379" }}>
                                {h.en}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 구조 상세 */}
          {sel && (
            <section className="mb-7 pt-6 border-t" style={{ borderColor: rule }}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="serif text-2xl">{sel.ko}</h2>
                <span
                  className="mono text-[10px] px-1.5 py-0.5"
                  style={{ background: TISSUE[sel.kind].fill, color: "#FFF" }}
                >
                  {TISSUE[sel.kind].label}
                </span>
              </div>
              <div className="mono text-[12px] mt-1" style={{ color: "#5C665D" }}>
                {sel.en}
              </div>
              <div className="mono text-[11px] italic" style={{ color: "#8A9186" }}>
                {sel.la}
              </div>

              <dl className="mt-4 text-[13px] leading-relaxed grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-1.5">
                {[
                  ["기시", sel.origin],
                  ["정지", sel.insertion],
                  ["작용", sel.action],
                  ["신경", sel.nerve],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt className="mono text-[11px] pt-0.5" style={{ color: "#7A8379" }}>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>

              {sel.notes.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {sel.notes.map((n, i) => (
                    <li key={i} className="text-[12.5px] pl-3 border-l-2 leading-relaxed" style={{ borderColor: "#C4A45E", color: "#4A544B" }}>
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* 내보내기 */}
          {pin && (
            <section className="pt-6 border-t" style={{ borderColor: rule }}>
              <div className="flex items-center justify-between mb-2">
                <div className="mono text-[10px] tracking-[0.16em] uppercase" style={{ color: "#6B7469" }}>
                  내보내기
                </div>
                <button
                  onClick={copy}
                  className="mono text-[11px] px-2.5 py-1 border"
                  style={{ borderColor: accent, color: copied ? "#FFF" : accent, background: copied ? accent : "transparent" }}
                >
                  {copied ? "복사됨" : "복사"}
                </button>
              </div>
              <pre
                className="mono text-[11px] leading-relaxed p-3 overflow-x-auto whitespace-pre"
                style={{ background: "#DFE2DB", color: "#2C332C" }}
              >
                {exportText}
              </pre>
              <p className="text-[11.5px] mt-2 leading-relaxed" style={{ color: "#7A8379" }}>
                이 블록을 사람이나 LLM에게 그대로 넘기면 "엄지발가락 라인 발바닥 근육" 같은 표현을 대체할 수 있습니다.
              </p>
            </section>
          )}

          {/* 층 목록 */}
          <section className="pt-6 mt-7 border-t" style={{ borderColor: rule }}>
            <div className="mono text-[10px] tracking-[0.16em] uppercase mb-3" style={{ color: "#6B7469" }}>
              L{layer} · {LAYERS[layer].ko} — {visible.length}개
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visible.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="text-[12px] px-2 py-1 border"
                  style={{
                    borderColor: s.id === selected ? accent : rule,
                    background: s.id === selected ? "rgba(30,95,85,.08)" : "transparent",
                    color: s.id === selected ? accent : "#4A544B",
                  }}
                >
                  {s.ko}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto mt-12 pt-5 border-t text-[11.5px] leading-relaxed" style={{ borderColor: rule, color: "#7A8379" }}>
        형태는 모식도입니다. 위치 관계와 층 순서를 보기 위한 것이지 실측 도해가 아닙니다.
        구조를 가리키는 도구이며 증상의 원인을 판단하지 않습니다.
      </footer>
    </div>
  );
}
