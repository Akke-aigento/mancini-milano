

## Plan: Mooiere nieuwsbrief feedback

### Huidige situatie
In `src/components/layout/Footer.tsx`:
- Na succesvolle inschrijving: alleen tekst "Welcome to the movement. You're in. ✓"
- Bij fout: `toast.error()`
- Geen visuele feedback tijdens submit

### Voorgestelde verbeteringen

**1. Toast notificatie toevoegen**
```typescript
toast.success('Je bent ingeschreven!', {
  description: 'Welcome to the movement. Verwacht exclusieve drops en updates.',
});
```

**2. Success state visueel verbeteren**
In plaats van simpele tekst → mooiere card met:
- Goud accent (border of icon)
- Check icon
- Betere typografie
- Subtle fade-in animatie

**3. Loading state verbeteren**
Button tekst: "..." → "Subscribing..." of spinner

### Concrete wijzigingen

**`src/components/layout/Footer.tsx`**:
- Regel ~90: `toast.success()` toevoegen na `setSubmitted(true)`
- Regel ~75-77: success state vervangen door gestylede div met:
  - `border-l-4 border-primary` (goud accent)
  - Check icon (uit lucide-react)
  - Betere spacing en typografie
  - `animate-in fade-in` voor smooth entry
- Regel ~100: loading state text verbeteren

### Voorbeeld success UI
```tsx
<div className="border-l-4 border-primary bg-primary/5 p-4 animate-in fade-in">
  <div className="flex items-center gap-3">
    <Check className="h-5 w-5 text-primary" />
    <div>
      <p className="text-sm font-medium text-foreground">Je bent ingeschreven!</p>
      <p className="text-xs text-muted-foreground mt-1">Verwacht exclusieve drops in je inbox.</p>
    </div>
  </div>
</div>
```

### Resultaat
- Toast notificatie verschijnt rechtsonder (sonner default)
- Success state in footer zelf is visueel aantrekkelijk met goud accent
- Duidelijke feedback tijdens hele flow (loading → success → permanent state)
- Aligned met dark luxury aesthetic

