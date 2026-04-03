

# Splash Screen: Zachtere Fade-out

## Probleem
De fade-out duurt 500ms (`duration-500`) maar het component wordt na exact 500ms uit de DOM verwijderd. Door timing-mismatch "springt" het weg voordat de transitie klaar is.

## Oplossing in `src/components/SplashScreen.tsx`

### 1. Langere fade-out duur
- Wijzig `duration-500` naar `duration-1000` (1 seconde fade)
- Voeg ook de opacity-transitie toe aan het logo zelf zodat het mee-fadet

### 2. Gebruik `onTransitionEnd` i.p.v. harde timer
- Verwijder de `doneTimer` (regel 18) en de `setTimeout` in `handleClose` (regel 29)
- Voeg `onTransitionEnd` toe aan de overlay-div die `setPhase('done')` aanroept wanneer de fade-out klaar is
- Pas de auto-timer aan: `outTimer` op 2500ms, geen `doneTimer` meer

### 3. Subtiele scale-down bij fade-out
- Logo schaalt licht terug (`scale(0.97)`) tijdens de out-fase voor een vloeiender gevoel

### Resultaat
De overlay fadet geleidelijk uit over 1 seconde en verdwijnt pas uit de DOM wanneer de CSS-transitie daadwerkelijk afgelopen is — geen "sprong" meer.

### Eén file

