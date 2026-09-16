#!/usr/bin/env node
/**
 * Freedom Club Course Scraper — Cookie-based API approach
 * Bypasses Cloudflare by using your session cookie directly with Circle.so's API.
 *
 * Usage:
 *   node scrape-freedom-club.cjs <your_session_cookie>
 *
 * To get your cookie:
 *   1. Open app.freedomclub.com in Chrome
 *   2. DevTools (Cmd+Option+I) → Application → Cookies
 *   3. Copy the full Cookie header (or just _circle_session value)
 *
 * Alternative: export from DevTools Network tab — copy any request as cURL,
 *   then grab the Cookie header value.
 */

const fs = require("fs");
const path = require("path");

const COMMUNITY_ID = 79216; // from the page source
const BASE_URL = "https://app.freedomclub.com";
const OUTPUT_FILE = path.join(__dirname, "freedom-club-lessons.md");
const DELAY = 1500;

// Get cookie from command line or environment
const COOKIE = process.argv[2] || process.env.FREEDOM_CLUB_COOKIE;

if (!COOKIE) {
  console.log(`
Usage: node scrape-freedom-club.cjs "<your_cookie_string>"

How to get your cookie:
  1. Open app.freedomclub.com in Chrome (logged in)
  2. DevTools (Cmd+Option+I) → Network tab
  3. Refresh the page
  4. Click any request to app.freedomclub.com
  5. In Headers, find "Cookie:" and copy the ENTIRE value
  6. Paste it as an argument (in quotes)

Example:
  node scrape-freedom-club.cjs "_circle_session=abc123; _cfuvid=xyz..."
`);
  process.exit(1);
}

const headers = {
  Cookie: COOKIE,
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
  Referer: `${BASE_URL}/c/30-day-first-sale-challenge`,
};

async function fetchJSON(url) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${url}: ${text.substring(0, 200)}`);
  }
  return res.json();
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: { ...headers, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function extractTextFromHTML(html) {
  // Simple HTML to text: strip tags, decode entities, clean up whitespace
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "**")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🔍 Discovering course structure via Circle.so API...\n");

  // Strategy 1: Try Circle's internal API for course/space content
  // Circle.so spaces have an API at /api/v1/ or internal endpoints

  // First, let's try to find the space/course ID
  let spaceId = null;
  let sections = [];

  // Try the internal API that the React app uses
  try {
    console.log("Trying Circle internal API...");
    const spacesData = await fetchJSON(
      `${BASE_URL}/api/v1/spaces?community_id=${COMMUNITY_ID}`
    );
    console.log(`Found ${spacesData.length || "?"} spaces`);

    // Find the 30-day challenge space
    const challenge = Array.isArray(spacesData)
      ? spacesData.find(
          (s) =>
            s.slug === "30-day-first-sale-challenge" ||
            s.name?.includes("30-Day") ||
            s.name?.includes("First Sale")
        )
      : null;

    if (challenge) {
      spaceId = challenge.id;
      console.log(`Found course: "${challenge.name}" (ID: ${spaceId})\n`);
    }
  } catch (e) {
    console.log(`  Spaces API: ${e.message}\n`);
  }

  // Strategy 2: Try course-specific endpoints
  if (!spaceId) {
    try {
      console.log("Trying course sections endpoint...");
      // Circle courses sometimes use /api/courses/ or similar
      const courseData = await fetchJSON(
        `${BASE_URL}/api/v1/course/30-day-first-sale-challenge`
      );
      console.log("Found course data:", Object.keys(courseData));
      spaceId = courseData.id || courseData.space_id;
    } catch (e) {
      console.log(`  Course API: ${e.message}\n`);
    }
  }

  // Strategy 3: Scrape the HTML page for lesson links and embedded JSON data
  console.log("Fetching course page HTML for embedded data...");
  try {
    const html = await fetchHTML(
      `${BASE_URL}/c/30-day-first-sale-challenge`
    );

    // Circle React apps embed initial data as JSON in the page
    // Look for data-props with course/section/lesson info
    const propsMatch = html.match(/data-props="([^"]+)"/g);
    if (propsMatch) {
      for (const match of propsMatch) {
        const jsonStr = match
          .replace('data-props="', "")
          .replace(/"$/, "")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&");
        try {
          const data = JSON.parse(jsonStr);
          if (data.space_id || data.course || data.sections) {
            spaceId = spaceId || data.space_id || data.course?.id;
            if (data.sections) sections = data.sections;
            console.log(
              `Found embedded data: space_id=${spaceId}, sections=${sections.length}`
            );
          }
        } catch (pe) {
          // Not all data-props are relevant JSON
        }
      }
    }

    // Also look for __NEXT_DATA__ or similar SSR data
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
    );
    if (nextDataMatch) {
      const nextData = JSON.parse(nextDataMatch[1]);
      console.log("Found Next.js data");
    }

    // Look for lesson URLs in the HTML
    const lessonUrls = [];
    const linkRegex = /href="(\/c\/30-day-first-sale-challenge\/[^"]+)"/g;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      if (!lessonUrls.includes(match[1])) {
        lessonUrls.push(match[1]);
      }
    }

    if (lessonUrls.length > 0) {
      console.log(`Found ${lessonUrls.length} lesson URLs in HTML\n`);
    }

    // Save the HTML for inspection if we need to debug
    fs.writeFileSync("debug-course-page.html", html);
    console.log("Saved course page HTML to debug-course-page.html\n");
  } catch (e) {
    console.log(`  HTML fetch: ${e.message}\n`);
  }

  // Strategy 4: Try various Circle API patterns
  const apiPaths = [
    `/api/v1/spaces/30-day-first-sale-challenge/course_sections`,
    `/api/v1/spaces/${spaceId || "30-day-first-sale-challenge"}/posts`,
    `/api/v1/community_members/me/spaces`,
    `/internal/api/v1/spaces/30-day-first-sale-challenge`,
    `/api/headless/v1/spaces/30-day-first-sale-challenge`,
    `/api/headless/v1/space_groups`,
  ];

  for (const apiPath of apiPaths) {
    try {
      console.log(`Trying ${apiPath}...`);
      const data = await fetchJSON(`${BASE_URL}${apiPath}`);
      console.log(
        `  ✅ Success! Keys: ${JSON.stringify(Object.keys(data)).substring(0, 200)}`
      );

      // Save successful response for analysis
      const safeName = apiPath.replace(/[\/]/g, "_").replace(/^_/, "");
      fs.writeFileSync(
        `debug-api-${safeName}.json`,
        JSON.stringify(data, null, 2)
      );
      console.log(`  Saved to debug-api-${safeName}.json\n`);
    } catch (e) {
      console.log(`  ❌ ${e.message.substring(0, 100)}\n`);
    }
    await sleep(500);
  }

  // Strategy 5: If we found sections/lessons, fetch each lesson's content
  if (sections.length > 0) {
    console.log(`\n📚 Fetching ${sections.length} sections...\n`);
    let markdown = `# Freedom Club — 30-Day First Sale Challenge\n`;
    markdown += `_Scraped on ${new Date().toISOString().split("T")[0]}_\n\n---\n\n`;

    for (const section of sections) {
      markdown += `## ${section.name || section.title || "Section"}\n\n`;

      const lessons = section.lessons || section.posts || section.items || [];
      for (const lesson of lessons) {
        console.log(`  → ${lesson.name || lesson.title}`);
        markdown += `### ${lesson.name || lesson.title}\n\n`;

        // Try to fetch individual lesson content
        try {
          const lessonData = await fetchJSON(
            `${BASE_URL}/api/v1/posts/${lesson.id || lesson.post_id}`
          );
          if (lessonData.body?.html || lessonData.body?.text) {
            const text =
              extractTextFromHTML(lessonData.body.html) ||
              lessonData.body.text;
            markdown += `${text}\n\n`;
          }
        } catch (e) {
          markdown += `_Could not fetch lesson content: ${e.message}_\n\n`;
        }

        markdown += `---\n\n`;
        await sleep(DELAY);
      }
    }

    fs.writeFileSync(OUTPUT_FILE, markdown);
    console.log(`\n✅ Saved to ${OUTPUT_FILE}`);
  } else {
    console.log("\n⚠️  Could not auto-discover course structure.");
    console.log("Check the debug files for clues about the API structure:");
    console.log("  - debug-course-page.html");
    console.log("  - debug-api-*.json");
    console.log(
      "\nI'll analyze these files to find the right API endpoints."
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
