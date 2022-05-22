/*
controls.mjs - <short description TODO>
Copyright (C) 2022 Strudel contributors - see <https://github.com/tidalcycles/strudel/blob/main/packages/core/controls.mjs>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Pattern, sequence } from './pattern.mjs';

const controls = {};
const generic_params = [
  /**
   * Select a sound / sample by name.
   * See default sounds here: https://tidalcycles.org/docs/configuration/Audio%20Samples/default_library
   *
   * @name s
   * @param {string | Pattern} sound The sound / pattern of sounds to pick
   * @example
   * s("bd hh").osc()
   *
   */
  ['s', 's', 'sound'],
  /**
   * The note or sample number to choose for a synth or sampleset
   * Note names currently not working yet, but will hopefully soon. Just stick to numbers for now
   *
   * @name n
   * @param {string | number | Pattern} value note name, note number or sample number
   * @example
   * s('superpiano').n("<0 1 2 3>").osc()
   * @example
   * s('superpiano').n("<c4 d4 e4 g4>").osc()
   * @example
   * n("0 1 2 3").s('east').osc()
   */
  // TODO: nOut does not work
  // TODO: notes don't work as expected
  // current "workaround" for notes:
  // s('superpiano').n("<c0 d0 e0 g0>"._asNumber()).osc()
  // -> .n or .osc (or .superdirt) would need to convert note strings to numbers
  // also see https://github.com/tidalcycles/strudel/pull/63
  ['f', 'n', 'The note or sample number to choose for a synth or sampleset'],
  ['f', 'note', 'The note or pitch to play a sound or synth with'],
  //['s', 'toArg', 'for internal sound routing'],
  // ["f", "from", "for internal sound routing"),
  //['f', 'to', 'for internal sound routing'],
  /**
   * A pattern of numbers that speed up (or slow down) samples while they play. Currently only supported by osc / superdirt.
   *
   * @name accelerate
   * @param {number | Pattern} amount acceleration.
   * @example
   * s("sax").accelerate("<0 1 2 4 8 16>").slow(2).osc()
   *
   */
  ['f', 'accelerate', 'a pattern of numbers that speed up (or slow down) samples while they play.'],
  /**
   * Like {@link amp}, but exponential.
   *
   * @name gain
   * @param {number | Pattern} amount gain.
   * @example
   * s("bd*8").gain(".7*2 1 .7*2 1 .7 1").osc()
   *
   */
  [
    'f',
    'gain',
    'a pattern of numbers that specify volume. Values less than 1 make the sound quieter. Values greater than 1 make the sound louder. For the linear equivalent, see @amp@.',
  ],
  /**
   * Like {@link gain}, but linear.
   *
   * @name amp
   * @param {number | Pattern} amount gain.
   * @example
   * s("bd*8").amp(".1*2 .5 .1*2 .5 .1 .5").osc()
   *
   */
  ['f', 'amp', 'like @gain@, but linear.'],
  // TODO: find out why 0 does not work, and it generally seems not right
  /*
   * A pattern of numbers to specify the attack time of an envelope applied to each sample.
   *
   * @name attack
   * @param {number | Pattern} attack time in seconds.
   * @example
   * n("c5 e5").s('superpiano').attack("<0 .1>").osc()
   *
   */
  [
    'f',
    'attack',
    'a pattern of numbers to specify the attack time (in seconds) of an envelope applied to each sample.',
  ],
  // TODO: find out how this works?
  /*
   * Envelope decay time = the time it takes after the attack time to reach the sustain level.
   *
   * @name decay
   * @param {number | Pattern} time decay time in seconds
   * @example
   * s("sax").cut(1).decay("<.1 .2 .3 .4>").sustain(0).osc()
   *
   */
  ['f', 'decay', ''],
  ['f', 'sustain', ''],
  [
    'f',
    'release',
    'a pattern of numbers to specify the release time (in seconds) of an envelope applied to each sample.',
  ],
  [
    'f',
    'hold',
    'a pattern of numbers to specify the hold time (in seconds) of an envelope applied to each sample. Only takes effect if `attack` and `release` are also specified.',
  ],
  // TODO: in tidal, it seems to be normalized
  /**
   * Sets the center frequency of the band-pass filter.
   *
   * @name bandf
   * @param {number | Pattern} frequency center frequency
   * @example
   * s("bd sd").bandf("<1000 2000 4000 8000>").osc()
   *
   */
  ['f', 'bandf', 'A pattern of numbers from 0 to 1. Sets the center frequency of the band-pass filter.'],
  // TODO: in tidal, it seems to be normalized
  /**
   * Sets the q-factor of the band-pass filter
   *
   * @name bandq
   * @param {number | Pattern} q q factor
   * @example
   * s("bd sd").bandf("<1000 2000 4000 8000>").bandq("<.2 .9>").osc()
   *
   */
  ['f', 'bandq', 'a pattern of anumbers from 0 to 1. Sets the q-factor of the band-pass filter.'],
  /**
   * a pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.
   *
   * @name begin
   * @param {number | Pattern} amount between 0 and 1, where 1 is the length of the sample
   * @example
   * s("rave").begin("<0 .25 .5 .75>").osc()
   *
   */
  [
    'f',
    'begin',
    'a pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.',
  ],
  /**
   * The same as {@link begin}, but cuts off the end off each sample.
   *
   * @name end
   * @param {number | Pattern} length 1 = whole sample, .5 = half sample, .25 = quarter sample etc..
   * @example
   * s("bd*2,ho*4").end("<.1 .2 .5 1>").osc()
   *
   */
  [
    'f',
    'end',
    'the same as `begin`, but cuts the end off samples, shortening them; e.g. `0.75` to cut off the last quarter of each sample.',
  ],
  /**
   * Loops the sample (from `begin` to `end`) the specified number of times.
   * Note that the tempo of the loop is not synced with the cycle tempo.
   *
   * @name loop
   * @param {number | Pattern} times How often the sample is looped
   * @example
   * s("bd").loop("<1 2 3 4>").osc()
   *
   */
  ['f', 'loop', 'loops the sample (from `begin` to `end`) the specified number of times.'],
  // TODO: currently duplicated with "native" legato
  /**
   * a pattern of numbers from 0 to 1. Skips the beginning of each sample, e.g. `0.25` to cut off the first quarter from each sample.
   *
   * @name legato
   * @param {number | Pattern} duration between 0 and 1, where 1 is the length of the whole hap time
   * @example
   * "c4 eb4 g4 bb4".legato("<0.125 .25 .5 .75 1 2 4>")
   *
   */
  ['f', 'legato', 'controls the amount of overlap between two adjacent sounds'],
  // ['f', 'clhatdecay', ''],
  /**
   * bit crusher effect.
   *
   * @name crush
   * @param {number | Pattern} depth between 1 (for drastic reduction in bit-depth) to 16 (for barely no reduction).
   * @example
   * s("<bd sd>,hh*3,jvbass*2").fast(2).crush("<16 8 7 6 5 4 3 2>").osc()
   *
   */
  [
    'f',
    'crush',
    'bit crushing, a pattern of numbers from 1 (for drastic reduction in bit-depth) to 16 (for barely no reduction).',
  ],
  /**
   * fake-resampling for lowering the sample rate
   *
   * @name coarse
   * @param {number | Pattern} factor 1 for original 2 for half, 3 for a third and so on.
   * @example
   * s("xmas").coarse("<1 4 8 16 32>").osc()
   *
   */
  [
    'f',
    'coarse',
    'fake-resampling, a pattern of numbers for lowering the sample rate, i.e. 1 for original 2 for half, 3 for a third and so on.',
  ],

  /**
   * choose the channel the pattern is sent to in superdirt
   *
   * @name channel
   * @param {number | Pattern} channel channel number
   *
   */
  ['i', 'channel', 'choose the channel the pattern is sent to in superdirt'],
  /**
   * In the style of classic drum-machines, `cut` will stop a playing sample as soon as another samples with in same cutgroup is to be played. An example would be an open hi-hat followed by a closed one, essentially muting the open.
   *
   * @name cut
   * @param {number | Pattern} group cut group number
   * @example
   * s("bd sax").cut(1).osc()
   *
   */
  [
    'i',
    'cut',
    'In the style of classic drum-machines, `cut` will stop a playing sample as soon as another samples with in same cutgroup is to be played. An example would be an open hi-hat followed by a closed one, essentially muting the open.',
  ],
  /**
   * Applies the cutoff frequency of the low-pass filter.
   *
   * @name cutoff
   * @param {number | Pattern} frequency audible between 0 and 20000
   * @example
   * s("bd,hh*2,<~ sd>").fast(2).cutoff("<4000 2000 1000 500 200 100>").osc()
   *
   */
  // TODO: add lpf synonym
  ['f', 'cutoff', 'a pattern of numbers from 0 to 1. Applies the cutoff frequency of the low-pass filter.'],
  /**
   * Applies the cutoff frequency of the high-pass filter.
   *
   * @name hcutoff
   * @param {number | Pattern} frequency audible between 0 and 20000
   * @example
   * s("bd,hh*2,<~ sd>").fast(2).hcutoff("<4000 2000 1000 500 200 100>").osc()
   *
   */
  // TODO: add hpf synonym
  [
    'f',
    'hcutoff',
    'a pattern of numbers from 0 to 1. Applies the cutoff frequency of the high-pass filter. Also has alias @hpf@',
  ],
  /**
   * Applies the cutoff frequency of the high-pass filter.
   *
   * @name hresonance
   * @param {number | Pattern} q resonance factor between 0 and 1
   * @example
   * s("bd,hh*2,<~ sd>").fast(2).hcutoff(2000).hresonance("<0 .2 .4 .6>").osc()
   *
   */
  [
    'f',
    'hresonance',
    'a pattern of numbers from 0 to 1. Applies the resonance of the high-pass filter. Has alias @hpq@',
  ],
  // TODO: add hpq synonym
  /**
   * Applies the cutoff frequency of the low-pass filter.
   *
   * @name resonance
   * @param {number | Pattern} q resonance factor between 0 and 1
   * @example
   * s("bd,hh*2,<~ sd>").fast(2).cutoff(2000).resonance("<0 .2 .4 .6>").osc()
   *
   */
  ['f', 'resonance', 'a pattern of numbers from 0 to 1. Specifies the resonance of the low-pass filter.'],
  // TODO: add lpq synonym?
  /**
   * Set detune of oscillators. Works only with some synths, see <a target="_blank" href="https://tidalcycles.org/docs/patternlib/tutorials/synthesizers">tidal doc</a>
   *
   * @name djf
   * @param {number | Pattern} cutoff below 0.5 is low pass filter, above is high pass filter
   * @example
   * n("0 3 7 [10,24]").s('superzow').octave(3).djf("<.5 .25 .5 .75>").osc()
   *
   */
  ['f', 'djf', 'DJ filter, below 0.5 is low pass filter, above is high pass filter.'],
  // ['f', 'cutoffegint', ''],
  // TODO: does not seem to work
  /*
   * Sets the level of the delay signal.
   *
   * @name delay
   * @param {number | Pattern} level between 0 and 1
   * @example
   * s("bd").delay("<0 .5 .75 1>").osc()
   *
   */
  ['f', 'delay', 'a pattern of numbers from 0 to 1. Sets the level of the delay signal.'],
  ['f', 'delayfeedback', 'a pattern of numbers from 0 to 1. Sets the amount of delay feedback.'],
  ['f', 'delaytime', 'a pattern of numbers from 0 to 1. Sets the length of the delay.'],
  /* // TODO: test
   * Specifies whether delaytime is calculated relative to cps.
   *
   * @name lock
   * @param {number | Pattern} enable When set to 1, delaytime is a direct multiple of a cycle.
   * @example
   * s("sd").delay().lock(1).osc()
   *
   */
  [
    'f',
    'lock',
    'A pattern of numbers. Specifies whether delaytime is calculated relative to cps. When set to 1, delaytime is a direct multiple of a cycle.',
  ],
  /**
   * Set detune of oscillators. Works only with some synths, see <a target="_blank" href="https://tidalcycles.org/docs/patternlib/tutorials/synthesizers">tidal doc</a>
   *
   * @name detune
   * @param {number | Pattern} amount between 0 and 1
   * @example
   * n("0 3 7").s('superzow').octave(3).detune("<0 .25 .5 1 2>").osc()
   *
   */
  ['f', 'detune', ''],
  /**
   * Set dryness of reverb. See {@link room} and {@link size} for more information about reverb.
   *
   * @name dry
   * @param {number | Pattern} dry 0 = wet, 1 = dry
   * @example
   * n("[0,3,7](3,8)").s("superpiano").room(.7).dry("<0 .5 .75 1>").osc()
   *
   */
  [
    'f',
    'dry',
    'when set to `1` will disable all reverb for this pattern. See `room` and `size` for more information about reverb.',
  ],
  // TODO: does not seem to do anything
  /*
   * Used when using {@link begin}/{@link end} or {@link chop}/{@link striate} and friends, to change the fade out time of the 'grain' envelope.
   *
   * @name fadeTime
   * @param {number | Pattern} time between 0 and 1
   * @example
   * s("ho*4").end(.1).fadeTime("<0 .2 .4 .8>").osc()
   *
   */
  [
    'f',
    'fadeTime',
    "Used when using begin/end or chop/striate and friends, to change the fade out time of the 'grain' envelope.",
  ],
  // TODO: see above
  [
    'f',
    'fadeInTime',
    'As with fadeTime, but controls the fade in time of the grain envelope. Not used if the grain begins at position 0 in the sample.',
  ],
  /**
   * Set frequency of sound.
   *
   * @name freq
   * @param {number | Pattern} frequency in Hz. the audible range is between 20 and 20000 Hz
   * @example
   * freq("220 110 440 110").s("superzow").osc()
   * @example
   * freq("110".mulOut(".5 1.5 .6 [2 3]")).s("superzow").osc()
   *
   */
  ['f', 'freq', ''],
  // TODO: https://tidalcycles.org/docs/configuration/MIDIOSC/control-voltage/#gate
  ['f', 'gate', ''],
  // ['f', 'hatgrain', ''],
  // ['f', 'lagogo', ''],
  // ['f', 'lclap', ''],
  // ['f', 'lclaves', ''],
  // ['f', 'lclhat', ''],
  // ['f', 'lcrash', ''],
  // TODO:
  // https://tidalcycles.org/docs/reference/audio_effects/#leslie-1
  // https://tidalcycles.org/docs/reference/audio_effects/#leslie
  /**
   * Emulation of a Leslie speaker: speakers rotating in a wooden amplified cabinet.
   *
   * @name leslie
   * @param {number | Pattern} dry between 0 and 1
   * @example
   * n("0,4,7").s("supersquare").leslie("<0 .4 .6 1>").osc()
   *
   */
  ['f', 'leslie', ''],
  /**
   * Rate of modulation / rotation for leslie effect
   *
   * @name lrate
   * @param {number | Pattern} rate 6.7 for fast, 0.7 for slow
   * @example
   * n("0,4,7").s("supersquare").leslie(1).lrate("<1 2 4 8>").osc()
   *
   */
  // TODO: the rate seems to "lag" (in the example, 1 will be fast)
  ['f', 'lrate', ''],
  /**
   * Physical size of the cabinet in meters. Be careful, it might be slightly larger than your computer. Affects the Doppler amount (pitch warble)
   *
   * @name lsize
   * @param {number | Pattern} meters somewhere between 0 and 1
   * @example
   * n("0,4,7").s("supersquare").leslie(1).lrate(2).lsize("<.1 .5 1>").osc()
   *
   */
  ['f', 'lsize', ''],
  // ['f', 'lfo', ''],
  // ['f', 'lfocutoffint', ''],
  // ['f', 'lfodelay', ''],
  // ['f', 'lfoint', ''],
  // ['f', 'lfopitchint', ''],
  // ['f', 'lfoshape', ''],
  // ['f', 'lfosync', ''],
  // ['f', 'lhitom', ''],
  // ['f', 'lkick', ''],
  // ['f', 'llotom', ''],
  // ['f', 'lophat', ''],
  // ['f', 'lsnare', ''],
  ['f', 'degree', ''], // TODO: what is this? not found in tidal doc
  ['f', 'mtranspose', ''], // TODO: what is this? not found in tidal doc
  ['f', 'ctranspose', ''], // TODO: what is this? not found in tidal doc
  ['f', 'harmonic', ''], // TODO: what is this? not found in tidal doc
  ['f', 'stepsPerOctave', ''], // TODO: what is this? not found in tidal doc
  ['f', 'octaveR', ''], // TODO: what is this? not found in tidal doc
  // TODO: why is this needed? what's the difference to late / early?
  [
    'f',
    'nudge',
    'Nudges events into the future by the specified number of seconds. Negative numbers work up to a point as well (due to internal latency)',
  ],
  // TODO: the following doc is just a guess, it's not documented in tidal doc.
  /**
   * Sets the default octave of a synth.
   *
   * @name octave
   * @param {number | Pattern} octave octave number
   * @example
   * n("0,4,7").s('supersquare').octave("<3 4 5 6>").osc()
   */
  ['i', 'octave', ''],
  ['f', 'offset', ''], // TODO: what is this? not found in tidal doc
  // ['f', 'ophatdecay', ''],
  // TODO: example
  /**
   * a pattern of numbers. An `orbit` is a global parameter context for patterns. Patterns with the same orbit will share hardware output bus offset and global effects, e.g. reverb and delay. The maximum number of orbits is specified in the superdirt startup, numbers higher than maximum will wrap around.
   *
   * @name orbit
   * @param {number | Pattern} number
   *
   */
  [
    'i',
    'orbit',
    'a pattern of numbers. An `orbit` is a global parameter context for patterns. Patterns with the same orbit will share hardware output bus offset and global effects, e.g. reverb and delay. The maximum number of orbits is specified in the superdirt startup, numbers higher than maximum will wrap around.',
  ],
  ['f', 'overgain', ''], // TODO: what is this? not found in tidal doc
  ['f', 'overshape', ''], // TODO: what is this? not found in tidal doc
  /**
   * Sets position in stereo.
   *
   * @name pan
   * @param {number | Pattern} pan between 0 and 1, from left to right (assuming stereo), once round a circle (assuming multichannel)
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>").osc()
   *
   */
  [
    'f',
    'pan',
    'a pattern of numbers between 0 and 1, from left to right (assuming stereo), once round a circle (assuming multichannel)',
  ],
  // TODO: this has no effect (see example)
  /*
   * Controls how much multichannel output is fanned out
   *
   * @name panspan
   * @param {number | Pattern} span between -inf and inf, negative is backwards ordering
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>").panspan("<0 .5 1>").osc()
   *
   */
  [
    'f',
    'panspan',
    'a pattern of numbers between -inf and inf, which controls how much multichannel output is fanned out (negative is backwards ordering)',
  ],
  // TODO: this has no effect (see example)
  /*
   * Controls how much multichannel output is spread
   *
   * @name pansplay
   * @param {number | Pattern} spread between 0 and 1
   * @example
   * s("[bd hh]*2").pan("<.5 1 .5 0>").pansplay("<0 .5 1>").osc()
   *
   */
  [
    'f',
    'pansplay',
    'a pattern of numbers between 0.0 and 1.0, which controls the multichannel spread range (multichannel only)',
  ],
  [
    'f',
    'panwidth',
    'a pattern of numbers between 0.0 and inf, which controls how much each channel is distributed over neighbours (multichannel only)',
  ],
  [
    'f',
    'panorient',
    'a pattern of numbers between -1.0 and 1.0, which controls the relative position of the centre pan in a pair of adjacent speakers (multichannel only)',
  ],
  // ['f', 'pitch1', ''],
  // ['f', 'pitch2', ''],
  // ['f', 'pitch3', ''],
  // ['f', 'portamento', ''],
  // TODO: LFO rate see https://tidalcycles.org/docs/patternlib/tutorials/synthesizers/#supersquare
  ['f', 'rate', "used in SuperDirt softsynths as a control rate or 'speed'"],
  // TODO: slide param for certain synths
  ['f', 'slide', ''],
  // TODO: detune? https://tidalcycles.org/docs/patternlib/tutorials/synthesizers/#supersquare
  ['f', 'semitone', ''],
  // TODO: dedup with synth param, see https://tidalcycles.org/docs/reference/synthesizers/#superpiano
  ['f', 'velocity', ''],
  ['f', 'voice', ''], // TODO: synth param
  /**
   * Sets the level of reverb.
   *
   * @name room
   * @param {number | Pattern} level between 0 and 1
   * @example
   * s("bd sd").room("<0 .2 .4 .6 .8 1>").osc()
   *
   */
  ['f', 'room', 'a pattern of numbers from 0 to 1. Sets the level of reverb.'],
  /**
   * Sets the room size of the reverb, see {@link room}.
   *
   * @name size
   * @param {number | Pattern} size between 0 and 1
   * @example
   * s("bd sd").room(.8).size("<0 .2 .4 .6 .8 1>").osc()
   *
   */
  [
    'f',
    'size',
    'a pattern of numbers from 0 to 1. Sets the perceptual size (reverb time) of the `room` to be used in reverb.',
  ],
  // ['f', 'sagogo', ''],
  // ['f', 'sclap', ''],
  // ['f', 'sclaves', ''],
  // ['f', 'scrash', ''],
  /**
   * Wave shaping distortion. CAUTION: it might get loud
   *
   * @name shape
   * @param {number | Pattern} distortion between 0 and 1
   * @example
   * s("bd sd").shape("<0 .2 .4 .6 .8 1>").osc()
   *
   */
  [
    'f',
    'shape',
    'wave shaping distortion, a pattern of numbers from 0 for no distortion up to 1 for loads of distortion.',
  ],
  /**
   * Changes the speed of sample playback, i.e. a cheap way of changing pitch.
   *
   * @name speed
   * @param {number | Pattern} speed -inf to inf, negative numbers play the sample backwards.
   * @example
   * s("bd").speed("<1 2 4 1 -2 -4>").osc()
   * @example
   * speed("1 1.5*2 [2 1.1]").s("sax").cut(1).osc()
   *
   */
  [
    'f',
    'speed',
    'a pattern of numbers which changes the speed of sample playback, i.e. a cheap way of changing pitch. Negative values will play the sample backwards!',
  ],
  /**
   * Used in conjunction with {@link speed}, accepts values of "r" (rate, default behavior), "c" (cycles), or "s" (seconds). Using `unit "c"` means `speed` will be interpreted in units of cycles, e.g. `speed "1"` means samples will be stretched to fill a cycle. Using `unit "s"` means the playback speed will be adjusted so that the duration is the number of seconds specified by `speed`.
   *
   * @name unit
   * @param {number | string | Pattern} unit see description above
   * @example
   * speed("1 2 .5 3").s("bd").unit("c").osc()
   *
   */
  [
    's',
    'unit',
    'used in conjunction with `speed`, accepts values of "r" (rate, default behavior), "c" (cycles), or "s" (seconds). Using `unit "c"` means `speed` will be interpreted in units of cycles, e.g. `speed "1"` means samples will be stretched to fill a cycle. Using `unit "s"` means the playback speed will be adjusted so that the duration is the number of seconds specified by `speed`.',
  ],
  /**
   * Made by Calum Gunn. Reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter. The SuperCollider manual defines Squiz as:
   *
   * "A simplistic pitch-raising algorithm. It's not meant to sound natural; its sound is reminiscent of some weird mixture of filter, ring-modulator and pitch-shifter, depending on the input. The algorithm works by cutting the signal into fragments (delimited by upwards-going zero-crossings) and squeezing those fragments in the time domain (i.e. simply playing them back faster than they came in), leaving silences inbetween. All the parameters apart from memlen can be modulated."
   *
   * @name squiz
   * @param {number | Pattern} squiz Try passing multiples of 2 to it - 2, 4, 8 etc.
   * @example
   * squiz("2 4/2 6 [8 16]").s("bd").osc()
   *
   */
  ['f', 'squiz', ''],
  ['f', 'stutterdepth', ''], // TODO: what is this? not found in tidal doc
  ['f', 'stuttertime', ''], // TODO: what is this? not found in tidal doc
  ['f', 'timescale', ''], // TODO: what is this? not found in tidal doc
  ['f', 'timescalewin', ''], // TODO: what is this? not found in tidal doc
  // ['f', 'tomdecay', ''],
  // ['f', 'vcfegint', ''],
  // ['f', 'vcoegint', ''],
  /**
   * 
   * Formant filter to make things sound like vowels.
   * 
   * @name vowel
   * @param {string | Pattern} vowel You can use a e i o u. Use a rest (~) to override the effect
   * @example
   * vowel("a e i [o u]").slow(2)
   * .n("<[0,7]!4 [2,7]!4>")
   * .s('supersquare').osc()
   *
   */
  [
    's',
    'vowel',
    'formant filter to make things sound like vowels, a pattern of either `a`, `e`, `i`, `o` or `u`. Use a rest (`~`) for no effect.',
  ],
  ['f', 'waveloss', ''],
  ['f', 'dur', ''],
  // ['f', 'modwheel', ''],
  ['f', 'expression', ''],
  ['f', 'sustainpedal', ''],
  ['f', 'tremolodepth', "Tremolo Audio DSP effect | params are 'tremolorate' and 'tremolodepth'"],
  ['f', 'tremolorate', "Tremolo Audio DSP effect | params are 'tremolorate' and 'tremolodepth'"],
  ['f', 'phaserdepth', "Phaser Audio DSP effect | params are 'phaserrate' and 'phaserdepth'"],
  ['f', 'phaserrate', "Phaser Audio DSP effect | params are 'phaserrate' and 'phaserdepth'"],
  ['f', 'fshift', 'frequency shifter'],
  ['f', 'fshiftnote', 'frequency shifter'],
  ['f', 'fshiftphase', 'frequency shifter'],
  ['f', 'triode', 'tube distortion'],
  ['f', 'krush', 'shape/bass enhancer'],
  ['f', 'kcutoff', ''],
  ['f', 'octer', 'octaver effect'],
  ['f', 'octersub', 'octaver effect'],
  ['f', 'octersubsub', 'octaver effect'],
  ['f', 'ring', 'ring modulation'],
  ['f', 'ringf', 'ring modulation'],
  ['f', 'ringdf', 'ring modulation'],
  ['f', 'distort', 'noisy fuzzy distortion'],
  ['f', 'freeze', 'Spectral freeze'],
  ['f', 'xsdelay', ''],
  ['f', 'tsdelay', ''],
  ['f', 'real', 'Spectral conform'],
  ['f', 'imag', ''],
  ['f', 'enhance', 'Spectral enhance'],
  ['f', 'partials', ''],
  ['f', 'comb', 'Spectral comb'],
  ['f', 'smear', 'Spectral smear'],
  ['f', 'scram', 'Spectral scramble'],
  ['f', 'binshift', 'Spectral binshift'],
  ['f', 'hbrick', 'High pass sort of spectral filter'],
  ['f', 'lbrick', 'Low pass sort of spectral filter'],
  ['f', 'midichan', ''],
  ['f', 'control', ''],
  ['f', 'ccn', ''],
  ['f', 'ccv', ''],
  ['f', 'polyTouch', ''],
  ['f', 'midibend', ''],
  ['f', 'miditouch', ''],
  ['f', 'ctlNum', ''],
  ['f', 'frameRate', ''],
  ['f', 'frames', ''],
  ['f', 'hours', ''],
  ['s', 'midicmd', ''],
  ['f', 'minutes', ''],
  ['f', 'progNum', ''],
  ['f', 'seconds', ''],
  ['f', 'songPtr', ''],
  ['f', 'uid', ''],
  ['f', 'val', ''],
  ['f', 'cps', ''],
];

const _name = (name, ...pats) => sequence(...pats).withValue((x) => ({ [name]: x }));

const _setter = (func) =>
  function (...pats) {
    return this.set(func(...pats));
  };

generic_params.forEach(([type, name, description]) => {
  controls[name] = (...pats) => _name(name, ...pats);
  Pattern.prototype[name] = _setter(controls[name]);
});

export default controls;
