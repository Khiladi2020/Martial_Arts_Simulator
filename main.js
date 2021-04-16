const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const bg_img_path = "images/background.jpg";
let bg_loaded = false;
let bg_img;

const loadImage = (img_path, callback) => {
	let img = new Image();
	img.onload = () => {
		console.log("img loaded");
		callback(img);
	};
	img.src = img_path; //"images/idle/1.png";
};

const getImgPath = (image, type) => {
	return `images/${type}/${image}.png`;
};

const getTotalImages = (data) => {
	let res = 0;
	for (let x in data) res += data[x];
	return res;
};

const loadImages = (img_data, callback) => {
	let all_images = {};
	const total_images_cnt = getTotalImages(img_data);
	let loaded_images_cnt = 0;

	for (let img_type in img_data) {
		all_images[img_type] = [];
		for (let i = 1; i <= img_data[img_type]; i++) {
			let img_path = getImgPath(i, img_type);

			loadImage(img_path, (img) => {
				all_images[img_type].push(img);
				loaded_images_cnt++;
				//print on all image loaded for a type
				if (all_images[img_type].length == img_data[img_type]) {
					console.log("done loading for", img_type);
					// console.log("after loading", ...all_images[img_type]);
					//sort images to animate properly in order
					//because images are not always downloaded according to order specified
					//this can cause random order of images instead of sorted order as required
					all_images[img_type].sort((a, b) => a.src > b.src);
					// console.log("after sorting", ...all_images[img_type]);
				}
				//run callback
				if (loaded_images_cnt === total_images_cnt) {
					callback(all_images);
				}
			});
		}
	}
};

const drawBg = () => {
	if (bg_loaded) {
		ctx.drawImage(bg_img, 0, 0, 800, 500);
	} else {
		loadImage(bg_img_path, (img) => {
			console.log("background image loaded");
			ctx.drawImage(img, 0, 0, 800, 500);
			bg_loaded = true;
			bg_img = img;
		});
	}
};

const animate_recur = (images, callback) => {
	images.forEach((image, index) => {
		setTimeout(() => {
			ctx.clearRect(0, 0, 500, 500);
			drawBg();
			ctx.drawImage(image, 0, 0, 500, 500);
		}, index * 100);
	});
	setTimeout(() => {
		// console.log("animation done");
		callback();
	}, images.length * 100);
};

const init_recur = (images) => {
	let animation_type = "idle";
	let animation_count = 1;
	let animation_queue = [];

	console.log("animation based on recursion");

	const aux = () => {
		animation_count++;
		// console.log(animation_count);
		if (animation_queue.length === 0) animate_recur(images["idle"], aux);
		else {
			animation_type = animation_queue.shift();
			animate_recur(images[animation_type], aux);
		}
	};
	aux();

	document.getElementById("punch").onclick = () => {
		animation_queue.push("punch");
	};
	document.getElementById("kick").onclick = () => {
		animation_queue.push("kick");
	};
	document.getElementById("forward").onclick = () => {
		animation_queue.push("forward");
	};
	document.getElementById("backward").onclick = () => {
		animation_queue.push("backward");
	};
	document.getElementById("block").onclick = () => {
		animation_queue.push("block");
	};
	//key bindings
	document.addEventListener("keyup", (e) => {
		if (e.key === "z") {
			animation_queue.push("kick");
		} else if (e.key === "x") {
			animation_queue.push("punch");
		} else if (e.key === "ArrowRight") {
			animation_queue.push("forward");
		} else if (e.key === "ArrowLeft") {
			animation_queue.push("backward");
		} else if (e.key === "ArrowDown") {
			animation_queue.push("block");
		}
	});
};

const IMAGE_INFO = {
	idle: 8,
	kick: 7,
	punch: 7,
	backward: 6,
	block: 9,
	forward: 6,
};

drawBg();
loadImages(IMAGE_INFO, init_recur);
