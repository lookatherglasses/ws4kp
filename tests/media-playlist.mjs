import assert from 'node:assert/strict';
import {
	cleanTrackTitle,
	createPlaylistSelector,
	periodForHour,
	trackPeriod,
// eslint-disable-next-line import/no-relative-packages
} from '../server/scripts/modules/utils/media-playlist.mjs';

assert.equal(periodForHour(6), 'night');
assert.equal(periodForHour(7), 'day');
assert.equal(periodForHour(18), 'day');
assert.equal(periodForHour(19), 'night');

assert.equal(trackPeriod('day - Blue Ridge Afternoon.mp3'), 'day');
assert.equal(trackPeriod('night - Closed Caption Weather.mp3'), 'night');
assert.equal(trackPeriod('Uncategorized.mp3'), undefined);
assert.equal(cleanTrackTitle('default/day%20-%20Blue%20Ridge%20Afternoon.mp3'), 'Blue Ridge Afternoon');
assert.equal(cleanTrackTitle('night - Blue Ridge After Dark.mp3'), 'Blue Ridge After Dark');

const selector = createPlaylistSelector([
	'day - Day One.mp3',
	'day - Day Two.mp3',
	'night - Night One.mp3',
	'night - Night Two.mp3',
], () => 0);
assert.deepEqual(
	[selector.next('day'), selector.next('day')].sort(),
	['day - Day One.mp3', 'day - Day Two.mp3'],
);
assert.match(selector.next('night'), /^night - /);

const randomValues = [0, 0, 0.999, 0];
const nonRepeatingSelector = createPlaylistSelector(
	['day - One.mp3', 'day - Two.mp3'],
	() => randomValues.shift() ?? 0,
);
const firstCycle = [nonRepeatingSelector.next('day'), nonRepeatingSelector.next('day')];
const firstAfterReshuffle = nonRepeatingSelector.next('day');
assert.notEqual(firstAfterReshuffle, firstCycle[1]);

const fallbackSelector = createPlaylistSelector(['Uncategorized.mp3'], () => 0);
assert.equal(fallbackSelector.next('day'), 'Uncategorized.mp3');
assert.equal(fallbackSelector.next('night'), 'Uncategorized.mp3');

console.log('media playlist tests passed');
