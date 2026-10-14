const assert = require('node:assert/strict');
const p = require(process.argv[2]);
const source = { TEA: 'tea-a', MILK: 'milk-b', TOPPING: 'top-c' };
const snapshot = p.freezeCupSnapshot(1, 'recipe-42', source);
source.TEA = 'changed-after-submit';
assert.equal(snapshot.ingredients.TEA, 'tea-a', 'snapshot must isolate selected IDs');
assert.ok(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.ingredients), 'snapshot should be immutable');

const correct = p.createPresentationTransaction(4, 'correct', 1000, snapshot);
assert.equal(p.samplePresentation(correct, 1000).phase, 'synthesis');
assert.equal(p.samplePresentation(correct, 1650).phase, 'happy');
assert.equal(p.samplePresentation(correct, 1730).face, 'blink');
assert.equal(p.samplePresentation(correct, 1800).face, 'happy');
assert.equal(p.samplePresentation(correct, 1950).phase, 'depart');
assert.equal(p.samplePresentation(correct, 2400).phase, 'arrive');
assert.equal(p.samplePresentation(correct, 2850).phase, 'complete');
assert.equal(p.samplePresentation(correct, 2850).customerX, 309);

const arrival = p.createPresentationTransaction(4, 'arrival', 900, snapshot);
assert.equal(p.samplePresentation(arrival, 900).customerX, -72, 'new customer begins fully outside the mask');
assert.equal(p.samplePresentation(arrival, 1350).customerX, 309, 'initial arrival completes within 450ms');
assert.equal(p.samplePresentation(arrival, 1350).bubbleVisible, true);

const wrong = p.createPresentationTransaction(5, 'wrong', 2000, snapshot);
assert.equal(p.samplePresentation(wrong, 2650).phase, 'disappointed');
assert.equal(p.samplePresentation(wrong, 2730).face, 'blink');
assert.equal(p.samplePresentation(wrong, 2800).face, 'disappointed');
assert.equal(p.samplePresentation(wrong, 3000).phase, 'complete');
assert.equal(p.samplePresentation(wrong, 3000).customerX, 309, 'wrong result keeps the same customer in place');

const timeout = p.createPresentationTransaction(6, 'expired', 3000, snapshot);
assert.equal(p.samplePresentation(timeout, 3300).phase, 'depart');
assert.equal(p.samplePresentation(timeout, 3750).customerX, -72, 'timeout moves the full frame past the window');
const interrupted = p.interruptPresentationForTimeout(correct, 7, 4000);
assert.equal(interrupted.result, 'expired');
assert.equal(interrupted.submittedAtMs, 4000);
assert.equal(interrupted.snapshot, correct.snapshot, 'deadline interruption preserves display facts');
const movingCorrect = p.createPresentationTransaction(10, 'correct', 1000, snapshot);
const midDepartureX = p.samplePresentation(movingCorrect, 1175).customerX;
const midDepartureTimeout = p.interruptPresentationForTimeout(movingCorrect, 11, 1175, midDepartureX);
assert.equal(p.samplePresentation(midDepartureTimeout, 1175).customerX, midDepartureX, 'timeout transition preserves current customer position');
const midDepartureExit = p.createPresentationTransaction(12, 'exited', 1175, snapshot, midDepartureX);
assert.equal(p.samplePresentation(midDepartureExit, 1175).customerX, midDepartureX, 'exit transition preserves current customer position');
const alreadyDepartedTimeout = p.interruptPresentationForTimeout(movingCorrect, 13, 1450, -72);
const alreadyDepartedSample = p.samplePresentation(alreadyDepartedTimeout, 1450);
assert.equal(alreadyDepartedSample.complete, true, 'timeout does not recall an already departed customer');
assert.equal(alreadyDepartedSample.customerX, -72);

const won = p.createPresentationTransaction(8, 'won', 5000, snapshot);
assert.equal(p.samplePresentation(won, 6400).complete, true, 'pre-deadline win finishes without a second timeout decision');
assert.equal(p.samplePresentation(won, 6400).bubbleVisible, false, 'terminal win hides the order bubble while the last customer leaves');
const exit = p.createPresentationTransaction(9, 'exited', 6000, snapshot);
assert.equal(p.samplePresentation(exit, 6450).complete, true);
assert.equal(p.shouldLockInput(correct), true);
assert.equal(p.shouldLockInput(null), false);
console.log('PASS: immutable snapshot; initial arrival; correct/wrong/timeout/exit phases; full-window travel; timeout interruption and offscreen edge; won bubble hidden; input lock');
