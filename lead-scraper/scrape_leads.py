#!/usr/bin/env python3
"""
Silent Disco Lead Scraper v2
Uses DuckDuckGo (no JS required, no CAPTCHA) to find businesses,
then visits their websites to extract emails.

Usage:
  python3 scrape_leads.py                    # Run all queries
  python3 scrape_leads.py --test             # Test with 3 queries only
  python3 scrape_leads.py --region europe    # Only scrape Europe
  python3 scrape_leads.py --region usa
  python3 scrape_leads.py --region australia

Output: leads.csv

Requirements:
  pip3 install requests beautifulsoup4 lxml
"""

import requests
from bs4 import BeautifulSoup
import re
import csv
import time
import sys
import os
from urllib.parse import urlparse, quote_plus, unquote

# ============================================================
# SEARCH QUERIES
# ============================================================
QUERIES = {
    # ===== TIER 1: Best Immediate Targets =====
    "usa": {
        "yoga": [
            "yoga studio Los Angeles", "yoga studio New York", "yoga studio San Francisco",
            "yoga studio Austin", "yoga studio Miami", "yoga studio Denver",
            "yoga studio Portland Oregon", "yoga studio Seattle", "yoga studio Chicago",
            "yoga studio San Diego", "yoga retreat California", "yoga retreat Hawaii",
            "yoga retreat Colorado", "yoga studio Nashville", "yoga studio Atlanta",
            "yoga studio Boston", "yoga studio Phoenix", "yoga studio Minneapolis",
            "hot yoga studio Los Angeles", "hot yoga studio New York",
        ],
        "wellness": [
            "wellness center Los Angeles", "wellness center New York",
            "wellness center San Francisco", "wellness retreat California",
            "wellness retreat Hawaii", "wellness center Austin", "wellness center Miami",
            "holistic wellness center Denver", "wellness center Portland",
            "wellness center Seattle", "wellness center Chicago",
            "sound healing Los Angeles", "sound healing New York",
        ],
        "breathwork": [
            "breathwork facilitator Los Angeles", "breathwork classes New York",
            "breathwork facilitator San Francisco", "breathwork classes Austin",
            "breathwork retreat California", "breathwork facilitator Miami",
            "breathwork classes Denver", "breathwork facilitator Portland",
            "breathwork facilitator Seattle", "breathwork classes Chicago",
        ],
        "events": [
            "event planner Los Angeles", "event planner New York",
            "event planner San Francisco", "event planner Austin",
            "retreat center California", "retreat center Hawaii",
            "ecstatic dance Los Angeles", "ecstatic dance New York",
            "ecstatic dance San Francisco", "ecstatic dance Austin",
            "ecstatic dance Portland", "ecstatic dance Denver",
            "wedding planner Los Angeles", "wedding planner New York",
        ],
    },
    "singapore": {
        "yoga": [
            "yoga studio Singapore", "hot yoga Singapore", "yoga retreat Singapore",
            "yoga teacher training Singapore", "yoga center Singapore",
        ],
        "wellness": [
            "wellness centre Singapore", "sound healing Singapore",
            "meditation centre Singapore", "holistic wellness Singapore",
            "wellness retreat Singapore",
        ],
        "breathwork": [
            "breathwork Singapore", "breathwork facilitator Singapore",
            "breathwork classes Singapore",
        ],
        "events": [
            "event planner Singapore", "corporate event planner Singapore",
            "wedding planner Singapore", "retreat centre Singapore",
            "team building events Singapore",
        ],
    },
    "switzerland": {
        "yoga": [
            "yoga studio Zurich", "yoga studio Geneva", "yoga studio Basel",
            "yoga retreat Switzerland", "yoga studio Bern", "yoga studio Lausanne",
        ],
        "wellness": [
            "wellness centre Zurich", "wellness retreat Switzerland",
            "wellness centre Geneva", "wellness spa Zurich",
            "holistic wellness Switzerland",
        ],
        "breathwork": [
            "breathwork Zurich", "breathwork Switzerland",
            "breathwork facilitator Geneva",
        ],
        "events": [
            "event planner Zurich", "event planner Geneva",
            "corporate events Zurich", "retreat centre Switzerland",
            "ecstatic dance Zurich",
        ],
    },
    # ===== TIER 2: Growth Expansion =====
    "uk": {
        "yoga": [
            "yoga studio London", "yoga studio Manchester", "yoga studio Birmingham",
            "yoga studio Edinburgh", "yoga studio Bristol", "yoga studio Brighton",
            "yoga studio Leeds", "yoga studio Glasgow", "yoga studio Liverpool",
            "yoga retreat UK", "yoga retreat Devon", "yoga retreat Cornwall",
        ],
        "wellness": [
            "wellness centre London", "wellness centre Manchester",
            "wellness centre Edinburgh", "wellness retreat UK",
            "wellness centre Bristol", "wellness centre Brighton",
            "holistic wellness centre London", "sound healing London",
        ],
        "breathwork": [
            "breathwork facilitator London", "breathwork classes Manchester",
            "breathwork facilitator Edinburgh", "breathwork classes Bristol",
            "breathwork facilitator Brighton", "breathwork retreat UK",
        ],
        "events": [
            "event planner London", "event planner Manchester",
            "event planner Edinburgh", "event planner Bristol",
            "ecstatic dance London", "ecstatic dance Manchester",
            "ecstatic dance Bristol", "ecstatic dance Brighton",
            "wedding planner London", "retreat centre UK",
        ],
    },
    "australia": {
        "yoga": [
            "yoga studio Sydney", "yoga studio Melbourne", "yoga studio Brisbane",
            "yoga studio Gold Coast", "yoga studio Perth", "yoga studio Byron Bay",
            "yoga retreat Byron Bay", "yoga retreat Sunshine Coast",
            "yoga studio Adelaide", "yoga studio Canberra",
        ],
        "wellness": [
            "wellness centre Sydney", "wellness centre Melbourne",
            "wellness centre Brisbane", "wellness retreat Byron Bay",
            "wellness centre Gold Coast", "wellness centre Perth",
            "holistic wellness centre Sydney", "wellness retreat Sunshine Coast",
            "sound healing Sydney", "sound healing Melbourne",
        ],
        "breathwork": [
            "breathwork facilitator Sydney", "breathwork classes Melbourne",
            "breathwork facilitator Byron Bay", "breathwork classes Brisbane",
            "breathwork facilitator Gold Coast", "breathwork classes Perth",
        ],
        "events": [
            "event planner Sydney", "event planner Melbourne",
            "event planner Brisbane", "event planner Perth",
            "retreat centre Byron Bay", "retreat centre Sunshine Coast",
            "ecstatic dance Sydney", "ecstatic dance Melbourne",
            "ecstatic dance Byron Bay",
        ],
    },
    "uae": {
        "yoga": [
            "yoga studio Dubai", "yoga studio Abu Dhabi", "yoga retreat Dubai",
            "hot yoga Dubai", "yoga centre Abu Dhabi",
        ],
        "wellness": [
            "wellness centre Dubai", "wellness centre Abu Dhabi",
            "wellness retreat Dubai", "sound healing Dubai",
            "holistic wellness Dubai", "biohacking Dubai",
        ],
        "breathwork": [
            "breathwork Dubai", "breathwork facilitator Dubai",
            "breathwork classes Abu Dhabi",
        ],
        "events": [
            "event planner Dubai", "event planner Abu Dhabi",
            "corporate event planner Dubai", "wedding planner Dubai",
            "retreat centre Dubai", "team building Dubai",
        ],
    },
    # ===== TIER 3: Smaller Niche, Low Competition =====
    "canada": {
        "yoga": [
            "yoga studio Toronto", "yoga studio Vancouver", "yoga studio Montreal",
            "yoga studio Calgary", "yoga studio Ottawa", "yoga retreat British Columbia",
            "yoga studio Victoria BC",
        ],
        "wellness": [
            "wellness centre Toronto", "wellness centre Vancouver",
            "wellness retreat British Columbia", "wellness centre Montreal",
            "holistic wellness Toronto", "sound healing Vancouver",
        ],
        "breathwork": [
            "breathwork facilitator Toronto", "breathwork classes Vancouver",
            "breathwork facilitator Montreal", "breathwork retreat Canada",
        ],
        "events": [
            "event planner Toronto", "event planner Vancouver",
            "event planner Montreal", "ecstatic dance Toronto",
            "ecstatic dance Vancouver", "retreat centre British Columbia",
        ],
    },
    "new_zealand": {
        "yoga": [
            "yoga studio Auckland", "yoga studio Wellington", "yoga studio Queenstown",
            "yoga retreat New Zealand", "yoga studio Christchurch",
        ],
        "wellness": [
            "wellness centre Auckland", "wellness centre Wellington",
            "wellness retreat New Zealand", "holistic wellness Auckland",
        ],
        "breathwork": [
            "breathwork facilitator Auckland", "breathwork classes Wellington",
            "breathwork New Zealand",
        ],
        "events": [
            "event planner Auckland", "event planner Wellington",
            "ecstatic dance Auckland", "retreat centre New Zealand",
            "festival organiser New Zealand",
        ],
    },
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

SKIP_DOMAINS = {
    "example.com", "sentry.io", "wixpress.com", "googleapis.com",
    "w3.org", "schema.org", "facebook.com", "google.com", "apple.com",
    "cloudflare.com", "wordpress.com", "wordpress.org", "gstatic.com",
    "jquery.com", "gravatar.com", "bootstrapcdn.com", "github.com",
    "twitter.com", "instagram.com", "youtube.com", "linkedin.com",
    "yelp.com", "tripadvisor.com", "trustpilot.com",
}

SKIP_URL_DOMAINS = {
    "google.com", "youtube.com", "facebook.com", "instagram.com",
    "twitter.com", "yelp.com", "tripadvisor.com", "wikipedia.org",
    "linkedin.com", "pinterest.com", "tiktok.com", "reddit.com",
    "amazon.com", "bing.com", "duckduckgo.com",
}


def is_valid_email(email):
    domain = email.split("@")[1].lower()
    if domain in SKIP_DOMAINS:
        return False
    if email.startswith(("noreply@", "no-reply@", "donotreply@", "mailer-daemon@", "test@", "admin@", "webmaster@")):
        return False
    if len(email) > 60 or ".." in email:
        return False
    return True


def extract_emails_from_html(html_text):
    emails = EMAIL_RE.findall(html_text)
    valid = list(set(e.lower() for e in emails if is_valid_email(e)))
    return valid


def fetch_page(url, timeout=10):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        if resp.status_code == 200:
            return resp.text
    except Exception:
        pass
    return None


def extract_emails_from_website(website_url):
    """Try homepage, then /contact and /about pages."""
    all_emails = []

    # Try homepage
    html = fetch_page(website_url)
    if html:
        all_emails.extend(extract_emails_from_html(html))

    # If no emails found, try common subpages
    if not all_emails:
        parsed = urlparse(website_url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        for page in ["/contact", "/contact-us", "/about", "/about-us", "/connect", "/get-in-touch"]:
            html = fetch_page(f"{base}{page}", timeout=8)
            if html:
                emails = extract_emails_from_html(html)
                all_emails.extend(emails)
                if emails:
                    break
            time.sleep(0.5)

    return list(set(all_emails))


def search_duckduckgo(query, max_results=15):
    """Search DuckDuckGo HTML version (no JS needed)."""
    results = []
    search_url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"

    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            print(f"    DDG returned {resp.status_code}")
            return results

        soup = BeautifulSoup(resp.text, "lxml")

        for result in soup.select(".result__body"):
            link_el = result.select_one(".result__url")
            title_el = result.select_one(".result__title a")
            snippet_el = result.select_one(".result__snippet")

            if not link_el:
                continue

            # Extract URL
            url_text = link_el.get_text(strip=True)
            if not url_text.startswith("http"):
                url_text = "https://" + url_text

            # Clean up URL
            parsed = urlparse(url_text)
            if not parsed.netloc:
                continue

            domain = parsed.netloc.lower().replace("www.", "")

            # Skip aggregator sites
            if any(skip in domain for skip in SKIP_URL_DOMAINS):
                continue

            title = title_el.get_text(strip=True) if title_el else ""
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""

            results.append({
                "name": title,
                "website": url_text,
                "domain": domain,
                "snippet": snippet,
            })

        # Dedupe by domain
        seen = set()
        deduped = []
        for r in results:
            if r["domain"] not in seen:
                seen.add(r["domain"])
                deduped.append(r)

        return deduped[:max_results]

    except Exception as e:
        print(f"    Search error: {e}")
        return []


def process_query(query, region, biz_type):
    """Search + extract emails for one query."""
    print(f"  Searching: {query}")
    businesses = search_duckduckgo(query)
    print(f"    Found {len(businesses)} websites")

    leads = []
    for biz in businesses:
        emails = extract_emails_from_website(biz["website"])
        if emails:
            # Pick the best email (prefer info@, hello@, contact@ over personal)
            preferred = [e for e in emails if e.startswith(("info@", "hello@", "contact@", "enquir", "book"))]
            primary = preferred[0] if preferred else emails[0]

            city = query.split()[-1] if " " in query else ""
            # Try to get city from last 1-2 words
            words = query.split()
            if len(words) >= 2:
                # Handle "New York", "Los Angeles", "Byron Bay" etc
                if words[-2][0].isupper() and words[-1][0].isupper() and words[-2] not in ("yoga", "wellness", "breathwork", "event", "retreat", "ecstatic", "holistic"):
                    city = f"{words[-2]} {words[-1]}"
                else:
                    city = words[-1]

            leads.append({
                "business_name": biz["name"][:100],
                "email": primary,
                "all_emails": "; ".join(emails[:5]),
                "website": biz["website"],
                "location": city,
                "country": region.upper(),
                "business_type": biz_type,
                "search_query": query,
            })

    return leads


def main():
    test_mode = "--test" in sys.argv
    region_filter = None
    if "--region" in sys.argv:
        idx = sys.argv.index("--region")
        if idx + 1 < len(sys.argv):
            region_filter = sys.argv[idx + 1].lower()

    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(output_dir, "leads.csv")

    # Count queries
    total_queries = 0
    for region, types in QUERIES.items():
        if region_filter and region != region_filter:
            continue
        for biz_type, queries in types.items():
            total_queries += len(queries)

    test_limit = 3
    if test_mode:
        total_queries = min(total_queries, test_limit)

    print(f"\n{'='*60}")
    print(f"  Silent Disco Lead Scraper v2 (DuckDuckGo)")
    print(f"{'='*60}")
    print(f"  Queries to run: {total_queries}")
    print(f"  Output: {output_file}")
    if test_mode:
        print(f"  MODE: TEST ({test_limit} queries only)")
    if region_filter:
        print(f"  REGION: {region_filter}")
    print(f"{'='*60}\n")

    # Open CSV immediately and write as we go
    fieldnames = ["business_name", "email", "all_emails", "website", "location", "country", "business_type", "search_query"]
    seen_emails = set()
    total_written = 0
    csvfile = open(output_file, "w", newline="", encoding="utf-8")
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    csvfile.flush()

    query_count = 0
    consecutive_403s = 0

    for region, types in QUERIES.items():
        if region_filter and region != region_filter:
            continue

        print(f"\n--- {region.upper()} ---", flush=True)

        for biz_type, queries in types.items():
            print(f"\n  [{biz_type.upper()}]", flush=True)

            for query in queries:
                if test_mode and query_count >= test_limit:
                    break

                query_count += 1
                print(f"  [{query_count}/{total_queries}] ", end="", flush=True)

                leads = process_query(query, region, biz_type)

                # Write leads immediately
                for lead in leads:
                    if lead["email"] not in seen_emails:
                        seen_emails.add(lead["email"])
                        writer.writerow(lead)
                        total_written += 1
                csvfile.flush()

                print(f"  => {len(leads)} leads ({total_written} total saved)", flush=True)

                # Track 403s — if too many in a row, pause longer
                if len(leads) == 0:
                    consecutive_403s += 1
                else:
                    consecutive_403s = 0

                if consecutive_403s >= 5:
                    print(f"  ⏸ Rate limited — pausing 30s...", flush=True)
                    time.sleep(30)
                    consecutive_403s = 0
                else:
                    time.sleep(2 + (query_count % 3))

            if test_mode and query_count >= test_limit:
                break
        if test_mode and query_count >= test_limit:
            break

    csvfile.close()

    print(f"\n{'='*60}", flush=True)
    print(f"  DONE!", flush=True)
    print(f"  Total leads: {len(all_leads)}")
    print(f"  Unique (deduped): {len(unique)}")
    print(f"  Saved to: {output_file}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
