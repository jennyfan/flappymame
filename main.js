var game = new Phaser.Game(400, 450, Phaser.AUTO, 'gameDiv', null, true);

var mainState = {

    preload: function() { 

        game.load.image('clouds', 'assets/bg.gif'); 
        game.load.image('banner', 'assets/banner.gif'); 
        game.load.image('instructions', 'assets/instructions.gif'); 
        game.load.image('wao', 'assets/wao.gif'); 
        game.load.image('bird', 'assets/bird.png');  
        game.load.image('pipe', 'assets/pipe.png'); 

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav');     
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.clouds = game.add.tileSprite(0, 0, 400, 450, 'clouds');
        // this.clouds.autoScroll(-200,0);

        this.banner = game.add.tileSprite(0, 100, 400, 55, 'banner');
        // this.banner.autoScroll(-200,0);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  
        // this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 
        this.bird.body.allowGravity = false;

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 


        this.instructions = this.game.add.sprite(50,170, 'instructions');
        this.wao = this.game.add.sprite(150,150, 'wao');
 
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // start game on keyboard
        spaceKey.onDown.addOnce(this.startGame, this);
        spaceKey.onDown.add(this.jump, this);

        // Start game on touch
        this.input.onDown.addOnce(this.startGame, this);
        this.input.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        // Add the jump sound
        this.jumpSound = this.game.add.audio('jump');
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame(); 

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 

        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;     
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        this.jumpSound.play();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;
            
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },

    startGame: function() {
        this.instructions.destroy();
        this.wao.destroy();
        this.bird.body.allowGravity = true;
        this.clouds.autoScroll(-200,0);
        this.banner.autoScroll(-200,0);
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);
    }
};

game.state.add('main', mainState);  
game.state.start('main'); 