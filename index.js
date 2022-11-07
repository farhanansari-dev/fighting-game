const canvas = document.querySelector("canvas");
// creating the canvas context
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.9;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imgSrc: "./assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// constructing the player on the left hand side
const player = new Fighter({
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/samuraiMack/idle.png",
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  framesMax: 8,
  sprites: {
    idle: {
      imgSrc: "./assets/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./assets/samuraiMack/jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imgSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

// constructin the player on the right hand side
const enemy = new Fighter({
  position: {
    x: 1024 - 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/kenji/idle.png",
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  framesMax: 4,
  sprites: {
    idle: {
      imgSrc: "./assets/kenji/idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./assets/kenji/jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -180,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};
decreaseTimer();

// animate funcion

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -6;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.switchSprite("run");
    player.velocity.x = 6;
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -6;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.switchSprite("run");
    enemy.velocity.x = 6;
  } else {
    enemy.switchSprite("idle");
  }
  // enemy jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for player is hitting
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // detect for enemy is hitting

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

// listen for key press event

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case "s":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

// listen for key not pressed
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
