-- ===============================
-- Seed data for Cashflow Canvas
-- ===============================

DO $$
DECLARE
  TEST_USER UUID := 'cebf91c2-d32a-4d5a-99bb-a84a53e846f3';
BEGIN
  -- 1) Profile
  INSERT INTO public.user_profiles (id, email, name, avatar_url)
  VALUES
    (TEST_USER, 'founder@example.com', 'Founder', NULL)
  ON CONFLICT (id) DO NOTHING;

  -- 2) Businesses
  INSERT INTO public.businesses (id, user_id, name, color)
  VALUES
    (gen_random_uuid(), TEST_USER, 'Agency', '#4F46E5'),
    (gen_random_uuid(), TEST_USER, 'Shop',   '#10B981')
  ON CONFLICT DO NOTHING;

  -- 3) Expenses
  INSERT INTO public.expenses (user_id, description, amount, "date", category, expense_type)
  VALUES
    (TEST_USER, 'Notion subscription',         12.00, CURRENT_DATE - INTERVAL '60 days', 'SaaS',       'recurring'),
    (TEST_USER, 'Figma',                       15.00, CURRENT_DATE - INTERVAL '55 days', 'SaaS',       'recurring'),
    (TEST_USER, 'Client lunch',                42.50, CURRENT_DATE - INTERVAL '54 days', 'Meals',      'one-time'),
    (TEST_USER, 'Google Ads',                 250.00, CURRENT_DATE - INTERVAL '50 days', 'Marketing',  'recurring'),
    (TEST_USER, 'Stripe fees',                 18.73, CURRENT_DATE - INTERVAL '49 days', 'Fees',       'recurring'),
    (TEST_USER, 'Stock photos',                29.00, CURRENT_DATE - INTERVAL '45 days', 'Assets',     'one-time'),
    (TEST_USER, 'UPS shipping',                64.90, CURRENT_DATE - INTERVAL '41 days', 'Logistics',  'one-time'),
    (TEST_USER, 'QuickBooks',                  30.00, CURRENT_DATE - INTERVAL '40 days', 'SaaS',       'recurring'),
    (TEST_USER, 'Team coffee',                 17.25, CURRENT_DATE - INTERVAL '38 days', 'Meals',      'one-time'),
    (TEST_USER, 'Domain renewals',             26.00, CURRENT_DATE - INTERVAL '35 days', 'Ops',        'annual'),
    (TEST_USER, 'Facebook Ads',               190.00, CURRENT_DATE - INTERVAL '30 days', 'Marketing',  'recurring'),
    (TEST_USER, 'Freelancer copy edit',       120.00, CURRENT_DATE - INTERVAL '27 days', 'Contractor', 'one-time'),
    (TEST_USER, 'Email service',               49.00, CURRENT_DATE - INTERVAL '25 days', 'SaaS',       'recurring'),
    (TEST_USER, 'Office supplies',             33.18, CURRENT_DATE - INTERVAL '20 days', 'Ops',        'one-time'),
    (TEST_USER, 'Zapier',                      39.99, CURRENT_DATE - INTERVAL '14 days', 'SaaS',       'recurring'),
    (TEST_USER, 'Travel. client onsite',      385.40, CURRENT_DATE - INTERVAL '10 days', 'Travel',     'one-time'),
    (TEST_USER, 'Lunch & learn',               58.60, CURRENT_DATE - INTERVAL '7 days',  'Meals',      'one-time'),
    (TEST_USER, 'Canva Pro',                   12.99, CURRENT_DATE - INTERVAL '5 days',  'SaaS',       'recurring'),
    (TEST_USER, 'HubSpot Starter',             25.00, CURRENT_DATE - INTERVAL '3 days',  'SaaS',       'recurring'),
    (TEST_USER, 'Taxi. airport run',           41.70, CURRENT_DATE - INTERVAL '1 day',   'Travel',     'one-time');

  -- 4) Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON public.expenses (user_id, "date");
  CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses (user_id);
END$$;
