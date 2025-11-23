# Radio

A control that allows the user to select a single option from a group of choices.

## Overview

The Radio component is a simple, accessible form control that allows users to select one option from a set of mutually exclusive choices. It's built with native HTML radio inputs and custom styling for a consistent appearance across browsers.

## Usage

```jinja
{% with label='Option 1', id='option1', name='choice', value='1' %}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

## Examples

### Basic Radio Group

Simple radio buttons with labels.

```jinja
<div class="flex flex-col gap-3">
  {% with label='Small', id='size-s', name='size', value='s' %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with label='Medium', id='size-m', name='size', value='m', checked=true %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with label='Large', id='size-l', name='size', value='l' %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}
</div>
```

### Radio Without Label

Radio without visible label (use `aria-label` for accessibility).

```jinja
{% with id='choice-a', name='choice', value='a', attrs='aria-label="Choice A"' %}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

### Checked by Default

Use the `checked` parameter to set initial state.

```jinja
{% with label='Default option', id='default', name='selection', value='default', checked=true %}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

### Disabled Radio

Disable interaction with the `disabled` parameter.

```jinja
{% with label='Unavailable option', id='unavailable', name='choice', value='unavailable', disabled=true %}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

### Required Radio

Mark as required for form validation.

```jinja
{% with label='I agree to the terms', id='agree', name='agreement', value='yes', required=true %}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

### Radio with Data Attributes

Pass custom attributes for JavaScript interaction.

```jinja
{% with
  label='Express shipping',
  id='express',
  name='shipping',
  value='express',
  attrs='data-price="15.00" data-days="1-2"'
%}
  {% include 'components/ui/radio.jinja' %}
{% endwith %}
```

## Real-World Examples

### Shipping Method Selection

```jinja
<form method="post" action="/checkout">
  <h3>Select shipping method</h3>
  <div class="flex flex-col gap-4">
    {% with
      label='Standard shipping (5-7 days) - Free',
      id='shipping-standard',
      name='shipping_method',
      value='standard',
      checked=true
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Express shipping (2-3 days) - $10.00',
      id='shipping-express',
      name='shipping_method',
      value='express'
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Next day delivery - $25.00',
      id='shipping-next-day',
      name='shipping_method',
      value='next_day'
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Payment Method Selection

```jinja
<div class="flex flex-col gap-3">
  <h3>Payment method</h3>

  {% with
    label='Credit Card',
    id='payment-card',
    name='payment_method',
    value='card',
    checked=true
  %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with
    label='PayPal',
    id='payment-paypal',
    name='payment_method',
    value='paypal'
  %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with
    label='Bank Transfer',
    id='payment-bank',
    name='payment_method',
    value='bank'
  %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with
    label='Cash on Delivery',
    id='payment-cod',
    name='payment_method',
    value='cod'
  %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}
</div>
```

### Product Sorting Options

```jinja
<form method="get" action="/products">
  <h3>Sort by</h3>
  <div class="flex flex-col gap-3">
    {% with
      label='Most popular',
      id='sort-popular',
      name='sort',
      value='popular',
      checked=(request.args.get('sort') == 'popular')
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Newest',
      id='sort-newest',
      name='sort',
      value='newest',
      checked=(request.args.get('sort') == 'newest')
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Price: Low to High',
      id='sort-price-asc',
      name='sort',
      value='price-asc',
      checked=(request.args.get('sort') == 'price-asc')
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Price: High to Low',
      id='sort-price-desc',
      name='sort',
      value='price-desc',
      checked=(request.args.get('sort') == 'price-desc')
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Product Variant Selection

```jinja
<div class="flex flex-col gap-3">
  <h3>Select color</h3>
  {% for color in product.colors %}
    {% with
      label=color.name,
      id='color-' ~ color.id,
      name='color',
      value=color.id,
      checked=(loop.first)
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}
  {% endfor %}
</div>
```

### Subscription Plan Selection

```jinja
<form method="post" action="/subscribe">
  <h3>Choose your plan</h3>
  <div class="flex flex-col gap-4">
    {% with
      label='Basic - $9.99/month',
      id='plan-basic',
      name='plan',
      value='basic'
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Pro - $19.99/month (Most Popular)',
      id='plan-pro',
      name='plan',
      value='pro',
      checked=true
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}

    {% with
      label='Enterprise - $49.99/month',
      id='plan-enterprise',
      name='plan',
      value='enterprise'
    %}
      {% include 'components/ui/radio.jinja' %}
    {% endwith %}
  </div>

  {% with content='Continue', variant='filled', size='lg', type='submit' %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

## API Reference

### Parameters

| Parameter       | Type      | Default | Description                                      |
|----------------|-----------|---------|--------------------------------------------------|
| `label`        | `string`  | -       | Text label displayed next to radio              |
| `id`           | `string`  | Required| Unique identifier for the radio                  |
| `name`         | `string`  | Required| Form field name (must be same for all in group)  |
| `value`        | `string`  | Required| Value submitted when selected                    |
| `checked`      | `boolean` | `false` | Initial checked state                            |
| `disabled`     | `boolean` | `false` | Disables the radio                               |
| `required`     | `boolean` | `false` | Marks as required for validation                 |
| `class`        | `string`  | -       | Additional CSS classes for the input             |
| `wrapper_class`| `string`  | -       | Additional CSS classes for the wrapper label     |
| `attrs`        | `string`  | -       | Raw HTML attributes (data-*, aria-*, etc.)       |

## Accessibility

- Always provide a `label` or `aria-label` for screen readers
- Use semantic `<input type="radio">` for native browser support
- Radio buttons are keyboard accessible (Tab, Arrow keys, Space)
- Group related radios with the same `name` attribute
- Disabled state prevents interaction
- Use `required` attribute for form validation
- Only one radio in a group can be selected at a time


## Customization

### Horizontal Radio Group
```jinja
<div class="flex gap-4">
  {% with label='Yes', id='answer-yes', name='answer', value='yes' %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}

  {% with label='No', id='answer-no', name='answer', value='no' %}
    {% include 'components/ui/radio.jinja' %}
  {% endwith %}
</div>
```
## Source Code

[`components/ui/radio.jinja`](../../components/ui/radio.jinja)
