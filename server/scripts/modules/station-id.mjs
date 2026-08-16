// Channel 78 station identification display

import { preloadImg } from './utils/image.mjs';
import STATUS from './status.mjs';
import WeatherDisplay from './weatherdisplay.mjs';
import { registerDisplay } from './navigation.mjs';

const STATION_ID_IMAGE = 'images/station%20id/station-id.png?v=20260816-2';

class StationId extends WeatherDisplay {
	constructor(navId, elemId) {
		super(navId, elemId, 'Station ID', true);

		this.timing.totalScreens = 1;
		this.timing.baseDelay = 12000;
		preloadImg(STATION_ID_IMAGE);
	}

	async getData(weatherParameters, refresh) {
		const superResponse = super.getData(weatherParameters, refresh);

		this.data = STATION_ID_IMAGE;
		const image = this.elem.querySelector('.station-id-image');
		if (image) image.src = this.data;
		this.getDataCallback();

		if (!superResponse) return;

		this.timing.totalScreens = 1;
		this.setStatus(STATUS.loaded);
	}

	async drawCanvas() {
		super.drawCanvas();
		this.finishDraw();
	}
}

// Position 13: immediately after Radar
const display = new StationId(13, 'station-id');
registerDisplay(display);

export default display;
