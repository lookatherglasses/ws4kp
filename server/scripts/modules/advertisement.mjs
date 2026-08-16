// Channel 78 advertisement display

import { preloadImg } from './utils/image.mjs';
import STATUS from './status.mjs';
import WeatherDisplay from './weatherdisplay.mjs';
import { registerDisplay } from './navigation.mjs';

const AD_IMAGES = [
	'images/ads/ad-01.png?v=20260816-2',
	'images/ads/ad-02.png?v=20260816-2',
];

class Advertisement extends WeatherDisplay {
	constructor(navId, elemId) {
		super(navId, elemId, 'Advertisement', true);

		this.currentAdIndex = 0;
		this.timing.totalScreens = 1;
		this.timing.baseDelay = 12000;

		AD_IMAGES.forEach((imagePath) => {
			preloadImg(imagePath);
		});
	}

	async getData(weatherParameters, refresh) {
		const superResponse = super.getData(weatherParameters, refresh);

		this.data = AD_IMAGES;
		this.getDataCallback();

		if (!superResponse) return;

		this.timing.totalScreens = 1;
		this.setStatus(STATUS.loaded);
	}

	async screenIndexChange() {
		await this.drawCanvas();
	}

	hideCanvas() {
		const wasActive = this.active;
		super.hideCanvas();

		// Prepare the next ad while this display is hidden so the previous image
		// cannot flash briefly the next time the Advertisement screen appears.
		if (wasActive && this.data?.length > 0) {
			this.currentAdIndex = (this.currentAdIndex + 1) % this.data.length;
			const image = this.elem.querySelector('.advertisement-image');
			if (image) image.src = this.data[this.currentAdIndex];
		}
	}

	async drawCanvas() {
		super.drawCanvas();

		const image = this.elem.querySelector('.advertisement-image');

		if (image) {
			image.src = this.data[this.currentAdIndex];
		}

		this.finishDraw();
	}
}

// Position 7: immediately after Regional Forecast
const display = new Advertisement(7, 'advertisement');
registerDisplay(display);

export default display;
