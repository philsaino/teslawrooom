# Tesla Wrooom • V12 Italiano 🏎️🇮🇹

Generatore procedurale in tempo reale del suono di un **motore V12 aspirato**, eseguibile direttamente dal browser della vettura Tesla (MCU2 / Ryzen) senza download di campioni audio, senza hardware OBD e senza costi di licenza.

**Live App:** [https://philsaino.github.io/teslawrooom/](https://philsaino.github.io/teslawrooom/)  
**Sensor & API Probe:** [https://philsaino.github.io/teslawrooom/probe.html](https://philsaino.github.io/teslawrooom/probe.html)

---

## 💡 Caratteristiche

- **Sintesi procedurale pura (Zero file WAV):** nessun buffer pesante da scaricare. La pagina si apre all'istante e parte a zero millisecondi di attesa.
- **Fisica acustica V12 a 4 tempi:**
  - Frequenza base $f_0 = \text{RPM} / 60$.
  - Generazione di ordini armonici multipli ($1^\circ, 2^\circ, 3^\circ, 6^\circ, 12^\circ, 18^\circ, 24^\circ$), con dominanza dell'ordine 6 (6 accensioni per giro tipiche del 12 cilindri).
  - Modellazione saturazione scarico tramite `WaveShaper` ad alta efficienza.
  - Generatore rumore d'aspirazione dinamico con filtro passa-banda tarato sulla corsa dell'aria.
- **Comportamento legato al carico:**
  - In crociera costante a filo di gas (50, 90, 130 km/h) il motore resta cupo e fluido tra 1300 e 2100 RPM.
  - Sotto forte accelerazione il motore apre il filtro e scatena l'urlo del V12 fino a 8500 RPM.
- **UI Touchscreen Cockpit Mode:** interfaccia scura ad altissimo contrasto con cifre tachimetro giganti da 120px e pulsanti touch oversize pensati per l'uso in auto.
- **Slider di simulazione:** test a banco da computer o smartphone per provare curve e regimi senza muovere il veicolo.

---

## 🚀 Utilizzo in Tesla

1. Nella Tesla premi l'icona **Applicazioni** -> **Browser**.
2. Digita l'indirizzo: `https://philsaino.github.io/teslawrooom/`
3. Salva la pagina tra i **Preferiti** per ritrovarla al volo.
4. Tocca il pulsante **AVVIA V12** (avvio sonoro istantaneo a 0 ms).
5. Parti: il suono uscirà dagli altoparlanti dell'auto seguendo la tua andatura e il tuo stile di guida.
