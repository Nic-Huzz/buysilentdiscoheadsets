#!/usr/bin/env python3
"""
Google Search Console Rank Tracker for buysilentdiscoheadsets.com
Pulls keyword rankings, clicks, impressions, and CTR.
"""

import json
import sys
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Config
CREDENTIALS_FILE = "/Users/nichurrell/Downloads/headset-sales-6317b2b3f175.json"
SITE_URL = "sc-domain:buysilentdiscoheadsets.com"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


def get_service():
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )
    return build("searchconsole", "v1", credentials=credentials)


def query_rankings(days=28, row_limit=50):
    """Pull top keywords ranked by impressions over the last N days."""
    service = get_service()

    end_date = datetime.now() - timedelta(days=3)  # GSC data has ~3 day delay
    start_date = end_date - timedelta(days=days)

    request = {
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "dimensions": ["query"],
        "rowLimit": row_limit,
        "dataState": "final",
    }

    response = (
        service.searchanalytics()
        .query(siteUrl=SITE_URL, body=request)
        .execute()
    )
    return response.get("rows", [])


def query_pages(days=28, row_limit=20):
    """Pull top pages ranked by clicks."""
    service = get_service()

    end_date = datetime.now() - timedelta(days=3)
    start_date = end_date - timedelta(days=days)

    request = {
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "dimensions": ["page"],
        "rowLimit": row_limit,
        "dataState": "final",
    }

    response = (
        service.searchanalytics()
        .query(siteUrl=SITE_URL, body=request)
        .execute()
    )
    return response.get("rows", [])


def query_keywords_by_page(page_url, days=28, row_limit=20):
    """Pull keywords for a specific page."""
    service = get_service()

    end_date = datetime.now() - timedelta(days=3)
    start_date = end_date - timedelta(days=days)

    request = {
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
        "dimensions": ["query"],
        "dimensionFilterGroups": [
            {
                "filters": [
                    {
                        "dimension": "page",
                        "operator": "equals",
                        "expression": page_url,
                    }
                ]
            }
        ],
        "rowLimit": row_limit,
        "dataState": "final",
    }

    response = (
        service.searchanalytics()
        .query(siteUrl=SITE_URL, body=request)
        .execute()
    )
    return response.get("rows", [])


def print_rankings(rows, title="Keywords"):
    """Pretty print ranking data."""
    if not rows:
        print(f"\n  No data found for {title}.")
        return

    print(f"\n{'=' * 80}")
    print(f"  {title}")
    print(f"{'=' * 80}")
    print(f"  {'Pos':>5}  {'Clicks':>7}  {'Impr':>7}  {'CTR':>7}  Keyword/Page")
    print(f"  {'-' * 5}  {'-' * 7}  {'-' * 7}  {'-' * 7}  {'-' * 40}")

    for row in rows:
        key = row["keys"][0]
        pos = row["position"]
        clicks = int(row["clicks"])
        impressions = int(row["impressions"])
        ctr = row["ctr"] * 100

        # Position color hint
        if pos <= 3:
            rank_marker = "**"
        elif pos <= 10:
            rank_marker = " *"
        else:
            rank_marker = "  "

        print(
            f"{rank_marker}{pos:5.1f}  {clicks:7d}  {impressions:7d}  {ctr:6.1f}%  {key}"
        )

    print(f"\n  ** = Top 3  |  * = Page 1  |  Last 28 days")


def main():
    print("\n  Rank Tracker: buysilentdiscoheadsets.com")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    # Top keywords
    print("\n  Fetching top keywords...")
    keywords = query_rankings(days=28, row_limit=50)
    print_rankings(keywords, "Top Keywords (by impressions)")

    # Top pages
    print("\n  Fetching top pages...")
    pages = query_pages(days=28, row_limit=20)
    print_rankings(pages, "Top Pages (by clicks)")

    # Summary stats
    if keywords:
        total_clicks = sum(int(r["clicks"]) for r in keywords)
        total_impressions = sum(int(r["impressions"]) for r in keywords)
        avg_position = sum(r["position"] for r in keywords) / len(keywords)
        top3 = len([r for r in keywords if r["position"] <= 3])
        page1 = len([r for r in keywords if r["position"] <= 10])

        print(f"\n{'=' * 80}")
        print(f"  SUMMARY (Last 28 days)")
        print(f"{'=' * 80}")
        print(f"  Total clicks:      {total_clicks:,}")
        print(f"  Total impressions: {total_impressions:,}")
        print(f"  Avg position:      {avg_position:.1f}")
        print(f"  Top 3 keywords:    {top3}")
        print(f"  Page 1 keywords:   {page1}")
        print()


if __name__ == "__main__":
    main()
