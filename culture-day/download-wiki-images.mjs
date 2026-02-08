import fs from "fs";
import path from "path";

const INPUT_JSON = "data/locations.json";
const OUT_DIR = path.join("public", "images", "locations");
const UPDATED_JSON = "locations.with-images.json";

fs.mkdirSync(OUT_DIR, { recursive: true });

function encodeTitle(title) {
  return encodeURIComponent(title.replace(/\s+/g, " ").trim());
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "image-downloader/1.0 (personal project)" },
  });
  if (!res.ok) return null;
  return res.json();
}

// 1) MediaWiki search -> returns best page title
async function searchBestTitle(query, lang) {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: "1",
      format: "json",
      origin: "*",
    }).toString();

  const data = await fetchJson(url);
  const hit = data?.query?.search?.[0];
  return hit?.title || null;
}

// 2) REST summary by exact title
async function fetchSummaryByExactTitle(exactTitle, lang) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeTitle(exactTitle)}`;
  return fetchJson(url);
}

// Try to resolve: name -> exact title -> summary (FR then EN)
async function resolveSummary(name) {
  // A) FR search
  let exact = await searchBestTitle(name, "fr");
  if (exact) {
    const sum = await fetchSummaryByExactTitle(exact, "fr");
    if (sum?.thumbnail?.source) {
      return { ...sum, _lang: "fr", _exactTitle: exact };
    }
  }

  // B) EN search
  exact = await searchBestTitle(name, "en");
  if (exact) {
    const sum = await fetchSummaryByExactTitle(exact, "en");
    if (sum?.thumbnail?.source) {
      return { ...sum, _lang: "en", _exactTitle: exact };
    }
  }

  // C) last resort: try original as title
  const frTry = await fetchSummaryByExactTitle(name, "fr");
  if (frTry?.thumbnail?.source) return { ...frTry, _lang: "fr", _exactTitle: name };

  const enTry = await fetchSummaryByExactTitle(name, "en");
  if (enTry?.thumbnail?.source) return { ...enTry, _lang: "en", _exactTitle: name };

  return null;
}

async function downloadFile(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

const leaders = JSON.parse(fs.readFileSync(INPUT_JSON, "utf8"));

const updated = await mapLimit(leaders, 5, async (item) => {
  const { name, id } = item;

  try {
    const sum = await resolveSummary(name);
    if (!sum?.thumbnail?.source) {
      console.log(`⚠️ No thumbnail found for: ${name}`);
      return { ...item, image: item.image || "" };
    }

    const imgUrl = sum.thumbnail.source;
    const ext = extFromUrl(imgUrl);
    const filename = `${id}${ext}`;
    const filepath = path.join(OUT_DIR, filename);

    if (!fs.existsSync(filepath)) {
      await downloadFile(imgUrl, filepath);
      console.log(`✅ ${name} -> ${filepath} (${sum._lang}) [${sum._exactTitle}]`);
    } else {
      console.log(`↩️ Exists: ${filepath}`);
    }

    return {
      ...item,
      image: `/images/locations/${filename}`, // <- make sure this matches OUT_DIR
      image_source: sum.content_urls?.desktop?.page || "",
      image_lang: sum._lang,
      wiki_title: sum._exactTitle,
    };
  } catch (e) {
    console.log(`❌ Failed for ${name}: ${e.message}`);
    return { ...item, image: item.image || "" };
  }
});

fs.writeFileSync(UPDATED_JSON, JSON.stringify(updated, null, 2), "utf8");
console.log(`\nDone. Updated JSON: ${UPDATED_JSON}`);
