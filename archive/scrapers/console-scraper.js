// PASTE THIS ENTIRE SCRIPT INTO YOUR BROWSER CONSOLE ON app.freedomclub.com
// It will fetch all lessons and download a markdown file with the content.

(async () => {
  const SPACE_ID = 1240289;
  const BASE = '';
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const log = (msg) => console.log(`%c[Scraper] ${msg}`, 'color: #4CAF50; font-weight: bold');

  log('Starting course scrape...');

  // Step 1: Fetch the space/course data
  log('Fetching space data...');
  const spaceRes = await fetch(`${BASE}/internal_api/spaces/${SPACE_ID}`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  });
  const spaceData = await spaceRes.json();
  log(`Course: ${spaceData.name || 'Found'}`);

  // Step 2: Find course sections - try multiple endpoint patterns
  let sections = [];
  let lessons = [];

  // Try getting course sections
  const sectionEndpoints = [
    `/internal_api/spaces/${SPACE_ID}/course_sections`,
    `/internal_api/spaces/${SPACE_ID}/sections`,
    `/internal_api/course_sections?space_id=${SPACE_ID}`,
  ];

  for (const endpoint of sectionEndpoints) {
    try {
      log(`Trying ${endpoint}...`);
      const res = await fetch(endpoint, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          sections = data;
        } else if (data.records) {
          sections = data.records;
        } else if (data.course_sections) {
          sections = data.course_sections;
        } else if (data.sections) {
          sections = data.sections;
        }
        if (sections.length > 0) {
          log(`Found ${sections.length} sections!`);
          break;
        }
      }
    } catch (e) {
      // try next
    }
  }

  // If sections found, also check if they contain lessons directly
  if (sections.length === 0 && spaceData.course_sections) {
    sections = spaceData.course_sections;
    log(`Found ${sections.length} sections in space data`);
  }

  // If still no sections, try fetching posts/lessons directly
  if (sections.length === 0) {
    log('No sections found, trying to fetch posts directly...');
    const postEndpoints = [
      `/internal_api/spaces/${SPACE_ID}/posts?per_page=100&sort=oldest`,
      `/internal_api/posts?space_id=${SPACE_ID}&per_page=100&sort=oldest`,
      `/internal_api/spaces/${SPACE_ID}/course_lessons?per_page=100`,
    ];

    for (const endpoint of postEndpoints) {
      try {
        log(`Trying ${endpoint}...`);
        const res = await fetch(endpoint, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            lessons = data;
          } else if (data.records) {
            lessons = data.records;
          } else if (data.posts) {
            lessons = data.posts;
          }
          if (lessons.length > 0) {
            log(`Found ${lessons.length} lessons!`);
            break;
          }
        }
      } catch (e) {
        // try next
      }
    }
  }

  // Step 3: If we have sections, fetch lessons for each section
  if (sections.length > 0 && lessons.length === 0) {
    log('Fetching lessons for each section...');
    for (const section of sections) {
      const sectionId = section.id;
      const sectionLessonEndpoints = [
        `/internal_api/course_sections/${sectionId}/lessons`,
        `/internal_api/course_sections/${sectionId}/posts`,
        `/internal_api/spaces/${SPACE_ID}/posts?section_id=${sectionId}&per_page=100`,
      ];

      for (const endpoint of sectionLessonEndpoints) {
        try {
          const res = await fetch(endpoint, {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.records || data.posts || data.lessons || []);
            if (items.length > 0) {
              section._lessons = items;
              log(`  Section "${section.name || section.title}": ${items.length} lessons`);
              break;
            }
          }
        } catch (e) {
          // try next
        }
      }

      // Check if lessons are already embedded in the section
      if (!section._lessons && (section.lessons || section.posts || section.course_lessons)) {
        section._lessons = section.lessons || section.posts || section.course_lessons;
        log(`  Section "${section.name || section.title}": ${section._lessons.length} lessons (embedded)`);
      }

      await delay(500);
    }
  }

  // Step 4: Fetch individual lesson content
  log('Fetching individual lesson content...');
  const allLessons = [];

  const fetchLessonContent = async (lesson) => {
    const lessonId = lesson.id || lesson.post_id;
    if (!lessonId) return lesson;

    const contentEndpoints = [
      `/internal_api/posts/${lessonId}`,
      `/internal_api/course_lessons/${lessonId}`,
      `/internal_api/spaces/${SPACE_ID}/posts/${lessonId}`,
    ];

    for (const endpoint of contentEndpoints) {
      try {
        const res = await fetch(endpoint, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          return { ...lesson, _content: data };
        }
      } catch (e) {
        // try next
      }
    }
    return lesson;
  };

  // Process lessons from sections or flat list
  if (sections.length > 0) {
    for (const section of sections) {
      const sectionLessons = section._lessons || section.lessons || section.posts || [];
      for (const lesson of sectionLessons) {
        log(`  Fetching: ${lesson.name || lesson.title || lesson.id}`);
        const enriched = await fetchLessonContent(lesson);
        allLessons.push({ section: section.name || section.title, ...enriched });
        await delay(800);
      }
    }
  } else {
    for (const lesson of lessons) {
      log(`  Fetching: ${lesson.name || lesson.title || lesson.id}`);
      const enriched = await fetchLessonContent(lesson);
      allLessons.push(enriched);
      await delay(800);
    }
  }

  // Step 5: Build markdown output
  log('Building markdown...');
  let md = `# Freedom Club — 30-Day First Sale Challenge\n`;
  md += `_Extracted on ${new Date().toISOString().split('T')[0]}_\n\n---\n\n`;

  // Helper: extract text from HTML
  const htmlToText = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText || div.textContent || '';
  };

  let currentSection = '';
  for (const lesson of allLessons) {
    if (lesson.section && lesson.section !== currentSection) {
      currentSection = lesson.section;
      md += `## ${currentSection}\n\n`;
    }

    const title = lesson.name || lesson.title || lesson._content?.name || lesson._content?.title || 'Untitled';
    md += `### ${title}\n\n`;

    const content = lesson._content || lesson;
    const body = content.body || content.description || '';
    const bodyHtml = typeof body === 'object' ? (body.html || body.text || '') : body;

    if (bodyHtml) {
      md += htmlToText(bodyHtml) + '\n\n';
    }

    // Check for trix content or other content fields
    const trixBody = content.trix_body || content.body_html || content.rendered_body || '';
    if (trixBody && trixBody !== bodyHtml) {
      md += htmlToText(trixBody) + '\n\n';
    }

    // Note if no content found
    if (!bodyHtml && !trixBody) {
      md += '_No text content extracted (video-only lesson)_\n\n';
    }

    md += '---\n\n';
  }

  // Step 6: Also dump raw JSON for analysis
  const rawData = {
    space: spaceData,
    sections,
    lessons: allLessons,
  };

  // Step 7: Download both files
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  downloadFile(md, 'freedom-club-lessons.md');
  downloadFile(JSON.stringify(rawData, null, 2), 'freedom-club-raw-data.json');

  log(`✅ DONE! ${allLessons.length} lessons extracted.`);
  log('Two files downloaded: freedom-club-lessons.md + freedom-club-raw-data.json');
  log('Share the JSON file with Claude for detailed analysis.');
})();
