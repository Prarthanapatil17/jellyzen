export interface SoundNode {
  stop: () => void;
  setVolume: (v: number) => void;
}

function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function createOceanWaves(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.35;
  masterGain.connect(ctx.destination);

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 600;
  lpf.Q.value = 0.8;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 500;
  lfo.connect(lfoGain);
  lfoGain.connect(lpf.frequency);

  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.6;
  const waveLfo = ctx.createOscillator();
  waveLfo.type = "sine";
  waveLfo.frequency.value = 0.12;
  const waveLfoGain = ctx.createGain();
  waveLfoGain.gain.value = 0.4;
  waveLfo.connect(waveLfoGain);
  waveLfoGain.connect(waveGain.gain);

  noise.connect(lpf);
  lpf.connect(waveGain);
  waveGain.connect(masterGain);

  lfo.start();
  waveLfo.start();
  noise.start();

  return {
    stop: () => {
      try {
        noise.stop();
        lfo.stop();
        waveLfo.stop();
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.4, ctx.currentTime, 0.1);
    },
  };
}

export function createRain(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;
  masterGain.connect(ctx.destination);

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;

  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1200;
  hpf.Q.value = 0.5;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 8000;

  // Delay for reverb-like effect
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.08;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.25;

  noise.connect(hpf);
  hpf.connect(lpf);
  lpf.connect(masterGain);
  lpf.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(masterGain);
  noise.start();

  return {
    stop: () => {
      try {
        noise.stop();
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.35, ctx.currentTime, 0.1);
    },
  };
}

export function createBinaural(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.25;
  masterGain.connect(ctx.destination);

  const merger = ctx.createChannelMerger(2);
  merger.connect(masterGain);

  const leftOsc = ctx.createOscillator();
  leftOsc.type = "sine";
  leftOsc.frequency.value = 200;
  const leftGain = ctx.createGain();
  leftGain.gain.value = 0.4;
  leftOsc.connect(leftGain);
  leftGain.connect(merger, 0, 0);

  const rightOsc = ctx.createOscillator();
  rightOsc.type = "sine";
  rightOsc.frequency.value = 204;
  const rightGain = ctx.createGain();
  rightGain.gain.value = 0.4;
  rightOsc.connect(rightGain);
  rightGain.connect(merger, 0, 1);

  // Carrier hum
  const hum = ctx.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 60;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.05;
  hum.connect(humGain);
  humGain.connect(masterGain);

  leftOsc.start();
  rightOsc.start();
  hum.start();

  return {
    stop: () => {
      try {
        leftOsc.stop();
        rightOsc.stop();
        hum.stop();
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.3, ctx.currentTime, 0.1);
    },
  };
}

export function createForest(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;
  masterGain.connect(ctx.destination);

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;
  const noiseBpf = ctx.createBiquadFilter();
  noiseBpf.type = "bandpass";
  noiseBpf.frequency.value = 800;
  noiseBpf.Q.value = 0.5;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.15;
  noise.connect(noiseBpf);
  noiseBpf.connect(noiseGain);
  noiseGain.connect(masterGain);

  const chirpFreqs = [1200, 1800, 2400, 3000];
  const chirpOscs: OscillatorNode[] = [];
  chirpFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3 + i * 0.15;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.04;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    osc.connect(g);
    g.connect(masterGain);
    lfo.start();
    osc.start();
    chirpOscs.push(osc, lfo);
  });

  noise.start();

  return {
    stop: () => {
      try {
        noise.stop();
        for (const o of chirpOscs) {
          o.stop();
        }
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.35, ctx.currentTime, 0.1);
    },
  };
}

export function createWhaleSong(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 90;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 60;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const ampLfo = ctx.createOscillator();
  ampLfo.type = "sine";
  ampLfo.frequency.value = 0.08;
  const ampLfoGain = ctx.createGain();
  ampLfoGain.gain.value = 0.2;
  ampLfo.connect(ampLfoGain);
  ampLfoGain.connect(masterGain.gain);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 140;
  const g2 = ctx.createGain();
  g2.gain.value = 0.15;
  osc2.connect(g2);
  g2.connect(masterGain);

  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = 0.5;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.3;

  osc.connect(masterGain);
  osc.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(masterGain);

  lfo.start();
  ampLfo.start();
  osc.start();
  osc2.start();

  return {
    stop: () => {
      try {
        osc.stop();
        osc2.stop();
        lfo.stop();
        ampLfo.stop();
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.35, ctx.currentTime, 0.1);
    },
  };
}

export function createFireCrackle(ctx: AudioContext): SoundNode {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.3;
  masterGain.connect(ctx.destination);

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx);
  noise.loop = true;

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 400;
  bpf.Q.value = 0.3;

  const ampMod = ctx.createOscillator();
  ampMod.type = "sawtooth";
  ampMod.frequency.value = 12;
  const ampGain = ctx.createGain();
  ampGain.gain.value = 0.3;
  ampMod.connect(ampGain);
  ampGain.connect(masterGain.gain);

  noise.connect(bpf);
  bpf.connect(masterGain);
  noise.start();
  ampMod.start();

  return {
    stop: () => {
      try {
        noise.stop();
        ampMod.stop();
      } catch (_) {}
    },
    setVolume: (v) => {
      masterGain.gain.setTargetAtTime(v * 0.35, ctx.currentTime, 0.1);
    },
  };
}

export function playPopSound(ctx: AudioContext): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

export function playCompletionSound(ctx: AudioContext): void {
  const notes = [261.63, 329.63, 392, 523.25];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}
