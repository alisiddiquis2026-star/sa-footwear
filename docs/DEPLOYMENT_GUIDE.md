# Deployment (Vercel; Netlify/Cloudflare similar). Nothing has been deployed.
1. Push the repo to GitHub. Import in Vercel (framework: Next.js).
2. Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BUSINESS_NAME`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `INQUIRY_WEBHOOK_URL`. Keep `SITE_LIVE` unset until approved.
3. Serverless disk is read-only: use `INQUIRY_WEBHOOK_URL`, not the file store. Add Vercel WAF/Upstash rate limiting for real abuse control.
4. Add the domain; set DNS as Vercel instructs; HTTPS is automatic.
5. Verify on the preview URL: submit a real inquiry and confirm it arrives.
6. Launch: set `SITE_LIVE=true`, redeploy, check `/robots.txt` and `/sitemap.xml`, submit sitemap in Search Console.
Rollback: Vercel → Deployments → promote previous deployment. Back up the inquiry destination (sheet/CRM) separately.
Self-hosting: `npm run build`, `INQUIRY_FILE_STORE=1 npm start` behind nginx + PM2.
