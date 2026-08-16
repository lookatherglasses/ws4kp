const PREFIX_PATTERN = /^(day|night)\s*-\s*/i;

const decodeFileName = (fileName) => {
	try {
		return decodeURIComponent(fileName);
	} catch (_error) {
		return fileName;
	}
};

const baseName = (fileName) => decodeFileName(fileName).split('/').pop();

const trackPeriod = (fileName) => {
	const match = baseName(fileName).match(PREFIX_PATTERN);
	return match?.[1]?.toLowerCase();
};

const cleanTrackTitle = (fileName) => baseName(fileName)
	.replace(/\.mp3$/i, '')
	.replace(PREFIX_PATTERN, '')
	.replace(/(_-)/gi, '');

const periodForHour = (hour) => (hour >= 7 && hour < 19 ? 'day' : 'night');

const shuffle = (tracks, random) => {
	let remaining = [...tracks];
	const shuffled = [];

	while (remaining.length > 0) {
		const index = Math.floor(random() * remaining.length);
		shuffled.push(remaining[index]);
		remaining = remaining.filter((_track, trackIndex) => trackIndex !== index);
	}

	return shuffled;
};

const createPlaylistSelector = (availableFiles, random = Math.random) => {
	const allTracks = [...availableFiles];
	const pools = {
		all: { tracks: allTracks, queue: [] },
		day: { tracks: allTracks.filter((track) => trackPeriod(track) === 'day'), queue: [] },
		night: { tracks: allTracks.filter((track) => trackPeriod(track) === 'night'), queue: [] },
	};
	let lastTrack;

	const next = (period) => {
		const requestedPool = pools[period];
		const pool = requestedPool?.tracks.length > 0 ? requestedPool : pools.all;
		if (pool.tracks.length === 0) return undefined;

		if (pool.queue.length === 0) {
			pool.queue = shuffle(pool.tracks, random);

			// Avoid repeating the track that just finished when a pool reshuffles.
			if (pool.queue.length > 1 && pool.queue[0] === lastTrack) {
				const replacementIndex = pool.queue.findIndex((track) => track !== lastTrack);
				[pool.queue[0], pool.queue[replacementIndex]] = [pool.queue[replacementIndex], pool.queue[0]];
			}
		}

		const selectedTrack = pool.queue.shift();
		lastTrack = selectedTrack;
		return selectedTrack;
	};

	return { next };
};

export {
	cleanTrackTitle,
	createPlaylistSelector,
	periodForHour,
	trackPeriod,
};
