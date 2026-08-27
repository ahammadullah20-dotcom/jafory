# Jafory V2 custom SMTP research

Official Brevo documentation states that the SMTP relay host is `smtp-relay.brevo.com`; ports 587 or 2525 are available for non-encrypted/STARTTLS connections, and port 465 is available for encrypted SSL/TLS connections. Brevo recommends using the SMTP relay credentials from the Brevo transactional platform, not a guessed password.

Official sources:

- Brevo SMTP integration: https://developers.brevo.com/docs/smtp-integration
- Brevo SMTP setup: https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP
- Brevo port guidance: https://help.brevo.com/hc/en-us/articles/10905415650322-Which-SMTP-port-should-I-use-Port-587-465-or-2525
- Supabase custom SMTP guide: https://supabase.com/docs/guides/auth/auth-smtp

The Supabase custom SMTP configuration must be applied in the new V2 project’s Authentication email/SMTP settings. The SMTP secret must never be placed in GitHub, the app’s VITE variables, or chat. No SMTP credential was available in the current session and no credential was guessed or submitted.
