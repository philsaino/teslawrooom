// ponytail: test runner isolato per logica TCU cambio adattivo.
const IDLE_RPM = 800, MAX_RPM = 7500;
const ratios = [0, 4.71, 3.14, 2.10, 1.67, 1.28, 1.00, 0.84, 0.67];
const finalDrive = 3.15;
const wheelCircMeters = 2.05;

function createSim() {
  let gear = 1;
  let filteredThrottle = 0;
  let lastShiftTime = -99999;
  let lastSpeed = 0;
  let lastSpeedTime = 0;

  function onSpeedSample(spd, now) {
    const dt = (now - lastSpeedTime) / 1000;
    if (lastSpeedTime > 0 && dt > 0.1) {
      const rawAccel = (spd - lastSpeed) / dt;
      const rawThrottle = Math.max(0, Math.min(1, rawAccel / 12));
      // Filtro passa-basso con salita rapida (alpha=0.4) e discesa lenta (alpha=0.15)
      const alpha = rawThrottle > filteredThrottle ? 0.4 : 0.15;
      filteredThrottle += (rawThrottle - filteredThrottle) * alpha;
    }
    lastSpeed = spd;
    lastSpeedTime = now;
  }

  function step(spd, now) {
    if (spd < 1) {
      gear = 1;
      return { gear: 1, rpm: IDLE_RPM, throttle: filteredThrottle };
    }

    const wheelRpm = (spd * 1000 / 60) / wheelCircMeters;
    const calcRpm = (g) => wheelRpm * ratios[g] * finalDrive;

    // Soglie di cambiata fluide su filteredThrottle (0..1)
    // Con throttle=0 (crociera): upshift a 1850, downshift a 1150
    // Con throttle=1 (pieno carico): upshift a 5400, downshift a 3200
    const upshiftRpm = 1850 + filteredThrottle * 3550;
    const downshiftRpm = 1150 + filteredThrottle * 2050;

    if ((now - lastShiftTime) >= 1200) {
      const currentRpmG = calcRpm(gear);

      // Salita: solo 1 marcia alla volta, controllando che la marcia successiva resti sopra 1100
      if (currentRpmG > upshiftRpm && gear < 8) {
        if (calcRpm(gear + 1) >= 1100) {
          gear++;
          lastShiftTime = now;
        }
      }
      // Scalata
      else if (currentRpmG < downshiftRpm && gear > 1) {
        // Kickdown (doppia scalata) solo se gas pieno sostenuto
        if (filteredThrottle > 0.75 && gear > 2 && calcRpm(gear - 2) < (MAX_RPM - 800)) {
          gear -= 2;
        } else {
          gear--;
        }
        lastShiftTime = now;
      }
    }

    const targetRpm = Math.max(IDLE_RPM, Math.min(MAX_RPM, calcRpm(gear)));
    return { gear, rpm: Math.round(targetRpm), throttle: filteredThrottle };
  }

  return { onSpeedSample, step };
}

// Test 1: crociera 50 km/h costante per 10s (aggiornamenti GPS 1Hz)
const sim1 = createSim();
let t = 0;
let shiftsCount = 0, lastG = 1;
for (let i = 0; i < 15; i++) {
  t += 1000;
  sim1.onSpeedSample(50, t);
  const res = sim1.step(50, t);
  if (res.gear !== lastG) { shiftsCount++; lastG = res.gear; }
}
console.log('50 km/h crociera -> marcia finale:', lastG, 'RPM:', sim1.step(50, t).rpm, 'cambiate:', shiftsCount);
if (lastG < 4 || sim1.step(50, t).rpm > 2200) throw new Error('Fallito: a 50 km/h crociera doveva salire di marcia');

// Test 2: crociera 90 km/h costante
const sim2 = createSim();
t = 0;
for (let i = 0; i < 20; i++) {
  t += 1000;
  sim2.onSpeedSample(90, t);
  sim2.step(90, t);
}
const res90 = sim2.step(90, t);
console.log('90 km/h crociera -> marcia finale:', res90.gear, 'RPM:', res90.rpm);
if (res90.gear < 7) throw new Error('Fallito: a 90 km/h doveva essere in 7a o 8a');

// Test 3: nessuna oscillazione casuale a velocita costante con rumore GPS (±1 km/h)
const sim3 = createSim();
t = 0;
// Prima porta a 130 km/h
for (let i = 0; i < 15; i++) {
  t += 1000;
  sim3.onSpeedSample(130, t);
  sim3.step(130, t);
}
let unstableShifts = 0;
let stableGear = sim3.step(130, t).gear;
for (let i = 0; i < 20; i++) {
  t += 1000;
  const noisySpd = 130 + (Math.random() * 2 - 1);
  sim3.onSpeedSample(noisySpd, t);
  const r = sim3.step(noisySpd, t);
  if (r.gear !== stableGear) unstableShifts++;
}
console.log('130 km/h con rumore GPS -> cambiate instabili su 20s:', unstableShifts, '(target: 0)');
if (unstableShifts > 1) throw new Error('Fallito: pendolamento rilevato');

console.log('TUTTI I TEST SUPERATI.');
