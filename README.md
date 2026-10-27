# Tesla Wrooom 🏎️⚡

Generatore di suono motore endotermico in tempo reale per Tesla, eseguibile direttamente dal browser di bordo della vettura (MCU2 / Ryzen) senza installazioni, hardware OBD o costi di licenza.

**Live App:** [https://philsaino.github.io/teslawrooom/](https://philsaino.github.io/teslawrooom/)  
**Sensor & API Probe:** [https://philsaino.github.io/teslawrooom/probe.html](https://philsaino.github.io/teslawrooom/probe.html)

---

## 💡 Caratteristiche

- **Nessuna installazione né hardware:** gira nel browser integrato della Tesla tramite Web Audio API e Geolocation API nativi.
- **Audio multi-sample a bassissima latenza:** pre-decodifica parallela in RAM dei campioni WAV, `latencyHint: interactive` e rampa a 8ms.
- **Dinamica del suono basata sul carico:** a velocità costante (crociera 50-90-130 km/h) il motore resta cupo e basso di giri (1000-1300 RPM); sale di tono e volume (fino a 4000+ RPM) solo sotto accelerazione effettiva.
- **UI Touchscreen Cockpit Mode:** interfaccia scura ad altissimo contrasto con cifre tachimetro da 120px e pulsanti touch oversize pensati per l'uso in auto.
- **Slider di simulazione:** test a banco da computer o smartphone per provare curve e regimi senza muovere il veicolo.
- **Probe diagnostico Tesla (`probe.html`):** pagina dedicata per verificare i sensori esposti dal browser della vettura (frequenza GPS in Hz, accuratezza, heading, altitudine, `DeviceMotion`, latenza audio hardware).

---

## ⚙️ Come funziona

1. **Rilevamento velocità:** il browser interroga la `navigator.geolocation` dell'auto ricavando la velocità in km/h.
2. **Stima del carico acceleratore:**
   - Calcola la derivata della velocità rispetto al tempo.
   - Salita rapida (`α = 0.45`) in accelerazione, decadimento morbido (`α = 0.15`) in rilascio.
3. **Curva acustica adattiva:**
   - A velocità costante il regime di base sale solo di +800 RPM fino a 200 km/h (50 km/h = 1000 RPM, 90 km/h = 1160 RPM).
   - L'accelerazione aggiunge una componente dinamica proporzionale al carico (fino a +3000 RPM sotto piena spinta).

---

## 🚀 Utilizzo in Tesla

1. Nella Tesla premi l'icona **Applicazioni** -> **Browser**.
2. Digita l'indirizzo: `https://philsaino.github.io/teslawrooom/`
3. Salva la pagina tra i **Preferiti** per ritrovarla al volo.
4. Tocca il pulsante **AVVIA MOTORE** (richiesto per sbloccare l'audio da policy browser).
5. Parti: il suono uscirà dagli altoparlanti dell'auto seguendo la tua andatura.

---

## 🔬 Test sensori a bordo (`probe.html`)

Per scoprire quali API e frequenze sono realmente disponibili sul display della tua Tesla, apri nel browser dell'auto:
`https://philsaino.github.io/teslawrooom/probe.html`

- Verifica il supporto a `DeviceMotion` (accelerometro), `DeviceOrientation`, Gamepad, ecc.
- Misura la frequenza reale del GPS in Hz su 30 secondi.
- Mostra in tempo reale altitudine (pendenza) e heading (curve).
