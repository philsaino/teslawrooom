# Tesla Wrooom 🏎️⚡

Generatore di suono motore endotermico in tempo reale per Tesla, eseguibile direttamente dal browser di bordo della vettura (MCU2 / Ryzen) senza installazioni, hardware OBD o costi di licenza.

**Live App:** [https://philsaino.github.io/teslawrooom/](https://philsaino.github.io/teslawrooom/)

---

## 💡 Caratteristiche

- **Nessuna installazione né hardware:** gira nel browser integrato della Tesla tramite Web Audio API e Geolocation API nativi.
- **Audio multi-sample a zero latenza:** mix continuo tra campioni WAV per RPM crescenti con interpolazione fine del `playbackRate`.
- **UI Touchscreen Cockpit Mode:** interfaccia scura ad altissimo contrasto con cifre tachimetro da 120px e pulsanti touch oversize pensati per l'uso in auto.
- **Due modalità di guida:**
  - `MONOMARCIA EV (NATIVO TESLA)`: erogazione continua proporzionale alla velocità effettiva, coerente con la trasmissione a rapporto fisso dell'elettrico. A 130 km/h il motore viaggia a ~3.300 RPM, fino a ~5.000 RPM a 230 km/h.
  - `CAMBIO VIRTUAL (1-8 MARCE)`: simulatore centralina cambio automatico (stile ZF 8HP) con logica adattiva, marce di riposo in crociera (overdrive) e scalata rapida su forte accelerazione.
- **Slider di simulazione:** test a banco da computer o smartphone per provare curve e regimi senza muovere il veicolo.

---

## ⚙️ Come funziona

1. **Rilevamento velocità:** il browser interroga la `navigator.geolocation` dell'auto ricavando la velocità in km/h.
2. **Filtro accelerazione (Throttle virtuale):** un filtro asimmetrico passa-basso calcola la derivata della velocità rispetto al tempo:
   - Salita rapida (`α = 0.40`) quando premi l'acceleratore.
   - Decadimento morbido (`α = 0.15`) al rilascio per evitare scatti acustici.
3. **Logica Cambio Adattivo (TCU):**
   - **In crociera** (`throttle < 0.15`): sale progressivamente fino all'8ª marcia per mantenere il motore basso (~1.200 - 1.600 RPM).
   - **In piena accelerazione:** sposta la soglia di cambiata fino a oltre 5.400 RPM.
   - **Anti-hunting:** cooldown di 1,2 secondi tra una cambiata e l'altra con isteresi termica per eliminare qualsiasi cambio marcia casuale o pendolamento.

---

## 🚀 Utilizzo in Tesla

1. Nella Tesla premi l'icona **Applicazioni** -> **Browser**.
2. Digita l'indirizzo: `https://philsaino.github.io/teslawrooom/`
3. Salva la pagina tra i **Preferiti** per ritrovarla al volo.
4. Tocca il pulsante **AVVIA MOTORE** (richiesto per sbloccare l'audio da policy browser).
5. Seleziona la modalità preferita (`MONOMARCIA EV` o `CAMBIO VIRTUAL`).
6. Parti: il suono uscirà dagli altoparlanti dell'auto seguendo la tua andatura.

*Nota:* assicurati che il volume del browser o del media player Tesla sia attivo.

---

## 🧪 Test di verifica TCU

Il repository include uno script di verifica isolato per testare la logica del cambio:

```bash
node test_tcu.js
```

Verifica:
- Transizione in 5ª marcia a 50 km/h in crociera costante (~1.600 RPM).
- Salita in 8ª marcia a 90 km/h e 130 km/h in crociera costante.
- Tolleranza al rumore GPS (±1 km/h) a 130 km/h senza salti di marcia involontari (0 oscillazioni su 20s).

---

## 📄 Licenza e Crediti Audio

- Campioni motore: elaborati a partire dai sample CC0 public domain di *domasx2* (OpenGameArt).
- Codice rilasciato sotto licenza MIT.
