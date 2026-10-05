// ============================================================
// MULTILINGUAL PRODUCT SEARCH UTILITY
// Hỗ trợ tìm kiếm sản phẩm bằng Tiếng Việt (có dấu / không dấu),
// Tiếng Anh (English), Tiếng Nhật (Japanese), Tiếng Hàn (Korean),
// Tiếng Trung (Chinese), Tiếng Pháp (French)...
// ============================================================

// Hàm bỏ dấu tiếng Việt để so sánh chuỗi không dấu
export function removeVietnameseAccents(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Bảng từ đồng nghĩa đa ngôn ngữ cho ngành may mặc & đồng phục
export const MULTILINGUAL_SYNONYMS = {
  // Sơ mi
  "shirt": ["so mi", "sơ mi", "somi"],
  "shirts": ["so mi", "sơ mi", "somi"],
  "button down": ["so mi", "sơ mi"],
  "dress shirt": ["so mi", "sơ mi"],
  "chemise": ["so mi", "sơ mi"],
  "셔츠": ["so mi", "sơ mi"],
  "와이셔츠": ["so mi", "sơ mi"],
  "シャツ": ["so mi", "sơ mi"],
  "ワイシャツ": ["so mi", "sơ mi"],
  "衬衫": ["so mi", "sơ mi"],
  "襯衫": ["so mi", "sơ mi"],

  // Áo Polo
  "polo": ["polo", "ao polo", "co be"],
  "polos": ["polo", "ao polo"],
  "polo shirt": ["polo", "ao polo"],
  "폴로": ["polo", "ao polo"],
  "폴로셔츠": ["polo", "ao polo"],
  "ポロ": ["polo", "ao polo"],
  "ポロシャツ": ["polo", "ao polo"],
  "保罗衫": ["polo", "ao polo"],
  "polo衫": ["polo", "ao polo"],

  // Áo thun / Áo phông / T-shirt
  "t-shirt": ["thun", "phong", "ao phong", "ao thun"],
  "tshirt": ["thun", "phong", "ao phong", "ao thun"],
  "t shirt": ["thun", "phong", "ao phong", "ao thun"],
  "tee": ["thun", "phong", "ao phong", "ao thun"],
  "tees": ["thun", "phong", "ao phong", "ao thun"],
  "티셔츠": ["thun", "phong", "ao phong", "ao thun"],
  "tシャツ": ["thun", "phong", "ao phong", "ao thun"],
  "t恤": ["thun", "phong", "ao phong", "ao thun"],

  // Vest / Suit / Blazer
  "suit": ["vest", "comple", "veston"],
  "suits": ["vest", "comple", "veston"],
  "blazer": ["vest", "blazer", "khoac vest"],
  "blazers": ["vest", "blazer"],
  "tuxedo": ["vest", "comple"],
  "정장": ["vest", "comple"],
  "수트": ["vest", "comple"],
  "블레이저": ["vest", "blazer"],
  "スーツ": ["vest", "comple"],
  "ブレザー": ["vest", "blazer"],
  "西装": ["vest", "comple"],
  "西服": ["vest", "comple"],

  // Quần âu / Quần tây / Pants / Trousers
  "pant": ["quan", "quan au", "quan tay"],
  "pants": ["quan", "quan au", "quan tay"],
  "trouser": ["quan", "quan au", "quan tay"],
  "trousers": ["quan", "quan au", "quan tay"],
  "slacks": ["quan", "quan au", "quan tay"],
  "pantalon": ["quan", "quan au", "quan tay"],
  "바지": ["quan", "quan au", "quan tay"],
  "팬츠": ["quan", "quan au", "quan tay"],
  "パンツ": ["quan", "quan au", "quan tay"],
  "スラックス": ["quan", "quan au", "quan tay"],
  "裤子": ["quan", "quan au", "quan tay"],
  "西裤": ["quan", "quan au", "quan tay"],

  // Váy / Chân váy / Skirt / Dress
  "skirt": ["vay", "chan vay", "dam"],
  "skirts": ["vay", "chan vay", "dam"],
  "dress": ["vay", "dam", "chan vay"],
  "dresses": ["vay", "dam"],
  "치마": ["vay", "chan vay"],
  "스커트": ["vay", "chan vay"],
  "드레스": ["vay", "dam"],
  "スカート": ["vay", "chan vay"],
  "ワンピース": ["vay", "dam"],
  "裙子": ["vay", "chan vay"],
  "短裙": ["vay", "chan vay"],
  "连衣裙": ["vay", "dam"],

  // Áo khoác / Áo gió / Jacket
  "jacket": ["khoac", "gio", "ao gio", "ao khoac"],
  "jackets": ["khoac", "gio", "ao gio", "ao khoac"],
  "windbreaker": ["gio", "ao gio", "khoac gio"],
  "outerwear": ["khoac", "ao khoac"],
  "coat": ["khoac", "mang to"],
  "자켓": ["khoac", "ao khoac"],
  "바람막이": ["gio", "ao gio"],
  "점퍼": ["khoac", "ao khoac"],
  "ジャケット": ["khoac", "ao khoac"],
  "ウィンドブレーカー": ["gio", "ao gio"],
  "ジャンパー": ["khoac", "ao khoac"],
  "夹克": ["khoac", "ao khoac"],
  "风衣": ["gio", "ao gio"],

  // Tạp dề / Apron
  "apron": ["tap de", "tạp dề"],
  "aprons": ["tap de", "tạp dề"],
  "tablier": ["tap de", "tạp dề"],
  "앞치마": ["tap de", "tạp dề"],
  "에이프런": ["tap de", "tạp dề"],
  "エプロン": ["tap de", "tạp dề"],
  "前掛け": ["tap de", "tạp dề"],
  "围裙": ["tap de", "tạp dề"],

  // Mũ / Nón / Cap / Hat
  "cap": ["mu luoi trai", "non ket", "mu non"],
  "caps": ["mu luoi trai", "non ket", "mu non"],
  "hat": ["mu non", "non ket", "mu luoi trai"],
  "hats": ["mu non", "non ket", "mu luoi trai"],
  "baseball cap": ["mu luoi trai", "non ket"],
  "casquette": ["mu luoi trai", "non ket"],
  "모자": ["mu luoi trai", "non ket", "mu non"],
  "캡": ["mu luoi trai", "non ket"],
  "帽子": ["mu luoi trai", "non ket", "mu non"],
  "キャップ": ["mu luoi trai", "non ket"],

  // Bảo hộ lao động / Workwear
  "workwear": ["bao ho", "lao dong", "cong nhan", "ky su"],
  "safety": ["bao ho", "an toan"],
  "protective": ["bao ho"],
  "coverall": ["bao ho", "lien than"],
  "uniform": ["dong phuc"],
  "uniforms": ["dong phuc"],
  "작업복": ["bao ho", "lao dong"],
  "안전복": ["bao ho"],
  "作業服": ["bao ho", "lao dong"],
  "安全服": ["bao ho"],
  "劳保服": ["bao ho", "lao dong"],
  "工作服": ["dong phuc", "lao dong"],

  // Y tế / Medical / Scrub
  "medical": ["y te", "bac si", "dieu duong", "scrub", "benh vien"],
  "scrub": ["scrub", "y te", "phau thuat"],
  "scrubs": ["scrub", "y te"],
  "doctor": ["bac si", "blouse", "y te"],
  "nurse": ["dieu duong", "y ta", "y te"],
  "hospital": ["benh vien", "y te"],
  "clinic": ["phong kham", "y te"],
  "의료": ["y te"],
  "스크럽": ["scrub", "y te"],
  "의사": ["bac si", "y te"],
  "간호사": ["dieu duong", "y te"],
  "医療": ["y te"],
  "スクラブ": ["scrub", "y te"],
  "白衣": ["blouse", "bac si"],
  "医护": ["y te", "bac si"],
  "白大褂": ["blouse", "bac si"],

  // Nhà hàng / Bếp / Chef / Restaurant / Spa
  "chef": ["bep", "dau bep", "ao bep"],
  "cook": ["bep", "nau an"],
  "kitchen": ["bep"],
  "restaurant": ["nha hang", "f&b", "phuc vu"],
  "hotel": ["khach san", "le tan"],
  "spa": ["spa", "tham my"],
  "barista": ["barista", "pha che", "ca phe"],
  "waiter": ["phuc vu", "boi ban"],
  "waitress": ["phuc vu"],
  "조리": ["bep", "nau an"],
  "셰프": ["bep", "dau bep"],
  "식당": ["nha hang"],
  "호텔": ["khach san"],
  "シェフ": ["bep", "dau bep"],
  "コック": ["bep"],
  "レストラン": ["nha hang"],
  "ホテル": ["khach san"],
  "厨师": ["bep", "dau bep"],
  "餐饮": ["nha hang", "f&b"],
  "酒店": ["khach san"],

  // Học sinh / Trường học / School
  "school": ["hoc sinh", "truong hoc", "sinh vien"],
  "student": ["hoc sinh", "sinh vien"],
  "pupil": ["hoc sinh"],
  "교복": ["hoc sinh", "dong phuc"],
  "학생": ["hoc sinh"],
  "学校": ["truong hoc"],
  "学生服": ["hoc sinh"],
  "校服": ["hoc sinh"],

  // Thể thao / Sport / Golf
  "sport": ["the thao", "the duc"],
  "sports": ["the thao"],
  "sportswear": ["the thao"],
  "golf": ["golf", "ao golf"],
  "tennis": ["tennis"],
  "gym": ["gym", "tap luyen"],
  "running": ["chay bo", "the thao"],
  "스포츠": ["the thao"],
  "골프": ["golf"],
  "スポーツ": ["the thao"],
  "ゴルフ": ["golf"],
  "运动": ["the thao"],
  "高尔夫": ["golf"],

  // Chất liệu vải (Fabric materials)
  "cotton": ["cotton", "compact"],
  "kate": ["kate", "kate y", "kate my"],
  "bamboo": ["bamboo", "tre"],
  "modal": ["modal", "go soi"],
  "spandex": ["spandex", "co gian"],
  "linen": ["linen", "dui"],
  "khaki": ["kaki", "khaki"],
  "kaki": ["kaki", "khaki"],
  "denim": ["denim", "jean"],
  "silk": ["lua", "silk"],
  "wool": ["da", "len", "wool"],
  "polyester": ["poly", "polyester"],
  "dri-fit": ["me", "me the thao", "dri-fit"],

  // Kiểu tay áo
  "short sleeve": ["ngan tay", "tay ngan"],
  "short-sleeve": ["ngan tay", "tay ngan"],
  "long sleeve": ["dai tay", "tay dai"],
  "long-sleeve": ["dai tay", "tay dai"],
  "sleeveless": ["sat nach", "gile"],
  "veste": ["gile", "vest"],
  "gilet": ["gile"],

  // Màu sắc (Colors)
  "white": ["trang", "trắng"],
  "black": ["den", "đen"],
  "blue": ["xanh", "xanh duong", "xanh bien"],
  "navy": ["navy", "xanh den", "xanh dam"],
  "red": ["do", "đỏ"],
  "burgundy": ["do do", "đỏ đô"],
  "grey": ["xam", "ghi"],
  "gray": ["xam", "ghi"],
  "yellow": ["vang", "vàng"],
  "green": ["xanh la", "xanh cay"]
};

/**
 * Mở rộng từ khóa tìm kiếm sang các từ khóa tiếng Việt tương đương
 */
export function expandSearchKeywords(query) {
  if (!query || typeof query !== "string") return [];
  const clean = query.trim().toLowerCase();
  const unaccented = removeVietnameseAccents(clean);

  const keywords = new Set();

  // Tra cứu theo cụm từ đầy đủ
  if (MULTILINGUAL_SYNONYMS[clean]) {
    MULTILINGUAL_SYNONYMS[clean].forEach((kw) => {
      keywords.add(kw);
      keywords.add(removeVietnameseAccents(kw));
    });
    // Giữ lại từ gốc nếu là tiếng Việt hoặc từ khóa thương hiệu
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(clean)) {
      keywords.add(clean);
    }
  } else {
    keywords.add(clean);
    keywords.add(unaccented);
  }

  // Tra cứu từng từ đơn lẻ trong truy vấn nếu người dùng gõ câu dài (ví dụ "blue polo shirt")
  const tokens = clean.split(/\s+/);
  if (tokens.length > 1) {
    tokens.forEach((token) => {
      if (MULTILINGUAL_SYNONYMS[token]) {
        MULTILINGUAL_SYNONYMS[token].forEach((kw) => {
          keywords.add(kw);
          keywords.add(removeVietnameseAccents(kw));
        });
      } else {
        keywords.add(token);
        keywords.add(removeVietnameseAccents(token));
      }
    });
  }

  return Array.from(keywords);
}

function containsKeyword(text, keyword) {
  if (!text || !keyword) return false;
  if (keyword.length <= 3) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s|[-_.,/()]+)${escaped}($|\\s|[-_.,/()]+)`, "i");
    return regex.test(text);
  }
  return text.includes(keyword);
}

/**
 * Kiểm tra xem một sản phẩm có khớp với truy vấn tìm kiếm đa ngôn ngữ hay không
 */
export function isProductMatchMultilingual(product, query) {
  if (!query || !query.trim()) return true;
  if (!product) return false;

  const searchKeywords = expandSearchKeywords(query);

  const titleNorm = (product.title || "").toLowerCase();
  const titleUnaccented = removeVietnameseAccents(product.title || "");
  const materialNorm = (product.material || "").toLowerCase();
  const materialUnaccented = removeVietnameseAccents(product.material || "");
  const categoryNorm = (product.category || "").toLowerCase();
  const descNorm = (product.description || "").toLowerCase();
  const descUnaccented = removeVietnameseAccents(product.description || "");
  const skuNorm = (product.sku || "").toLowerCase();
  const badgeNorm = (product.badge || "").toLowerCase();

  for (const kw of searchKeywords) {
    if (!kw) continue;
    if (
      containsKeyword(titleNorm, kw) ||
      containsKeyword(titleUnaccented, kw) ||
      containsKeyword(materialNorm, kw) ||
      containsKeyword(materialUnaccented, kw) ||
      containsKeyword(categoryNorm, kw) ||
      containsKeyword(descNorm, kw) ||
      containsKeyword(descUnaccented, kw) ||
      containsKeyword(skuNorm, kw) ||
      containsKeyword(badgeNorm, kw)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Lọc danh sách sản phẩm theo truy vấn đa ngôn ngữ
 */
export function searchProductsMultilingual(products, query, limit = 0) {
  if (!Array.isArray(products)) return [];
  if (!query || !query.trim()) return limit > 0 ? products.slice(0, limit) : products;

  const results = products.filter((p) => isProductMatchMultilingual(p, query));
  return limit > 0 ? results.slice(0, limit) : results;
}
