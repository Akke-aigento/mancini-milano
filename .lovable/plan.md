

## Add loading spinner to discount code button

### Problem
When applying a discount code, there's no visual feedback that the request is being processed. The button just sits there, making it unclear whether the code was registered.

### Fix — `src/pages/Checkout.tsx`

1. **Add `isApplyingDiscount` state** (boolean, default false)
2. **Wrap `handleApplyDiscount` logic** with `setIsApplyingDiscount(true)` at the start and `false` in a `finally` block
3. **Update the "Toepassen" button** (line 175-181):
   - Disable when `isApplyingDiscount` is true (in addition to empty input)
   - Show `<Loader2 className="h-3 w-3 animate-spin" />` instead of "Toepassen" text while loading
4. **Disable the input** during loading to prevent double-submission

### Files to edit
1. `src/pages/Checkout.tsx` — add state + spinner to discount button

