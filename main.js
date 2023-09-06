const canvas = document.getElementById('micanvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var velocidad = 5;
let score = 0;
let pausa = false;
let c = 0;
class Figura {
	constructor({
		posicion = { x: 200, y: 200 },
		color = 'black',
		width = 50,
		height = 50,
		velocidad = { x: 0, y: 0 },
	}) {
		this.posicion = posicion;
		this.width = width;
		this.height = height;
		this.color = color;
		this.velocidad = velocidad;
	}
	draw() {
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'black';
		ctx.strokeRect(this.posicion.x, this.posicion.y, this.width, this.height);

		ctx.fillStyle = this.color;
		ctx.fillRect(this.posicion.x, this.posicion.y, this.width, this.height);
	}

	animacion() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.colorRandom();
		this.posicion.x += this.velocidad.x;
		this.posicion.y += this.velocidad.y;
		this.draw();
	}
	colision(obj) {
		return (
			this.posicion.x + this.width >= obj.posicion.x &&
			obj.posicion.x + obj.width >= this.posicion.x &&
			this.posicion.y + this.height >= obj.posicion.y &&
			obj.posicion.y + obj.height >= this.posicion.y
		);
	}
	limites() {
		if (this.posicion.x < -this.width) {
			this.posicion.x = canvas.width;
		}
		if (this.posicion.x > canvas.width) {
			this.posicion.x = 0;
		}

		if (this.posicion.y < -this.height) {
			this.posicion.y = canvas.height;
		}
		if (this.posicion.y > canvas.height) {
			this.posicion.y = 0;
		}
	}
	colorRandom() {
		let rojo = Math.floor(Math.random() * 256);
		let verde = Math.floor(Math.random() * 256);
		let azul = Math.floor(Math.random() * 256);
		let color = `rgb(${rojo},${verde},${azul})`;

		this.color = color;
	}
	posicionRandom() {
		this.posicion.x = Math.random() * canvas.width;
		this.posicion.y = Math.random() * canvas.height;
	}
}
const center = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

const box1 = new Figura({
	posicion: {
		x: center.x - 150,
		y: center.y - 40,
	},
	height: 50,
	width: 50,
	color: 'blue',
	velocidad: {
		x: 5,
		y: 0,
	},
});

const moneda = new Figura({
	posicion: {
		x: center.x + 150,
		y: center.y - 30,
	},
	height: 25,
	width: 25,
	color: 'yellow',
});

const muros = [];

muros.push(
	new Figura({
		posicion: {
			x: center.x - 250,
			y: 100,
		},
		height: 30,
		width: 500,
		color: 'blue',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: center.x - 250,
			y: canvas.height - 100,
		},
		height: 30,
		width: 500,
		color: 'blue',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: 250,
			y: center.y - 150,
		},
		height: 300,
		width: 30,
		color: 'blue',
	})
);
muros.push(
	new Figura({
		posicion: {
			x: canvas.width - 250,
			y: center.y - 150,
		},
		height: 300,
		width: 30,
		color: 'blue',
	})
);

function control() {
	window.addEventListener('keydown', (e) => {
		switch (e.keyCode) {
			case 87: //arriba
				box1.velocidad.x = 0;
				box1.velocidad.y = -velocidad;
				break;
			case 83: // abajo
				box1.velocidad.x = 0;
				box1.velocidad.y = velocidad;
				break;
			case 68: //derecha
				box1.velocidad.y = 0;
				box1.velocidad.x = velocidad;
				break;
			case 65: //izquierda
				box1.velocidad.y = 0;
				box1.velocidad.x = -velocidad;
				break;
			case 32:
				c++;
				if (c % 2 <= 0) {
					pausa = false;
					c = 0;
				} else {
					pausa = true;
					ctx.fillStyle = 'rgba(0,0,0,0.5)';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.beginPath();
					ctx.fillStyle = '#fff';
					ctx.font = '80px Arial';
					ctx.fillText('Pausa', center.x - 80, center.y - 40);
					ctx.closePath();
				}

				console.log(pausa);
				break;
		}
	});
}

function actualizar() {
	window.requestAnimationFrame(actualizar);
	if (pausa != true) {
		box1.animacion();
		box1.limites();
		if (box1.colision(moneda)) {
			score += 10;
			velocidad++;
			moneda.posicionRandom();
		}
		muros.forEach((muro) => {
			muro.draw();
			if (box1.colision(muro)) {
				box1.velocidad.x = 0;
				box1.velocidad.y = 0;
			}
		});
		moneda.draw();
		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.font = '40px Arial';
		ctx.fillText('Score: ' + score, 40, 40);
	}
}
control();

actualizar();
