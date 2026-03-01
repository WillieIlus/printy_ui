# Backend Implementation: Template Calculate Price + Imposition

This document describes the backend changes needed to extend the template price calculation endpoint with imposition fields and shop pricing. Apply these changes in your Django backend repo.

## 1. Model Change (if required)

Add to `PrintTemplate` (or equivalent template model):

```python
# models.py
class PrintTemplate(models.Model):
    # ... existing fields ...
    ups_per_sheet = models.IntegerField(null=True, blank=True)  # Units per sheet for imposition
```

Migration:

```bash
python manage.py makemigrations --name add_printtemplate_ups_per_sheet
python manage.py migrate
```

## 2. Serializer Updates

**Request (additive):**

```python
class TemplateCalculatePriceSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    gsm = serializers.IntegerField()
    print_sides = serializers.ChoiceField(choices=['SIMPLEX', 'DUPLEX'])
    selected_option_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    selected_finishing_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    shop_slug = serializers.SlugField(required=False, allow_blank=True)  # NEW: use shop pricing
```

**Response (additive):**

```python
class TemplatePriceResponseSerializer(serializers.Serializer):
    total = serializers.DecimalField(...)
    breakdown = TemplatePriceBreakdownSerializer(many=True, required=False)
    currency = serializers.CharField(required=False)
    # NEW imposition fields
    ups_per_sheet = serializers.IntegerField(allow_null=True, required=False)
    sheets_needed = serializers.IntegerField(allow_null=True, required=False)
    calculation_steps = serializers.ListField(child=serializers.CharField(), required=False)
    notes = serializers.ListField(child=serializers.CharField(), required=False)
```

## 3. View/Service Logic

In the `calculate_price` action (or equivalent):

```python
def calculate_price(self, request, slug=None):
    template = self.get_object()
    serializer = TemplateCalculatePriceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    quantity = data['quantity']
    shop_slug = data.get('shop_slug')

    # Resolve pricing: use shop pricing if shop_slug provided, else defaults
    if shop_slug:
        # Fetch shop, use shop's printing/paper/finishing prices
        pricing = get_shop_pricing(shop_slug, ...)
    else:
        pricing = get_default_pricing(...)

    # Compute price (existing logic)
    total, breakdown = compute_price(template, data, pricing)

    # Imposition
    ups_per_sheet = template.ups_per_sheet
    sheets_needed = None
    calculation_steps = []
    notes = []

    if ups_per_sheet and ups_per_sheet > 0:
        import math
        sheets_needed = math.ceil(quantity / ups_per_sheet)
        calculation_steps.append(f"{quantity} ÷ {ups_per_sheet} = {sheets_needed} sheets")
        if quantity % ups_per_sheet != 0:
            notes.append("Rounded up to whole sheets")

    return Response({
        'total': total,
        'breakdown': breakdown,
        'currency': 'KES',
        'ups_per_sheet': ups_per_sheet,
        'sheets_needed': sheets_needed,
        'calculation_steps': calculation_steps,
        'notes': notes,
    })
```

## 4. Tests

```python
# tests/test_template_calculate_price.py
def test_imposition_quantity_500_ups_25_sheets_20(self):
    template = PrintTemplate.objects.create(slug='test', ups_per_sheet=25, ...)
    response = self.client.post(
        f'/api/templates/{template.slug}/calculate-price/',
        {'quantity': 500, 'gsm': 150, 'print_sides': 'DUPLEX'},
        format='json'
    )
    assert response.status_code == 200
    assert response.data['sheets_needed'] == 20
    assert response.data['ups_per_sheet'] == 25
    assert '500 ÷ 25 = 20 sheets' in response.data['calculation_steps']
    assert response.data['notes'] == []

def test_imposition_quantity_501_ups_25_sheets_21(self):
    template = PrintTemplate.objects.create(slug='test', ups_per_sheet=25, ...)
    response = self.client.post(
        f'/api/templates/{template.slug}/calculate-price/',
        {'quantity': 501, 'gsm': 150, 'print_sides': 'DUPLEX'},
        format='json'
    )
    assert response.status_code == 200
    assert response.data['sheets_needed'] == 21
    assert '501 ÷ 25 = 21 sheets' in response.data['calculation_steps']
    assert 'Rounded up to whole sheets' in response.data['notes']
```

## 5. URL Pattern

Ensure the action is registered:

```python
# urls.py or router
router.register(r'templates', TemplateViewSet, basename='template')
# ViewSet should have: @action(detail=True, methods=['post'], url_path='calculate-price')
```

## 6. Backward Compatibility

- All new response fields are optional (additive).
- Existing clients ignoring them will continue to work.
- `shop_slug` in request is optional; when omitted, use default/global pricing.
