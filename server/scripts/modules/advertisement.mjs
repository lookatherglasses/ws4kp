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

		this.currentAdIndex = -1;
		this.timing.totalScreens = 1;

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
		this.currentAdIndex = (this.currentAdIndex + 1) % this.data.length;
		await this.drawCanvas();
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

// Position 6: immediately after Travel
const display = new Advertisement(6, 'advertisement');
registerDisplay(display);

export default display;