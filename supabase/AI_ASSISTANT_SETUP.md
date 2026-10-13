# GRModPro AI assistant setup

The UI is loaded by `index.html` from `ai-assistant.js`. It is intentionally not connected to a live AI service until you configure the backend.

## Configure Supabase Edge Function

1. Install/use the Supabase CLI and link it to your Supabase project.
2. Set the OpenAI API key as a server-side secret: `supabase secrets set OPENAI_API_KEY=your_key_here`. Never put this key in GitHub files, frontend JavaScript, or chat messages.
3. Set `ALLOWED_ORIGIN` to the exact deployed website origin (currently `https://leoissac123-art.github.io`) and optionally set `OPENAI_MODEL`.
4. Deploy the function: `supabase functions deploy ai-assistant`.
5. In `ai-assistant.js`, replace `YOUR_PROJECT_REF` in `SUPABASE_FUNCTION_URL` with your Supabase project reference.
6. Test on a preview/development deployment before merging.

## Security and limitations

- The OpenAI API key is read only from Edge Function environment secrets.
- The function restricts request method, origin, message count, and message length.
- Origin checks are not authentication and are not a complete abuse/rate-limit control. Before a public production launch, add server-side rate limiting/quotas (for example, a database-backed per-IP/session limit or provider gateway), usage monitoring, and spending limits.
- This scaffold does not configure Google/email authentication or owner roles.
- AI requests may incur API costs. Keep provider spending limits enabled.
- Do not merge or publish this branch until the owner has reviewed it and backend configuration and tests are complete.
