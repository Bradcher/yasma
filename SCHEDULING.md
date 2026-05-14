# Scheduled Posts — How It Works

## The problem scheduled posts solve

Eleventy builds the site at deploy time. A post with a future date is excluded from the build — it won't appear until the site is rebuilt *after* that date has passed.

This means scheduled posts require two things:
1. The post's `date` field is set to a future date (done in the CMS)
2. A rebuild happens automatically every day so that when the date passes, the post goes live

## How the daily rebuild works

A GitHub Action (`.github/workflows/daily-rebuild.yml`) runs every morning at 7 AM ET. It sends a POST request to a Netlify Build Hook, which triggers a full site rebuild. Any post whose date has now passed will be included in that build and go live.

**The rebuild takes 1–2 minutes.** A post scheduled for May 20 will go live on the morning of May 20 (around 7–8 AM ET), not at midnight.

## Setup (one-time)

### 1. Create a Netlify Build Hook

1. Netlify dashboard → your site → **Site configuration → Build & deploy → Build hooks**
2. Click **Add build hook**
3. Name: `Daily Scheduled Post Rebuild`
4. Branch: `blog`
5. Click **Save** and copy the hook URL (looks like `https://api.netlify.com/build_hooks/abc123...`)

### 2. Add the hook URL as a GitHub secret

1. GitHub → `Bradcher/yasma` → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `NETLIFY_BUILD_HOOK`
4. Value: paste the hook URL from step 1
5. Click **Add secret**

The Action will now run automatically every day. No further setup needed.

## Testing it manually

To verify the Action works without waiting for the schedule:

1. GitHub → `Bradcher/yasma` → **Actions** tab
2. Click **Daily Rebuild for Scheduled Posts** in the left sidebar
3. Click **Run workflow → Run workflow**
4. Watch it complete — a new Netlify deploy should appear in your Netlify dashboard within seconds

## Changing the schedule

Edit `.github/workflows/daily-rebuild.yml` and update the `cron` line.

Cron format: `minute hour day month weekday` (all times UTC)

| If you want... | Use this cron |
|---|---|
| 7 AM ET daily (current) | `0 12 * * *` |
| 6 AM ET daily | `0 11 * * *` |
| Twice daily (7 AM + 7 PM ET) | `0 12,0 * * *` |
| Weekdays only at 7 AM ET | `0 12 * * 1-5` |

After editing, commit and push — GitHub picks up the new schedule automatically.

## What happens if the rebuild is missed

GitHub Actions cron jobs can occasionally be delayed or skipped during high-traffic periods. If a scheduled post doesn't go live on time, manually trigger the rebuild using the steps above. The post will appear within minutes.
