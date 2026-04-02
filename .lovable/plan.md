

# Fix: Save Buttons on Account Page — Correct API Payload Structure

## Problem
The save buttons for profile, address, and newsletter don't work because the API payloads are structured incorrectly. Comparing with the working Vanxcel project reveals the differences.

## Root Causes

### 1. Address: fields sent flat instead of nested
**Current (broken):**
```json
{ "action": "add_address", "params": { "street": "...", "city": "...", "is_default": true } }
```
**Expected (from Vanxcel):**
```json
{ "action": "add_address", "params": { "address": { "street": "...", "city": "...", "is_default": true } } }
```
Same for `update_address` — needs `{ address_id: "...", address: { ... } }`.

### 2. `updateProfile` response handling
The `updateProfile` function assumes the API returns the updated customer directly as `data`. If the API returns it nested (e.g. `data.customer`), it would silently fail to update the local state. We should add `refreshProfile()` as a fallback to ensure state is always correct after save.

## Changes

### 1. `src/pages/Account.tsx` — Fix AddressTab payload

Update the `handleSave` in `AddressTab` to wrap address fields in an `address` object:
```typescript
const action = addr?.id ? "update_address" : "add_address";
const addressData = { street, house_number: houseNumber, postal_code: postalCode, city, country, is_default: true };
const payload: Record<string, unknown> = { address: addressData };
if (addr?.id) payload.address_id = addr.id;
```

### 2. `src/integrations/sellqo/CustomerAuthContext.tsx` — Robust updateProfile

After calling `update_profile`, call `refreshProfile()` to ensure the local state matches reality, regardless of what the API returns:
```typescript
const updateProfile = async (data) => {
  if (!token) return;
  await customerApiFetch("update_profile", data, token);
  // Always refresh to get the latest state
  const profile = await customerApiFetch<Customer>("get_profile", {}, token);
  setCustomer(profile);
};
```

### Two files
- `src/pages/Account.tsx`
- `src/integrations/sellqo/CustomerAuthContext.tsx`

