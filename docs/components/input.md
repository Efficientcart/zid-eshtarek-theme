# Input

A form input field with optional start/end icons and multiple states.

## Overview

The Input component provides a form input with optional start and end icons, helper text, error states, and all standard input types. Use the separate Label component above the input for accessible form fields.

## Usage

```jinja
{% with name="email", placeholder=_("Enter email") %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

## Examples

### Basic

Simple text input.

```jinja
{% with name="username", placeholder=_("Username") %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Label

Combine with the Label component for accessible forms.

```jinja
<div class="grid w-full items-center gap-2">
  {% with for="email", content=_("Email"), required=true %}
    {% include 'components/ui/label.jinja' %}
  {% endwith %}
  {% with id="email", name="email", type="email", required=true, placeholder=_("Enter your email") %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}
</div>
```

### With Start Icon

Add an icon at the start of the input.

```jinja
{% set icon_user %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
{% endset %}

<div class="grid w-full items-center gap-2">
  {% with for="username", content=_("Username") %}
    {% include 'components/ui/label.jinja' %}
  {% endwith %}
  {% with id="username", name="username", icon_start=icon_user, placeholder=_("Enter username") %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}
</div>
```

### With End Icon

Add an icon at the end of the input.

```jinja
{% set icon_search %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
{% endset %}

{% with name="search", icon_end=icon_search, placeholder=_("Search...") %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Both Icons

Combine start and end icons.

```jinja
{% set icon_mail %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
{% endset %}

{% set icon_check %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
{% endset %}

{% with name="email", icon_start=icon_mail, icon_end=icon_check, value="verified@example.com" %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Caption

Add helper text below the input.

```jinja
<div class="grid w-full items-center gap-2">
  {% with for="phone", content=_("Phone Number") %}
    {% include 'components/ui/label.jinja' %}
  {% endwith %}
  {% with id="phone", name="phone", type="tel", caption=_("We'll only use this for delivery coordination") %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}
</div>
```

### Error State

Input with error styling and message.

```jinja
<div class="grid w-full items-center gap-2">
  {% with for="email", content=_("Email"), required=true %}
    {% include 'components/ui/label.jinja' %}
  {% endwith %}
  {% with id="email", name="email", type="email", error=true, error_message=_("Please enter a valid email address") %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}
</div>
```

### Disabled State

Disabled input with styling.

```jinja
<div class="grid w-full items-center gap-2">
  {% with for="readonly", content=_("Read Only"), disabled=true %}
    {% include 'components/ui/label.jinja' %}
  {% endwith %}
  {% with id="readonly", name="readonly", disabled=true, value="Cannot be edited" %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}
</div>
```

## Real-World Examples

### Login Form

```jinja
<form method="post" action="/login" class="space-y-4">
  <div class="grid w-full items-center gap-2">
    {% with for="email", content=_("Email"), required=true %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with
      id="email",
      name="email",
      type="email",
      autocomplete="email",
      required=true,
      error=login_error,
      error_message=_("Invalid email or password")
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  <div class="grid w-full items-center gap-2">
    {% with for="password", content=_("Password"), required=true %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with
      id="password",
      name="password",
      type="password",
      autocomplete="current-password",
      required=true
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  {% with content=_("Sign In"), variant="filled", size="lg", type="submit" %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

### Contact Form

```jinja
{% set icon_user %}...{% endset %}
{% set icon_mail %}...{% endset %}
{% set icon_phone %}...{% endset %}

<form method="post" action="/contact" class="space-y-4">
  <div class="grid w-full items-center gap-2">
    {% with for="name", content=_("Full Name"), required=true %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with id="name", name="name", icon_start=icon_user, required=true %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  <div class="grid w-full items-center gap-2">
    {% with for="email", content=_("Email Address"), required=true %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with id="email", name="email", type="email", icon_start=icon_mail, autocomplete="email", required=true %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  <div class="grid w-full items-center gap-2">
    {% with for="phone", content=_("Phone Number") %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with id="phone", name="phone", type="tel", icon_start=icon_phone, autocomplete="tel" %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  {% with content=_("Send Message"), variant="filled", size="lg", type="submit" %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

### Shipping Address Form

```jinja
<form method="post" action="/checkout/shipping" class="space-y-4">
  <div class="grid gap-4 md:grid-cols-2">
    <div class="grid w-full items-center gap-2">
      {% with for="first_name", content=_("First Name"), required=true %}
        {% include 'components/ui/label.jinja' %}
      {% endwith %}
      {% with id="first_name", name="first_name", required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>

    <div class="grid w-full items-center gap-2">
      {% with for="last_name", content=_("Last Name"), required=true %}
        {% include 'components/ui/label.jinja' %}
      {% endwith %}
      {% with id="last_name", name="last_name", required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>
  </div>

  <div class="grid w-full items-center gap-2">
    {% with for="address", content=_("Street Address"), required=true %}
      {% include 'components/ui/label.jinja' %}
    {% endwith %}
    {% with id="address", name="address", required=true %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>

  <div class="grid gap-4 md:grid-cols-3">
    <div class="grid w-full items-center gap-2">
      {% with for="city", content=_("City"), required=true %}
        {% include 'components/ui/label.jinja' %}
      {% endwith %}
      {% with id="city", name="city", required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>

    <div class="grid w-full items-center gap-2">
      {% with for="state", content=_("State / Province"), required=true %}
        {% include 'components/ui/label.jinja' %}
      {% endwith %}
      {% with id="state", name="state", required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>

    <div class="grid w-full items-center gap-2">
      {% with for="postal_code", content=_("Postal Code"), required=true %}
        {% include 'components/ui/label.jinja' %}
      {% endwith %}
      {% with id="postal_code", name="postal_code", required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>
  </div>
</form>
```

## States

The input component supports these visual states:

| State    | Border                    | Background    | Description                     |
|----------|---------------------------|---------------|---------------------------------|
| Default  | 1px `#545352`             | transparent   | Normal state                    |
| Hover    | 2px `#545352`             | transparent   | Mouse over                      |
| Focus    | 2px `--primary`           | transparent   | Keyboard/click focus            |
| Error    | 2px `--destructive`       | transparent   | Validation error                |
| Disabled | 1px `#DADADA`             | `#F2F2F2`     | Cannot interact                 |

## API Reference

### Parameters

| Parameter      | Type      | Default  | Description                                           |
|----------------|-----------|----------|-------------------------------------------------------|
| `type`         | `string`  | `"text"` | Input type (text, email, password, tel, search, etc.) |
| `name`         | `string`  | -        | Form field name                                       |
| `id`           | `string`  | Auto     | Input ID (auto-generated if not provided)             |
| `value`        | `string`  | -        | Initial/current value                                 |
| `placeholder`  | `string`  | -        | Placeholder text                                      |
| `required`     | `boolean` | `false`  | Mark as required                                      |
| `disabled`     | `boolean` | `false`  | Disable the input                                     |
| `readonly`     | `boolean` | `false`  | Make input read-only                                  |
| `autocomplete` | `string`  | -        | HTML autocomplete attribute                           |
| `inputmode`    | `string`  | -        | Input mode for mobile keyboards                       |
| `minlength`    | `number`  | -        | Minimum length validation                             |
| `maxlength`    | `number`  | -        | Maximum length validation                             |
| `pattern`      | `string`  | -        | Regex pattern validation                              |
| `icon_start`   | `string`  | -        | HTML/SVG for start icon (24x24)                       |
| `icon_end`     | `string`  | -        | HTML/SVG for end icon (24x24)                         |
| `caption`      | `string`  | -        | Helper text below input                               |
| `error`        | `boolean` | `false`  | Enable error state                                    |
| `error_message`| `string`  | -        | Error message (replaces caption when error)           |
| `wrapper_class`| `string`  | -        | Additional CSS classes for wrapper                    |
| `input_class`  | `string`  | -        | Additional CSS classes for input element              |
| `attrs`        | `string`  | -        | Raw HTML attributes for input                         |

## Accessibility

- Uses semantic `<input>` with proper `type` attribute
- Use Label component separately with matching `for`/`id` attributes
- Required fields use `required` attribute for validation
- Error states use `aria-invalid="true"`
- Disabled state prevents interaction
- Focus states are clearly visible
- Icons are 24x24 and decorative (no aria labels needed)

## Source Code

[`components/ui/input.jinja`](../../components/ui/input.jinja)
