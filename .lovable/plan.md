
## Plan: Mooiere nieuwsbrief feedback op homepage

### Probleem
Op de homepage staat een "Join the Movement" sectie met newsletter signup die nog de oude saaie feedback toont ("Welcome to the movement. You're in."). De footer heeft al de mooie feedback met goud accent + check icon + toast.

### Aanpak
Dezelfde patroon als footer toepassen op de homepage newsletter sectie in `src/pages/Index.tsx`:
- Toast success notificatie via `sonner`
- Gestylede success card met `border-l-2 border-primary`, `Check` icon, fade-in animatie
- Button loading state "Subscribing..."

### Wijziging
**`src/pages/Index.tsx`** — newsletter signup blok:
- Importeer `Check` van lucide-react en `toast` van sonner (indien nog niet)
- Vervang de simpele submitted-tekst door dezelfde success card als in footer
- Voeg `toast.success()` toe na succesvolle inschrijving
- Update button loading text

### Resultaat
Consistente luxury feedback experience op beide newsletter signups (homepage + footer).
