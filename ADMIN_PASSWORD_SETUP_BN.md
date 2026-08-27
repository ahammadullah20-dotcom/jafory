# Jafory Admin Password Setup

Jafory-এর `/admin` route এখন owner-এর জন্য email/password sign-in ব্যবহার করে। সাধারণ viewer/customer-এর `/account` sign-in এবং public storefront-এর magic-link flow অপরিবর্তিত থাকে। Admin page-এ password জানলেই যথেষ্ট নয়; Supabase profile-এ `role = admin` থাকাও বাধ্যতামূলক।

## একবারের owner-only setup

1. Supabase Dashboard খুলে Jafory project নির্বাচন করুন।
2. **Authentication → Users**-এ আপনার existing owner account খুঁজুন। নতুন account তৈরি করবেন না, যদি existing admin account-ই ব্যবহার করতে চান।
3. User-এর action menu থেকে **Send password reset email** নির্বাচন করুন, অথবা Supabase-এর password reset flow ব্যবহার করুন।
4. Reset link নিজের email-এর ভিতর থেকে নিজস্ব regular Chrome tab-এ খুলে একটি শক্তিশালী আলাদা password সেট করুন। Password, reset link, OTP বা token কাউকে পাঠাবেন না।
5. এরপর regular Chrome-এ `https://jafory.netlify.app/admin` খুলে owner email এবং নতুন password দিয়ে sign in করুন। Gmail-এর ভিতরের browser বা Chrome Custom Tab ব্যবহার করার প্রয়োজন থাকবে না।

## Customer behavior

Customers এখনও header/account page-এর **Sign in** দিয়ে magic link পাবে। তাদের link `/account`-এ ফিরবে এবং তারা admin panel পাবে না। Server-side role check যেকোনো non-admin account-কে admin procedures থেকে `FORBIDDEN` করবে।

## নিরাপত্তা সীমা

Jafory application password সংরক্ষণ করে না; Supabase Auth credential যাচাই করে। Chat-এ password, OTP, recovery link, Supabase service key বা secret দেওয়া যাবে না। Password ভুলে গেলে আবার Supabase-এর reset email ব্যবহার করুন।
