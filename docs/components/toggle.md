# Toggle

A control that allows the user to toggle between on and off states, commonly used for binary settings and preferences.

## Overview

The Toggle (or Switch) component is an accessible form control that allows users to turn options on or off. It provides a clear visual representation of the current state with smooth animations. It's built with a native checkbox input and custom styling for a modern appearance.

## Usage

```jinja
{% with label='Enable notifications', id='notifications', name='notifications' %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

## Examples

### Basic Toggle

Simple toggle with label.

```jinja
{% with label='Dark mode', id='dark-mode', name='dark_mode' %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

### Toggle Without Label

Toggle without visible label (use `aria-label` for accessibility).

```jinja
{% with id='feature', name='feature', attrs='aria-label="Enable feature"' %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

### Checked by Default

Use the `checked` parameter to set initial on state.

```jinja
{% with label='Auto-save', id='auto-save', name='auto_save', checked=true %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

### Disabled Toggle

Disable interaction with the `disabled` parameter.

```jinja
{% with label='Unavailable feature', id='unavailable', name='unavailable', disabled=true %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

### Required Toggle

Mark as required for form validation.

```jinja
{% with label='I accept the terms', id='terms', name='terms', required=true %}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

### Toggle with Data Attributes

Pass custom attributes for JavaScript interaction.

```jinja
{% with
  label='Enable 2FA',
  id='2fa',
  name='two_factor',
  attrs='data-security="high" data-feature="authentication"'
%}
  {% include 'components/ui/toggle.jinja' %}
{% endwith %}
```

## Real-World Examples

### Account Settings

```jinja
<form method="post" action="/account/settings">
  <h3>Privacy Settings</h3>
  <div class="flex flex-col gap-4">
    {% with
      label='Show my profile publicly',
      id='public-profile',
      name='public_profile',
      checked=(user.settings.public_profile)
    %}
      {% include 'components/ui/toggle.jinja' %}
    {% endwith %}

    {% with
      label='Allow search engines to index my profile',
      id='searchable',
      name='searchable',
      checked=(user.settings.searchable)
    %}
      {% include 'components/ui/toggle.jinja' %}
    {% endwith %}

    {% with
      label='Show my activity status',
      id='activity-status',
      name='activity_status',
      checked=(user.settings.activity_status)
    %}
      {% include 'components/ui/toggle.jinja' %}
    {% endwith %}
  </div>

  {% with content='Save settings', variant='filled', size='lg', type='submit' %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

### Notification Preferences

```jinja
<div class="flex flex-col gap-4">
  <h3>Email Notifications</h3>

  {% with
    label='Order updates',
    id='notify-orders',
    name='notifications[]',
    value='orders',
    checked=('orders' in user.notifications)
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}

  {% with
    label='Promotional emails',
    id='notify-promos',
    name='notifications[]',
    value='promos',
    checked=('promos' in user.notifications)
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}

  {% with
    label='Product recommendations',
    id='notify-recommendations',
    name='notifications[]',
    value='recommendations',
    checked=('recommendations' in user.notifications)
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}

  {% with
    label='Weekly newsletter',
    id='notify-newsletter',
    name='notifications[]',
    value='newsletter',
    checked=('newsletter' in user.notifications)
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}
</div>
```

### Product Features

```jinja
<div class="flex flex-col gap-4">
  <h3>Additional Features</h3>

  {% with
    label='Gift wrapping (+$5.00)',
    id='gift-wrap',
    name='gift_wrap'
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}

  {% with
    label='Express shipping (+$15.00)',
    id='express',
    name='express_shipping'
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}

  {% with
    label='Include receipt',
    id='receipt',
    name='include_receipt',
    checked=true
  %}
    {% include 'components/ui/toggle.jinja' %}
  {% endwith %}
</div>
```

## API Reference

### Parameters

| Parameter       | Type      | Default | Description                                      |
|----------------|-----------|---------|--------------------------------------------------|
| `label`        | `string`  | -       | Text label displayed next to toggle              |
| `id`           | `string`  | Required| Unique identifier for the toggle                 |
| `name`         | `string`  | Required| Form field name for submission                   |
| `value`        | `string`  | `on`    | Value submitted when checked                     |
| `checked`      | `boolean` | `false` | Initial on/off state                             |
| `disabled`     | `boolean` | `false` | Disables the toggle                              |
| `required`     | `boolean` | `false` | Marks as required for validation                 |
| `class`        | `string`  | -       | Additional CSS classes for the input             |
| `wrapper_class`| `string`  | -       | Additional CSS classes for the wrapper label     |
| `attrs`        | `string`  | -       | Raw HTML attributes (data-*, aria-*, etc.)       |

## Accessibility

- Always provide a `label` or `aria-label` for screen readers
- Uses semantic `<input type="checkbox">` for native browser support
- Toggles are keyboard accessible (Tab, Space)
- Visual indicator (circle position) clearly shows on/off state
- Disabled state prevents interaction
- Use `required` attribute for form validation
- RTL support automatically adjusts circle movement direction

## Source Code

[`components/ui/toggle.jinja`](../../components/ui/toggle.jinja)
