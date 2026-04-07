# PRINTY SUBSCRIPTION TIERS - CLAUDE CODE PROMPT

## CONTEXT
- **Codebase:** https://github.com/WillieIlus/Printy_api
- **Current models location:** `shops/models.py` and `subscriptions/models.py`
- **Payment gateway:** Safaricom Daraja (M-Pesa STK Push)
- **Billing cycle:** Monthly only (for MVP)
- **Database:** Django ORM with PostgreSQL

---

## EXISTING MODELS (DO NOT MODIFY WITHOUT EXPLICIT INSTRUCTION)

```
subscriptions/models.py:
- SubscriptionPlan (name, price, billing_period)
- Subscription (shop, plan, status, period_start, period_end, next_billing_date, last_payment_date)
- MpesaStkRequest (shop, plan, phone, amount, checkout_request_id, status, raw_callback_payload)
- Payment (subscription, amount, method, status, receipt_number, phone, request_id, period_start, period_end)
```

---

## TIER SPECIFICATION (EXACT)

### Tier 1: KARIBU
**Type:** Free trial
**Database name field:** `KARIBU`
**Display name:** "Karibu"
**Subtitle:** "Try Printy at no cost"
**Price:** KES 0.00
**Billing period:** MONTHLY (30 days)

**Limits:**
- Machines: 1
- Products: 3
- Quotes per month: 15
- Quote requests received: 30
- Team users: 1
- Paper options: All papers
- Finishings: Basic only

**Features:**
- Quote creation & sharing
- Basic customer history
- Printy branding on quotes (non-removable)
- Email support only
- No API access
- No advanced analytics
- Read-only dashboard

**Database fields needed:**
- Add field: `max_machines` = 1 (IntegerField)
- Add field: `max_products` = 3 (IntegerField)
- Add field: `max_monthly_quotes` = 15 (IntegerField)
- Add field: `max_team_users` = 1 (IntegerField)
- Add field: `allow_branded_quotes` = False (BooleanField)
- Add field: `allow_advanced_finishings` = False (BooleanField)
- Add field: `allow_api_access` = False (BooleanField)

**Trial duration:** 30 days (then downgrade or must subscribe)
**Can downgrade to:** N/A (lowest tier)
**Can upgrade to:** HATUA, KAZI, BIASHARA PLUS

---

### Tier 2: HATUA
**Type:** Paid starter tier
**Database name field:** `HATUA`
**Display name:** "Hatua"
**Subtitle:** "For small print shops"
**Price:** KES 1,500.00 per month
**Billing period:** MONTHLY (30 days)
**Annual equivalent:** KES 16,500 (save KES 300/year = 1.8% discount)

**Limits:**
- Machines: 3
- Products: 15
- Quotes per month: 100
- Quote requests received: 200
- Team users: 2
- Paper options: All papers
- Finishings: Basic + standard

**Features:**
- Everything in KARIBU +
- Branded quotes (custom branding removable)
- WhatsApp quote sharing
- Customer history (searchable)
- Reusable quote templates (basic)
- Monthly usage report (email)
- Email support (8-24hr response)
- Advanced finishings (score, fold, perforate)
- Basic analytics (quotes created, most-used products)

**Database fields needed:**
- max_machines = 3
- max_products = 15
- max_monthly_quotes = 100
- max_team_users = 2
- allow_branded_quotes = True
- allow_advanced_finishings = True
- allow_api_access = False
- allow_templates = True (new field)
- template_limit = 10 (new field)
- allow_whatsapp_integration = True (new field)

**Payment method:** M-Pesa STK Push (Daraja)
**Auto-renewal:** Every 30 days (auto STK on next_billing_date)
**Failed payment flow:**
  - Day 0: Payment attempt 1 → Failure
  - Day 0 (after 60 sec): Payment attempt 2 → Failure
  - Day 0 (after 120 sec): Payment attempt 3 → Failure
  - Day 1: Send SMS "Payment failed. Will retry tomorrow."
  - Day 2: Payment attempt 4 (final)
  - Day 3: If still failed → Downgrade to KARIBU + send email

**Can downgrade to:** KARIBU
**Can upgrade to:** KAZI, BIASHARA PLUS

---

### Tier 3: KAZI
**Type:** Paid pro tier
**Database name field:** `KAZI`
**Display name:** "Kazi"
**Subtitle:** "For active print shops"
**Price:** KES 3,500.00 per month
**Billing period:** MONTHLY (30 days)
**Annual equivalent:** KES 38,500 (save KES 1,000/year = 2.5% discount)

**Limits:**
- Machines: 10
- Products: 50
- Quotes per month: 400
- Quote requests received: 750
- Team users: 5
- Paper options: All papers + custom specifications
- Finishings: All (score, fold, perforate, laminate, emboss, die-cut)

**Features:**
- Everything in HATUA +
- Advanced finishings (all types available)
- Reusable quote templates (advanced)
- Multiple finishing combinations
- Job history with search/filter
- Detailed analytics dashboard
- Monthly PDF report
- Priority email support (2-4hr response)
- Quote templates (30+)
- Cost analysis per quote
- Customer repeat order tracking
- Bulk quote export (CSV/PDF)

**Database fields needed:**
- max_machines = 10
- max_products = 50
- max_monthly_quotes = 400
- max_team_users = 5
- allow_branded_quotes = True
- allow_advanced_finishings = True
- allow_api_access = False
- allow_templates = True
- template_limit = 30
- allow_whatsapp_integration = True
- allow_custom_finishings = True (new field)
- support_tier = "PRIORITY_EMAIL" (new field)

**Payment method:** M-Pesa STK Push (Daraja)
**Auto-renewal:** Every 30 days
**Failed payment flow:** Same as HATUA (4 attempts over 3 days, then downgrade)

**Can downgrade to:** HATUA, KARIBU
**Can upgrade to:** BIASHARA PLUS

---

### Tier 4: BIASHARA PLUS
**Type:** Paid business tier
**Database name field:** `BIASHARA_PLUS`
**Display name:** "Biashara Plus"
**Subtitle:** "For growing print teams"
**Price:** KES 6,500.00 per month
**Billing period:** MONTHLY (30 days)
**Annual equivalent:** KES 71,500 (save KES 2,500/year = 3.4% discount)

**Limits:**
- Machines: Unlimited (soft limit: 100+ supported)
- Products: Unlimited (soft limit: 1000+ supported)
- Quotes per month: Unlimited
- Quote requests received: Unlimited
- Team users: 10
- Paper options: Unlimited + supplier integration
- Finishings: All + custom combinations

**Features:**
- Everything in KAZI +
- Unlimited machines, products, quotes
- Team roles & permissions (admin, manager, operator)
- Multiple branch/shop management (future: support multiple shops)
- API access (basic: 500 calls/day)
- Webhooks (for external integrations)
- Advanced reporting (weekly/monthly PDF export)
- Custom quote PDF styling
- Phone + email support (priority: <1hr response)
- Dedicated support channel (WhatsApp business account)
- Quarterly business review (optional)
- Early access to new features
- Machine & finisher utilization reports
- Staff productivity metrics
- Inventory tracking integration (basic)

**Database fields needed:**
- max_machines = 999999 (unlimited sentinel)
- max_products = 999999 (unlimited sentinel)
- max_monthly_quotes = 999999 (unlimited sentinel)
- max_team_users = 10
- allow_branded_quotes = True
- allow_advanced_finishings = True
- allow_api_access = True
- api_call_limit = 500 (new field)
- allow_templates = True
- template_limit = 999999 (unlimited)
- allow_whatsapp_integration = True
- allow_custom_finishings = True
- support_tier = "PRIORITY_PHONE" (new field)
- allow_multiple_shops = True (new field, future)
- allow_team_roles = True (new field)
- allow_webhooks = True (new field)
- allow_inventory_integration = True (new field)

**Payment method:** M-Pesa STK Push (Daraja)
**Auto-renewal:** Every 30 days
**Failed payment flow:** Same as HATUA (4 attempts over 3 days, then downgrade)

**Can downgrade to:** KAZI, HATUA, KARIBU
**Can upgrade to:** Custom Enterprise (outside this tier system)

---

## DATABASE SCHEMA CHANGES

### New fields to add to SubscriptionPlan model:
```python
class SubscriptionPlan(models.Model):
    # ... existing fields ...
    
    # Limits
    max_machines = models.IntegerField(
        default=1,
        help_text="Maximum number of machines. Use 999999 for unlimited."
    )
    max_products = models.IntegerField(
        default=3,
        help_text="Maximum number of custom products. Use 999999 for unlimited."
    )
    max_monthly_quotes = models.IntegerField(
        default=15,
        help_text="Maximum quotes per month. Use 999999 for unlimited."
    )
    max_team_users = models.IntegerField(
        default=1,
        help_text="Maximum team members."
    )
    
    # Features
    allow_branded_quotes = models.BooleanField(
        default=False,
        help_text="Allow custom branding on customer quotes."
    )
    allow_advanced_finishings = models.BooleanField(
        default=False,
        help_text="Allow advanced finishings (laminate, emboss, die-cut, etc)."
    )
    allow_api_access = models.BooleanField(
        default=False,
        help_text="Allow API access."
    )
    api_call_limit = models.IntegerField(
        default=0,
        help_text="API calls per day. 0 = no access."
    )
    allow_templates = models.BooleanField(
        default=False,
        help_text="Allow saving reusable quote templates."
    )
    template_limit = models.IntegerField(
        default=0,
        help_text="Maximum templates. 0 = no templates."
    )
    allow_whatsapp_integration = models.BooleanField(
        default=False,
        help_text="Allow WhatsApp quote sharing."
    )
    allow_custom_finishings = models.BooleanField(
        default=False,
        help_text="Allow custom finishing combinations."
    )
    allow_team_roles = models.BooleanField(
        default=False,
        help_text="Allow admin/manager/operator role assignment."
    )
    allow_webhooks = models.BooleanField(
        default=False,
        help_text="Allow webhook integrations."
    )
    allow_multiple_shops = models.BooleanField(
        default=False,
        help_text="Allow managing multiple shops (future)."
    )
    allow_inventory_integration = models.BooleanField(
        default=False,
        help_text="Allow inventory tracking integrations."
    )
    support_tier = models.CharField(
        max_length=50,
        choices=[
            ("EMAIL_ONLY", "Email support only"),
            ("PRIORITY_EMAIL", "Priority email (2-4hr)"),
            ("PRIORITY_PHONE", "Priority phone (<1hr)"),
        ],
        default="EMAIL_ONLY"
    )
```

### Update Subscription model:
```python
class Subscription(models.Model):
    # ... existing fields ...
    
    # Add these fields if missing
    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        help_text="When subscription was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last update timestamp."
    )
    failed_payment_attempts = models.IntegerField(
        default=0,
        help_text="Count of consecutive failed payment attempts."
    )
```

---

## SETTINGS / CONFIGURATION

### In Django settings.py, add:

```python
# Subscription tiers
SUBSCRIPTION_TIERS = {
    'KARIBU': {
        'name': 'Karibu',
        'price': Decimal('0.00'),
        'trial_days': 30,
        'is_paid': False,
    },
    'HATUA': {
        'name': 'Hatua',
        'price': Decimal('1500.00'),
        'trial_days': 0,
        'is_paid': True,
    },
    'KAZI': {
        'name': 'Kazi',
        'price': Decimal('3500.00'),
        'trial_days': 0,
        'is_paid': True,
    },
    'BIASHARA_PLUS': {
        'name': 'Biashara Plus',
        'price': Decimal('6500.00'),
        'trial_days': 0,
        'is_paid': True,
    },
}

# M-Pesa Daraja settings
MPESA_CONSUMER_KEY = env('MPESA_CONSUMER_KEY')
MPESA_CONSUMER_SECRET = env('MPESA_CONSUMER_SECRET')
MPESA_BUSINESS_SHORTCODE = env('MPESA_BUSINESS_SHORTCODE')
MPESA_PASSKEY = env('MPESA_PASSKEY')
MPESA_CALLBACKURL = env('MPESA_CALLBACKURL')  # e.g., https://printy.ke/api/mpesa/callback/

# Billing retry logic
MPESA_PAYMENT_RETRY_ATTEMPTS = 4
MPESA_PAYMENT_RETRY_INTERVAL_SECONDS = 60
MPESA_FAILED_PAYMENT_BEFORE_DOWNGRADE_DAYS = 3
```

---

## DATA INITIALIZATION

### Create tiers in database:

```python
# migrations/0002_create_subscription_tiers.py

from decimal import Decimal

def create_tiers(apps, schema_editor):
    SubscriptionPlan = apps.get_model('subscriptions', 'SubscriptionPlan')
    
    tiers = [
        {
            'name': 'Karibu',
            'price': Decimal('0.00'),
            'billing_period': 'MONTHLY',
            'max_machines': 1,
            'max_products': 3,
            'max_monthly_quotes': 15,
            'max_team_users': 1,
            'allow_branded_quotes': False,
            'allow_advanced_finishings': False,
            'allow_api_access': False,
            'support_tier': 'EMAIL_ONLY',
        },
        {
            'name': 'Hatua',
            'price': Decimal('1500.00'),
            'billing_period': 'MONTHLY',
            'max_machines': 3,
            'max_products': 15,
            'max_monthly_quotes': 100,
            'max_team_users': 2,
            'allow_branded_quotes': True,
            'allow_advanced_finishings': True,
            'allow_api_access': False,
            'allow_templates': True,
            'template_limit': 10,
            'allow_whatsapp_integration': True,
            'support_tier': 'EMAIL_ONLY',
        },
        {
            'name': 'Kazi',
            'price': Decimal('3500.00'),
            'billing_period': 'MONTHLY',
            'max_machines': 10,
            'max_products': 50,
            'max_monthly_quotes': 400,
            'max_team_users': 5,
            'allow_branded_quotes': True,
            'allow_advanced_finishings': True,
            'allow_api_access': False,
            'allow_templates': True,
            'template_limit': 30,
            'allow_whatsapp_integration': True,
            'allow_custom_finishings': True,
            'support_tier': 'PRIORITY_EMAIL',
        },
        {
            'name': 'Biashara Plus',
            'price': Decimal('6500.00'),
            'billing_period': 'MONTHLY',
            'max_machines': 999999,
            'max_products': 999999,
            'max_monthly_quotes': 999999,
            'max_team_users': 10,
            'allow_branded_quotes': True,
            'allow_advanced_finishings': True,
            'allow_api_access': True,
            'api_call_limit': 500,
            'allow_templates': True,
            'template_limit': 999999,
            'allow_whatsapp_integration': True,
            'allow_custom_finishings': True,
            'allow_team_roles': True,
            'allow_webhooks': True,
            'allow_inventory_integration': True,
            'support_tier': 'PRIORITY_PHONE',
        },
    ]
    
    for tier_data in tiers:
        SubscriptionPlan.objects.get_or_create(
            name=tier_data['name'],
            defaults=tier_data
        )
```

---

## API ENDPOINTS REQUIRED

### 1. GET /api/subscriptions/plans/
**Purpose:** List all subscription tiers for pricing page
**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Karibu",
      "price": "0.00",
      "billing_period": "MONTHLY",
      "max_machines": 1,
      "max_products": 3,
      "max_monthly_quotes": 15,
      "max_team_users": 1,
      "allow_branded_quotes": false,
      "allow_api_access": false,
      ...
    }
  ]
}
```

### 2. POST /api/subscriptions/stk-push/
**Purpose:** Initiate M-Pesa STK Push for subscription
**Request:**
```json
{
  "plan_id": 2,
  "phone": "254712345678",
  "billing_cycle": "MONTHLY"
}
```
**Response:**
```json
{
  "checkout_request_id": "ws_CO_2024...",
  "response_code": "0",
  "message": "Success. Request accepted for processing.",
  "stk_request_id": "8e329304-..."
}
```

### 3. POST /api/subscriptions/mpesa-callback/
**Purpose:** Handle M-Pesa Daraja callback (internal endpoint)
**Receives:** Safaricom's callback with ResultCode
**Logic:**
- If ResultCode == 0: Mark MpesaStkRequest as SUCCESS, create Payment record, update Subscription
- If ResultCode != 0: Mark MpesaStkRequest as FAILED, increment failed_payment_attempts
- If failed_payment_attempts >= 4: Downgrade subscription to KARIBU

### 4. GET /api/subscriptions/current/
**Purpose:** Get current shop's subscription details
**Response:**
```json
{
  "subscription": {
    "id": 1,
    "plan": {
      "name": "Hatua",
      "price": "1500.00"
    },
    "status": "ACTIVE",
    "period_start": "2024-04-01",
    "period_end": "2024-05-01",
    "next_billing_date": "2024-05-01",
    "machines_used": 2,
    "machines_limit": 3,
    "quotes_this_month": 45,
    "quotes_limit": 100
  }
}
```

### 5. POST /api/subscriptions/upgrade/
**Purpose:** Upgrade subscription to higher tier
**Request:**
```json
{
  "new_plan_id": 3,
  "phone": "254712345678"
}
```
**Logic:**
- Calculate pro-rated amount for remaining days in current billing period
- Initiate STK Push for pro-rated amount
- Upon success: Update subscription.plan, update period_end
- Issue credit or refund for overpayment if downgrading

### 6. POST /api/subscriptions/downgrade/
**Purpose:** Downgrade to lower tier (or KARIBU)
**Request:**
```json
{
  "new_plan_id": 1
}
```
**Logic:**
- Calculate pro-rated refund
- Credit refund to next month or issue M-Pesa refund
- Downgrade features immediately
- Notify via email with downgrade reason

---

## M-PESA STK PUSH FLOW (DETAILED)

### Initiation:
1. Shop selects tier & provides phone
2. Backend calls Safaricom Daraja API
3. Create MpesaStkRequest record (status=INITIATED)
4. User receives STK prompt on phone
5. User enters M-Pesa PIN

### Daraja API Call:
```python
# Use Pesapal or Jambopay SDK, or direct Daraja

endpoint = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}
payload = {
    "BusinessShortCode": settings.MPESA_BUSINESS_SHORTCODE,
    "Password": generate_password(settings.MPESA_BUSINESS_SHORTCODE, settings.MPESA_PASSKEY, timestamp),
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount_in_kes,
    "PartyA": phone_number,
    "PartyB": settings.MPESA_BUSINESS_SHORTCODE,
    "PhoneNumber": phone_number,
    "CallBackURL": settings.MPESA_CALLBACKURL,
    "AccountReference": f"PRINTY_{subscription.id}_{plan.name}",
    "TransactionDesc": f"Printy subscription - {plan.name}"
}
```

### Callback Handling:
```python
# Safaricom sends callback with ResultCode

if ResultCode == 0:
    # SUCCESS
    - receipt_number = CallbackMetadata['Item'][1]['Value']
    - transaction_id = CallbackMetadata['Item'][2]['Value']
    - Update MpesaStkRequest: status=SUCCESS, receipt_number
    - Create Payment record: status=COMPLETED, receipt_number
    - Update Subscription: status=ACTIVE, period_start=today, period_end=today+30, next_billing_date=today+30, failed_payment_attempts=0
    - Send confirmation email to shop
else:
    # FAILURE
    - Update MpesaStkRequest: status=FAILED, raw_callback_payload
    - Increment Subscription.failed_payment_attempts
    - If failed_payment_attempts < 4: Schedule retry in 60 seconds
    - If failed_payment_attempts >= 4: Downgrade to KARIBU, send email
```

---

## USAGE LIMITS ENFORCEMENT

### Checks to implement in Quote creation:

```python
def can_create_quote(shop):
    subscription = shop.subscription
    plan = subscription.plan
    
    # Check monthly limit
    quotes_this_month = Quote.objects.filter(
        shop=shop,
        created_at__gte=subscription.period_start
    ).count()
    
    if quotes_this_month >= plan.max_monthly_quotes:
        raise SubscriptionLimitError(
            f"Monthly quote limit ({plan.max_monthly_quotes}) reached. Upgrade to continue."
        )
    
    return True
```

### Checks in machine/product creation:
```python
def can_add_machine(shop):
    subscription = shop.subscription
    plan = subscription.plan
    
    machines_count = shop.machines.filter(active=True).count()
    
    if machines_count >= plan.max_machines:
        raise SubscriptionLimitError(
            f"Machine limit ({plan.max_machines}) reached. Upgrade to continue."
        )
```

---

## TESTING REQUIREMENTS

### Unit tests:
1. Test tier feature flags (branded_quotes, api_access, etc)
2. Test usage limit enforcement
3. Test upgrade/downgrade prorating
4. Test payment failure retry logic
5. Test M-Pesa callback parsing

### Integration tests:
1. Test full STK Push flow (mock Daraja API)
2. Test subscription state transitions
3. Test trial → paid conversion
4. Test downgrade after failed payments
5. Test multiple payment attempts

### Manual testing checklist:
- [ ] Free trial converts to HATUA with M-Pesa
- [ ] Failed payment attempt 1 → retry after 60 sec
- [ ] Failed payment attempt 4 → downgrade to KARIBU
- [ ] Upgrade from HATUA → KAZI mid-month (pro-rated charge)
- [ ] Downgrade from KAZI → HATUA mid-month (pro-rated refund)
- [ ] Usage limits enforced (max machines, quotes, products)
- [ ] Branded quotes only available on HATUA+
- [ ] API calls only available on BIASHARA_PLUS

---

## IMPLEMENTATION ORDER

1. **Database:** Add new fields to SubscriptionPlan model + migration
2. **Settings:** Add SUBSCRIPTION_TIERS config + M-Pesa credentials
3. **Models:** Update Subscription model with new fields
4. **Data:** Create migration to seed 4 tiers
5. **API:** Build /plans/, /stk-push/, /mpesa-callback/ endpoints
6. **Billing logic:** Implement retry, downgrade, proration logic
7. **Usage enforcement:** Add limit checks in quote/machine/product creation
8. **Dashboard:** Show usage stats vs limits for each shop
9. **Tests:** Write comprehensive test suite
10. **Admin:** Configure admin interface for tier management

---

## DO NOT ASSUME

- Do NOT assume Pesapal integration exists; specify which M-Pesa library to use
- Do NOT assume retry logic is implemented; specify exact retry intervals
- Do NOT assume proration math is correct; include exact formulas
- Do NOT assume callback URL is configured; specify environment variable names
- Do NOT assume usage limits are enforced; specify which models to check
- Do NOT assume tiers are seeded; provide exact migration code
- Do NOT assume test data exists; provide fixtures for each tier

---

## QUESTIONS TO AVOID

"Should we use Celery for retries?"
→ **Answer:** For MVP, use synchronous retries with time.sleep() or APScheduler for background tasks. Later, migrate to Celery if needed.

"What about annual billing?"
→ **Answer:** For MVP, implement MONTHLY only. Annual comes in phase 2.

"Should we support team invites?"
→ **Answer:** For MVP, max_team_users is a soft limit; enforce via UI only. Database support for team members comes in phase 2.

"What if a shop has no phone number?"
→ **Answer:** Phone number is REQUIRED for subscription. Shop must provide it before upgrading.

