const my_scene = {

    preload: function() {
        this.load.bitmapFont("arcade", "font/arcade.png", "font/arcade.xml");
    },

    create: function() {

        this.my_text = 
            this.add.bitmapText(400, 300, "arcade", "Press Arrow Keys").setOrigin(0.5);

        this.arrow_keys =
            this.input.keyboard.createCursorKeys();
    },
    
    update: function() {

        if(this.arrow_keys.left.isDown) {
            this.my_text.x -= 10;
        }
        if(this.arrow_keys.right.isDown) {
            this.my_text.x += 10;
        }
        if(this.arrow_keys.up.isDown) {
            this.my_text.y -= 10;
        }
        if(this.arrow_keys.down.isDown) {
            this.my_text.y += 10;
        }

        if(this.my_text.x > 960) {
            this.my_text.x = -160;
        }
        if(this.my_text.x < -160) {
            this.my_text.x = 960;
        }
        if(this.my_text.y < -5) {
            this.my_text.y = 605;
        }
        if(this.my_text.y > 605) {
            this.my_text.y = -5;
        }

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    scene: my_scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
}

const game = new Phaser.Game(config);
