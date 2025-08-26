$(function() {
    console.log("%c  ~~~  Bob v0.5 - Developed by d4rkd0s & d3mn5pwn ~~~  ", "color: #FFFFFF; font-size: 12px; background: #3F1338;");
    var game = new Phaser.Game(1156, 650, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    var elapsedTime;
    var timerEvent;
    var appleLoop;
    var appleDelay = 3000;
    var bushes;
    var bushsound;
    var horseHealth;
    var horseSentToVet;
    var horseFrames = ['horse1', 'horse2', 'horse3', 'horse4'];
    var cursors, wasd;
    var treePositions = [{x:450, y:30}, {x:800, y:30}];
    var trees = [];
    var apples;

    function preload() {
        //setting up starting vars
        max_apple_count = 100;
        score = 0;
        hoof = 0;
        horseHealth = 10;
        horseSentToVet = false;
        speed = 250;
        speedBonus = 0;
        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        console.log("%c   loaded: spritesheet   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('apple', 'assets/images/apple_red.png');
        game.load.image('goldenApple', 'assets/images/apple_yellow.png');
        game.load.image('tree', 'assets/images/tree.png');
        game.load.image('sun', 'assets/images/sun.png');
        game.load.image('background', 'assets/images/background.png');
        game.load.image('bush', 'assets/images/bush.png');
        console.log("%c   loaded: bush   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        console.log("%c   loaded: background   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('ocean', 'assets/images/ocean.png');
        console.log("%c   loaded: horse   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.spritesheet('horse', 'assets/images/horse.png', 154, 113);
        game.load.image('ambulance', 'assets/images/ambulance.png');
        console.log("%c   loaded: ambulance   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        console.log("%c   loaded: horse frames   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('horse1', 'assets/images/horse1.png');
        game.load.image('horse2', 'assets/images/horse2.png');
        game.load.image('horse3', 'assets/images/horse3.png');
        game.load.image('horse4', 'assets/images/horse4.png');
        console.log("%c   set border: ocean   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.audio('applesound', 'assets/sounds/apple.wav');
        game.load.audio('bobsound', 'assets/sounds/bob.wav');
        game.load.audio('bushsound', 'assets/sounds/bob.wav');
        // game.load.audio('goldenapplesound', 'assets/sounds/golden.wav'); // TODO: add golden apple sound

        // Walking case switch / coroutine
        function coroutine(f) {
            var o = f(); // instantiate the coroutine
            o.next(); // execute until the first yield
            return function(x) {
                o.next(x);
            }
        }
        var clock = coroutine(function*(_) {
            while (true) {
                yield _;
                foot = 0;
                yield _;
                foot = 1;
            }
        });

        var horseclock = coroutine(function*(_) {
            while (true) {
                yield _;
                hoof = 0;
                yield _;
                hoof = 1;
                yield _;
                hoof = 2;
                yield _;
                hoof = 3;
            }
        });

        //walk step speed in ms
        setInterval(clock, 100);
        setInterval(horseclock, 100);
        //spawn apples in ms using Phaser timer
        appleLoop = game.time.events.loop(appleDelay, spawnApples, this);
        //notify user (console)
        console.log("%c   walking: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
    }//preload

    function create() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'background');
        console.log("%c   spawned: background   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        //Game Objects

        // Stretch to fill
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        //text = "Score: " . score;
        //style = { font: "32px Arial", fill: "#3D4185", align: "center" };
        //game.add.text(game.world.centerX-300, 0, text, style);
        //sound
        applesound = game.add.audio('applesound');
        applesound.allowMultiple = true;

        bobsound = game.add.audio('bobsound');
        bobsound.allowMultiple = true;

        bushsound = game.add.audio('bushsound');
        bushsound.allowMultiple = false;

        ocean = game.add.sprite(0, game.world.height - 484, 'ocean');
        console.log("%c   spawned: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");

        bushes = game.add.group();
        bushes.enableBody = true;
        for (var i = 0; i < 5; i++) {
            var randX = game.rnd.integerInRange(50, game.world.width - 100);
            var randY = game.rnd.integerInRange(Math.floor(game.world.height * 0.2), game.world.height - 100);
            var bush = bushes.create(randX, randY, 'bush');
            bush.body.immovable = true;
        }

        // goldenapplesound = game.add.audio('goldenapplesound'); // TODO: add golden apple sound
        for (var i = 0; i < treePositions.length; i++) {
            trees[i] = game.add.sprite(treePositions[i].x, treePositions[i].y, 'tree');
        }

        //add horse
        horse = game.add.sprite(450, game.world.height - 300, 'horse1');
        horse.inBush = false;
        horse.wasInBush = false;

        //add sun
        sun = game.add.sprite(80, 20, 'sun');

        //add player
        player = game.add.sprite(775, game.world.height - 150, 'bob');
        player.inBush = false;
        player.wasInBush = false;
        console.log("%c   spawned: player   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        //ocean
        game.physics.enable(ocean, Phaser.Physics.ARCADE);
        console.log("%c   physics: enabled(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        ocean.body.immovable = true;
        console.log("%c   locked: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #A40E38;");

        //start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(bushes);
        console.log("%c   physics: enabled(player)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        game.physics.arcade.enable(player);
        game.physics.arcade.enableBody(player);
        console.log("%c   physics: bounds(player)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        game.physics.arcade.enable(horse);
        game.physics.arcade.enableBody(horse);
        player.body.collideWorldBounds = true;
        horse.body.collideWorldBounds = true;
        console.log("%c   collideWorldBounds: enabled   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        horse.anchor.x = 0.5;
        horse.anchor.y = 0.5;

        cursors = game.input.keyboard.createCursorKeys();
        wasd = game.input.keyboard.addKeys({
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D
        });
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.S, Phaser.Keyboard.D]);
        console.log("%c   user input: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");

        // game.scale.enterFullScreen.add(onEnterFullScreen, this);
        // game.scale.leaveFullScreen.add(onLeaveFullScreen, this);
        //
        // game.input.onDown.add(gofull, this);

        apples = game.add.group();
        apples.enableBody = true;

        spawnApples();

        elapsedTime = 0;
        $('#timer').text('Time: ' + elapsedTime);
        timerEvent = game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
    }//create

    function onEnterFullScreen() {

        //do anything you want

    }

    function onLeaveFullScreen() {

        //do anything you want

    }

    function updateTimer() {
        elapsedTime++;
        $('#timer').text('Time: ' + elapsedTime);
    }

    function gofull() {

        game.scale.startFullScreen();

    }

    function levelEnd(scoreEnd, horseHealthEnd) {
        console.log("apple count is now zero!");
        game.debug.text('Retry? (Refresh the page)', (game.width/2)-140, game.height/2);
        game.physics.destroy();
    }

    function bushCollide(entity, bush) {
        if (!entity.wasInBush && bushsound && !bushsound.isPlaying) {
            bushsound.play();
        }
        entity.inBush = true;
    }

    function sendHorseToVet() {
        game.time.events.remove(appleLoop);
        var ambulance = game.add.sprite(-200, horse.y, 'ambulance');
        var driveToHorse = game.add.tween(ambulance).to({x: horse.x - 100}, 2000, Phaser.Easing.Linear.None, true);
        driveToHorse.onComplete.add(function () {
            horse.kill();
            var driveOff = game.add.tween(ambulance).to({x: game.world.width}, 2000, Phaser.Easing.Linear.None, true);
            driveOff.onComplete.add(function () {
                game.debug.text('Retry? (Refresh the page)', (game.width/2)-140, game.height/2);
                game.physics.destroy();
            }, this);
        }, this);
    }

    function spawnAppleAtTree(index) {
        var spawnTree = treePositions[index];
        var randX = Math.floor(Math.random() * ((spawnTree.x + 200) - (spawnTree.x + 150) + 1) + (spawnTree.x + 150));
        var randY = Math.floor(Math.random() * ((spawnTree.y + 160) - (spawnTree.y + 60) + 1) + (spawnTree.y + 60));
        var isGoldenApple = Math.random() < 0.1;
        var appleType = isGoldenApple ? 'goldenApple' : 'apple';
        var apple = apples.create(randX, randY, appleType);
        apple.body.collideWorldBounds = true;
        apple.body.allowGravity = false;
        apple.body.velocity.set(0);
        game.time.events.add(Phaser.Timer.SECOND * 5, function(){ apple.kill(); }, this);
        max_apple_count = max_apple_count - 1;
    }

    function spawnApples() {
        if (max_apple_count <= 0) {
            levelEnd(score, horseHealth);
            return;
        }
        for (var i = 0; i < treePositions.length && max_apple_count > 0; i++) {
            spawnAppleAtTree(i);
        }
    }

    function collectApple(player, apple) {
        if (apple.key === 'goldenApple') {
            score = score + 5;
            speedBonus = 200;
            game.time.events.add(Phaser.Timer.SECOND * 5, function(){
                speedBonus = 0;
            }, this);
        } else {
            score = score + 1;
            bobsound.play();
        }
        $("#score").text("Score: " + score);
        apple.kill();
        console.log("Score: " + score);
    }

    function horseEatApple(horse, apple) {
        horseHealth = horseHealth - 1;
        if (horseHealth == 1) {
            $("#horseHealth").text(horseHealth + " apple until your horse needs the vet!");
        }
        else{
            $("#horseHealth").text(horseHealth + " apples until your horse needs the vet!");
        }
        applesound.play();
        apple.kill();
        if (horseHealth == 0 && !horseSentToVet) {
            horseSentToVet = true;
            $("#score").text("Final Score: " + score);
            $("#horseHealth").text("Your horse is off to the vet!");
            sendHorseToVet();
        }
        console.log("horseHealth: " + horseHealth);
    }

    function update() {

        player.wasInBush = player.inBush;
        player.inBush = false;
        horse.wasInBush = horse.inBush;
        horse.inBush = false;

        // adjust apple spawn timer based on score
        var newDelay = computeAppleDelay(score);
        if (newDelay !== appleDelay) {
            appleDelay = newDelay;
            game.time.events.remove(appleLoop);
            appleLoop = game.time.events.loop(appleDelay, spawnApples, this);
        }
        //ocean collision
        game.physics.arcade.collide(player, ocean);
        game.physics.arcade.collide(player, horse);
        game.physics.arcade.collide(horse, ocean);
        game.physics.arcade.collide(player, bushes, bushCollide, null, this);
        game.physics.arcade.collide(horse, bushes, bushCollide, null, this);
        //horse.body.accelerateToObject(horse, player, 600, 250, 250);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        //bob faster as he scores
        speed = 200+(10*score)+speedBonus;

        //move mr.horse
        if (apples.countLiving() > 0)
        {
            var targetApple = game.physics.arcade.closest(horse, apples);
            horse.velocity = game.physics.arcade.accelerateToObject(horse, targetApple, 50+(score*5), 50+(score*5), 50+(score*5));
            horse.loadTexture(horseFrames[hoof]);
            if (horse.body.velocity.x < 0) {
                horse.scale.x = -1;
            } else if (horse.body.velocity.x > 0) {
                horse.scale.x = 1;
            }
        }

        if ( player.y < 250 ) {
            for (var i = 0; i < trees.length; i++) {
                trees[i].bringToTop();
            }
            apples.forEachAlive(function(a){ a.bringToTop(); }, this);
        } else{
            player.bringToTop();
        }

        game.physics.arcade.overlap(apples, player, collectApple, null, this);
        game.physics.arcade.overlap(apples, horse, horseEatApple, null, this);

        if (cursors.left.isDown || wasd.left.isDown)
        {
            if (cursors.up.isDown || wasd.up.isDown)
            {
                //  Move to the left+up
                player.body.velocity.x = -speed;
                player.body.velocity.y = -speed;
                if ( foot == 0 ){
                    player.frame = 4;
                }
                if ( foot == 1 ){
                    player.frame = 5;
                }
            }
            else if (cursors.down.isDown || wasd.down.isDown)
            {
                //  Move to the left+down
                player.body.velocity.x = -speed;
                player.body.velocity.y = speed;
                if ( foot == 0 ){
                    player.frame = 4;
                }
                if ( foot == 1 ){
                    player.frame = 5;
                }
            }
            else
            {
                //  Move to the left
                player.body.velocity.x = -speed*2;
                if ( foot == 0 ){
                    player.frame = 4;
                }
                if ( foot == 1 ){
                    player.frame = 5;
                }
            }

        }

        else if (cursors.right.isDown || wasd.right.isDown)
        {
            if (cursors.up.isDown || wasd.up.isDown)
            {
                //  Move to the right+up
                player.body.velocity.x = speed;
                player.body.velocity.y = -speed;
                if ( foot == 0 ){
                    player.frame = 6;
                }
                if ( foot == 1 ){
                    player.frame = 7;
                }
            }
            else if (cursors.down.isDown || wasd.down.isDown)
            {
                //  Move to the right+down
                player.body.velocity.x = speed;
                player.body.velocity.y = speed;
                if ( foot == 0 ){
                    player.frame = 6;
                }
                if ( foot == 1 ){
                    player.frame = 7;
                }
            }
            else
            {
                //  Move to the right
                player.body.velocity.x = speed*2;
                if ( foot == 0 ){
                    player.frame = 6;
                }
                if ( foot == 1 ){
                    player.frame = 7;
                }
            }

        }
        else if (cursors.up.isDown || wasd.up.isDown)
        {
            //  Move to the up
            player.body.velocity.y = -speed;
            if ( foot == 0 ){
                player.frame = 2;
            }
            if ( foot == 1 ){
                player.frame = 3;
            }
        }
        else if (cursors.down.isDown || wasd.down.isDown)
        {
            //  Move to the down
            player.body.velocity.y = speed;
            if ( foot == 0 ){
                player.frame = 0;
            }
            if ( foot == 1 ){
                player.frame = 1;
            }

        }

    } //update

    function render () {

        // Removed fullscreen message
        // if (game.scale.isFullScreen)
        // {
        //     game.debug.text('ESC to leave fullscreen', (game.width/2)-140, 60);
        // }
        // else
        // {
        //     game.debug.text('Click / Tap to go fullscreen', (game.width/2)-140, 16);
        // }

    }

});