    ///////////////////////////////////////////////////////////////
    //Game: Gravity Tank - Justin Lawson                         //
    ///////////////////////////////////////////////////////////////

    window.onload = function() {

        var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('base', 'assets/tank.png');//tank base//
    game.load.image('cannon', 'assets/cannon.png');//tank cannon//
    game.load.image('bullet', 'assets/bullet.png');//bullet sprite//
    //game.load.tilemap('Tilemap', 'assets/Tile Layer 1.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.tilemap('level1', 'assets/JSON/level1.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.tilemap('level2', 'assets/JSON/level2.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.tilemap('level3', 'assets/JSON/level3.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.tilemap('level4', 'assets/JSON/level4.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.tilemap('levelTest', 'assets/JSON/levelTest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level', 'assets/JSON/multiLevel.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('block', 'assets/block.png');//block used for Tilemap//
    game.load.image('turretR', 'assets/wallTurret.png');//enemy turret on wall//
    game.load.image('turretG', 'assets/groundTurret.png');//enemy turret on ground//
    game.load.image('turretL', 'assets/PNG/leftWallTurret.png');
    game.load.image('turretC', 'assets/PNG/ceilingTurret.png');
    game.load.image('splosion', 'assets/PNG/splosionTest.png');//
    game.load.audio('shot', 'assets/9_mm_gunshot-mike-koenig-123.mp3');
    game.load.audio('hit', 'assets/Bomb 2-SoundBible.com-953367492.mp3');
    game.load.audio('music', 'assets/Voice Over Under.mp3');
    
    game.load.image('tankDown', 'assets/PNG/tankDown.png');
    game.load.image('tankUp', 'assets/PNG/tankUp.png');
    game.load.image('tankLeft', 'assets/PNG/tankLeft.png');
    game.load.image('tankRight', 'assets/PNG/tankRight.png');
    game.load.image('spread', 'assets/PNG/spreadShot.png');
    game.load.image('mgun', 'assets/PNG/machineGun.png');
    game.load.image('launcher', 'assets/PNG/grenadeLauncher.png');
    
    game.load.image('drone', 'assets/PNG/drone.png');
    game.load.image('sDrone', 'assets/PNG/sheildedDrone.png');
    game.load.image('sTurretR', 'assets/PNG/shieldedWallTurret.png');
    game.load.image('sTurretL', 'assets/PNG/shieldedLeftWallTurret.png');
    game.load.image('sTurretG', 'assets/PNG/shieldedGroundTurret.png');
    game.load.image('sTurretC', 'assets/PNG/shieldedCeilingTurret.png');
    game.load.image('mgunBullet', 'assets/PNG/machineGunBullet.png');
    game.load.image('nade', 'assets/PNG/grenade.png');
    game.load.image('GTank', 'assets/PNG/basicTank.png');
    game.load.image('GCannon', 'assets/PNG/basicCannon.png');
    game.load.image('mineG', 'assets/PNG/groundMine.png');
    game.load.image('mineL', 'assets/PNG/leftWallMine.png');
    game.load.image('mineR', 'assets/PNG/rightWallMine.png');
    game.load.image('mineC', 'assets/PNG/ceilingMine.png');
    game.load.image('gmineG', 'assets/PNG/gravityMine.png');
    game.load.image('gmineC', 'assets/PNG/ceilingGravityMine.png');
    game.load.image('gmineL', 'assets/PNG/leftGravityMine.png');
    game.load.image('gmineR', 'assets/PNG/rightGravityMine.png');
}

var player;
var cannon;
var facing = 'left';
var cursors;
var bg;
var g_dir = 'down';
var layer;
var map;
var upGrav;
var downGrav;
var leftGrav;
var rightGrav;
var onGround = false;
var turnCW;
var turnCCW;
var bullets;
var bulletTimer = 0;
var startKey;
var isRunning = false;
var stateText;
var healthText;
var enemies;
var enemyTimer = 0;//timer for enemy attacks//
var enemyBullets;
var enemy17;//GTank, must be global due to behaviour//
var mines;
var gcannon;
var playerHealth = 50;
var shootSFX;
var hitSFX;
var music;
var damageArr = [5, 10, 15];
var weaponType = 0;//0 = normal, 1 = spread, 2 = machinegun, 3 = grenade//
var bulletCD = 500;
var playerBombs;
var currentLevel;
var weaponSwitch;
var weaponText;
var weaponCD = 200;
var switchWeapon = function(){weaponType += 1;
                              if(weaponType > 3)
                                 weaponType = 0;};

var t = 32;//Constant: Size of tile//

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#555555';
    
    game.world.setBounds(0, 0, 3200, 640);
    
    map = game.add.tilemap('level');
    map.addTilesetImage('block');
    map.setCollision(1);
    
    layer = map.createLayer('Tile Layer 1');

    player = game.add.sprite(32, 96, 'tankDown');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    cannon = game.add.sprite(32, 96, 'cannon');
    game.physics.enable(cannon, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 0, 0);
    player.body.drag.set(100);
    
    cannon.body.collideWorldBounds = true;
    cannon.body.setSize(32, 32, 0, 0);
    cannon.anchor.setTo(.5, .5);
    
    bullets = game.add.group();
    enemyBullets = game.add.group();
    enemies = game.add.group();
    mines = game.add.group();
    playerBombs = game.add.group();
    
    
    
    shootSFX = game.add.audio('shot');
    hitSFX = game.add.audio('hit');
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    stateText = game.add.text(200, 200, "Press Enter to play!", {font: '34px Arial', fill: '#000'});
    stateText.fixedToCamera = true;
    healthText = game.add.text(32, 32, "Health: " + playerHealth, {font: '34px Arial', fill: '#000'});
    healthText.fixedToCamera = true;
    weaponText = game.add.text(220, 32, "Weapon: Normal", {font: '34px Arial', fill: '#000'});
    weaponText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    weaponSwitch = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upGrav = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downGrav = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftGrav = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightGrav = game.input.keyboard.addKey(Phaser.Keyboard.D);
    startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    game.camera.follow(player);
}

function update() {

    game.physics.arcade.collide(player, layer);
    
    cannon.body.x = player.body.x;
    cannon.body.y = player.body.y;
    
    healthText.text = "Health: " + playerHealth;
    
    if(weaponType == 1)
    {    
        bulletCD = 750;
        weaponText.text = "Weapon: Spread";
        cannon.loadTexture('spread');
    }
    
    else if(weaponType == 2)
    {
        bulletCD = 75;
        weaponText.text = "Weapon: Machine Gun";
        cannon.loadTexture('mgun');
    }
    
    else if(weaponType == 3)
    {
        bulletCD = 1000;
        weaponText.text = "Weapon: Grenade";
        cannon.loadTexture('launcher');
    }
    
    else
    {
        bulletCD = 500;
        weaponText.text = "Weapon: Normal";
        cannon.loadTexture('cannon');
    }
    
    if(isRunning && player.alive)
    {
        game.physics.arcade.collide(enemy17, layer);
        //game.physics.arcade.collide(enemy17, player);
        if(!enemy17.alive)
            gcannon.kill();
        if(enemy17.inCamera)
        {
            enemy17.body.gravity.x = player.body.gravity.x;
            enemy17.body.gravity.y = player.body.gravity.y;
            gcannon.body.x = enemy17.body.x;
            gcannon.body.y = enemy17.body.y;
            gcannon.rotation = game.physics.arcade.angleToXY(gcannon, player.body.x, player.body.y);
        }
        if(g_dir == 'down' || g_dir == 'up')
        {
            if(player.body.velocity.y == 0)
            {
                player.body.velocity.x = 0;
                onGround = true;
            }
        
            else
                onGround = false;
        }
    
        if(g_dir == 'left' || g_dir == 'right')
        {
            if(player.body.velocity.x == 0)
            {
                player.body.velocity.y = 0;
                onGround = true;
            }
        
            else
                onGround = false;
        }

        
        //change gravity//
        if(upGrav.isDown && onGround)
        {
            player.body.gravity.x = 0;
            player.body.gravity.y = -400;
            g_dir = 'up';
            player.loadTexture('tankUp');
        }
    
        else if(downGrav.isDown && onGround)
        {
            player.body.gravity.x = 0;
            player.body.gravity.y = 400;
            g_dir = 'down';
            player.loadTexture('tankDown');
        }
    
        else if(leftGrav.isDown && onGround)
        {
            player.body.gravity.x = -400;
            player.body.gravity.y = 0;
            g_dir = 'left';
            player.loadTexture('tankLeft');
        }
    
        else if(rightGrav.isDown && onGround)
        {
            player.body.gravity.x = 400;
            player.body.gravity.y = 0;
            g_dir = 'right';
            player.loadTexture('tankRight');
        }
        
        cannon.rotation = game.physics.arcade.angleToPointer(cannon);
    
        if(game.input.activePointer.isDown && game.time.now > bulletTimer)
        {
            shoot();
            bulletTimer = game.time.now + bulletCD;
        }
        
        if(game.time.now >= enemyTimer)//enemy action//
        {
            enemies.forEach(enemyShoot);
            enemyTimer = game.time.now + 2500;
        }
        
        weaponSwitch.onDown.add(switchWeapon, this);
        
    }
    
    if(playerHealth <= 0)//player death//
    {
        isRunning = false;
        player.kill();
        cannon.kill();
        stateText.text = "Game Over! Enter to restart.";
        stateText.visible = true;
    }
    
    if(startKey.isDown)//start game//
    {
        if(!isRunning)
        {
            enemyTimer = game.time.now + 1000;   
            playerHealth = 50;
            player.reset(32, 96);
            cannon.reset(32, 96);
            enemyInit();
            enemies.forEach(healthInit);
            
            //if(currentLevel == 0)
            //{
            //    level1Init();
            //    currentLevel = 1;
            //}
        }
        isRunning = true;
        stateText.visible = false;
    }
    
    game.physics.arcade.overlap(bullets, layer, wallCollision, null, this);
    game.physics.arcade.overlap(enemyBullets, layer, wallCollision, null, this);
    game.physics.arcade.overlap(player, enemyBullets, playerHit, null, this);
    game.physics.arcade.overlap(bullets, enemies, enemyHit, null, this);
    game.physics.arcade.overlap(playerBombs, enemies, explosionHit, null, this);
    game.physics.arcade.overlap(player, mines, mineHandler, null, this);
    //game.physics.arcade.overlap(player, enemy17, fixGTank, null, this);
}
        
function shoot()
{
    if(weaponType == 0)//Normal//
    {
        var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5)
        bullet.rotation = cannon.rotation;
        bullet.body.allowGravity = false;
        bullet.name = 'normal';
        game.physics.arcade.velocityFromRotation(cannon.rotation, 400, bullet.body.velocity);
    }
    
    else if(weaponType == 1)//Spreadshot//
    {
        var bullet1 = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet1, Phaser.Physics.ARCADE);
        bullet1.body.setSize(8, 8, 0, 0);
        bullet1.anchor.setTo(.5, .5)
        bullet1.rotation = cannon.rotation;
        bullet1.body.allowGravity = false;
        bullet1.name = 'spread';
        bullet1.lifespan = 500;
        game.physics.arcade.velocityFromRotation(cannon.rotation, 400, bullet1.body.velocity);
        
        var bullet2 = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet2, Phaser.Physics.ARCADE);
        bullet2.body.setSize(8, 8, 0, 0);
        bullet2.anchor.setTo(.5, .5)
        bullet2.rotation = cannon.rotation;
        bullet2.body.allowGravity = false;
        bullet2.name = 'spread';
        bullet2.lifespan = 500;
        game.physics.arcade.velocityFromRotation(cannon.rotation + 0.2, 400, bullet2.body.velocity);
        
        var bullet3 = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet3, Phaser.Physics.ARCADE);
        bullet3.body.setSize(8, 8, 0, 0);
        bullet3.anchor.setTo(.5, .5)
        bullet3.rotation = cannon.rotation;
        bullet3.body.allowGravity = false;
        bullet3.name = 'spread';
        bullet3.lifespan = 500;
        game.physics.arcade.velocityFromRotation(cannon.rotation - 0.2, 400, bullet3.body.velocity);
    }
    
    else if(weaponType == 2)//Machine Gun//
    {
        var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'mgunBullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5)
        bullet.rotation = cannon.rotation;
        bullet.body.allowGravity = false;
        bullet.name = 'mgun';
        var spread = Math.random() * 0.3;
        var negative = Math.random() * 2;
        if(negative >= 1)
            spread *= -1;
        bullet.lifespan = 900;
        game.physics.arcade.velocityFromRotation(cannon.rotation + spread, 400, bullet.body.velocity);
    }
    
    else if(weaponType = 3)//Grenade//
    {
        var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'nade');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5);
        bullet.rotation = cannon.rotation;
        bullet.body.gravity.y = 350;
        bullet.name = 'grenade';
        game.physics.arcade.velocityFromRotation(cannon.rotation, 275, bullet.body.velocity);
    }
    shootSFX.play();
}
        
function wallCollision(bullet, layer)
{
    if(bullet.name == 'grenade')
    {
        hitSFX.play();
        var explosion = playerBombs.create(bullet.body.x, bullet.body.y, 'splosion');
        explosion.lifespan = 600;
        game.physics.enable(explosion, Phaser.Physics.ARCADE);
        explosion.body.setSize(64, 64);
        explosion.anchor.setTo(.5, .5);
        explosion.body.allowGravity = false;
        bullet.kill();
    }

    bullet.kill();
        
}
        
function enemyShoot(enemy)
{
    if(!enemy.alive || !enemy.inCamera)
        return;
    
    var los = new Phaser.Line();
    los.start.set(enemy.body.x, enemy.body.y);
    los.end.set(player.body.x, player.body.y);
    
    if(layer.getRayCastTiles(los, 32, true, false).length > 0)//check line of sight//
    {
        los = null;
        return;
    }
    
    los = null;
    
    var bullet = enemyBullets.create(enemy.body.x + 16, enemy.body.y + 16, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.setSize(8, 8, 0, 0);
    bullet.anchor.setTo(.5, .5);
    bullet.body.allowGravity = false;
    game.physics.arcade.moveToObject(bullet, player, 400);
    
    shootSFX.play();
}
        
function playerHit(player, bullet)
{
    hitSFX.play();
    bullet.kill();
    playerHealth -= 5;
}
        
function enemyHit(bullet, enemy)
{
    if(bullet.name == 'grenade')
    {
        wallCollision(bullet);
        return;
    }        
    
    hitSFX.play();
    bullet.kill();
    
    if(bullet.name == 'normal')
        enemy.health -= 20;
    
    else if(bullet.name == 'spread')
        enemy.health -=30;
    
    else if(bullet.name == 'mgun')
        enemy.health -=10;
    
    if(enemy.health <= 0)
        enemy.kill();
}
        
function explosionHit(explosion, enemy)
{
    hitSFX.play();
    enemy.health -= 2;
    
    if(enemy.health <= 0)
        enemy.kill();
}
        
function mineHandler(player, mine)
{
    if(mine.name = 'gmine')
    {
        player.body.gravity.x = 0;
        player.body.gravity.y = 400;
        g_dir == 'down';
        mine.kill();
        return;
    }
    
    else if(mine.name = 'mine')
    {
        playerHealth -= 10;
        mine.kill();
    }
}

//Initializes enemy spawns//
function enemyInit()
{
    //////////////////////////////////
    //Room #1                       //
    //////////////////////////////////
    var enemy1 = enemies.create(18 * t, 10 * t, 'turretR');
    game.physics.enable(enemy1, Phaser.Physics.ARCADE);
    enemy1.body.allowGravity = false;
    enemy1.name = "Sentry";
    
    var enemy2 = enemies.create(11 * t, 10 * t, 'turretG');
    game.physics.enable(enemy2, Phaser.Physics.ARCADE);
    enemy2.body.allowGravity = false;
    enemy2.name = "Sentry";
    
    var enemy3 = enemies.create(1 * t, 16 * t, 'turretL');
    game.physics.enable(enemy3, Phaser.Physics.ARCADE);
    enemy3.body.allowGravity = false;
    enemy3.name = "Sentry";
    
    //////////////////////////////////
    //Room #2                       //
    //////////////////////////////////
    var enemy4 = enemies.create(30 * t, 5 * t, 'turretC');
    game.physics.enable(enemy4, Phaser.Physics.ARCADE);
    enemy4.body.allowGravity = false;
    enemy4.name = "Sentry";
    
    var enemy5 = enemies.create(34 * t, 7 * t, 'turretG');
    game.physics.enable(enemy5, Phaser.Physics.ARCADE);
    enemy5.body.allowGravity = false;
    enemy5.name = "Sentry";
    
    var enemy6 = enemies.create(36 * t, 8 * t, 'drone');
    game.physics.enable(enemy6, Phaser.Physics.ARCADE);
    enemy6.body.allowGravity = false;
    enemy6.name = "Drone";
    
    var enemy7 = enemies.create(36 * t, 9 * t, 'drone');
    game.physics.enable(enemy7, Phaser.Physics.ARCADE);
    enemy7.body.allowGravity = false;
    enemy7.name = "Drone";
    
    var enemy8 = enemies.create(37 * t, 8 * t, 'drone');
    game.physics.enable(enemy8, Phaser.Physics.ARCADE);
    enemy8.body.allowGravity = false;
    enemy8.name = "Drone";
    
    var enemy9 = enemies.create(37 * t, 9 * t, 'sDrone');
    game.physics.enable(enemy9, Phaser.Physics.ARCADE);
    enemy9.body.allowGravity = false;
    enemy9.name = "sDrone";
    
    var enemy10 = enemies.create(36 * t, 12 * t, 'turretC');
    game.physics.enable(enemy10, Phaser.Physics.ARCADE);
    enemy10.body.allowGravity = false;
    enemy10.name = "Sentry";
    
    var enemy11 = enemies.create(37 * t, 12 * t, 'turretC');
    game.physics.enable(enemy11, Phaser.Physics.ARCADE);
    enemy11.body.allowGravity = false;
    enemy11.name = "Sentry";
    
    //////////////////////////////////
    //Room #3                       //
    //////////////////////////////////
    var enemy12 = enemies.create(46 * t, 9 * t, 'drone');
    game.physics.enable(enemy12, Phaser.Physics.ARCADE);
    enemy12.body.allowGravity = false;
    enemy12.name = "Drone";
    
    var enemy13 = enemies.create(50 * t, 5 * t, 'drone');
    game.physics.enable(enemy13, Phaser.Physics.ARCADE);
    enemy13.body.allowGravity = false;
    enemy13.name = "Drone";
    
    var enemy14 = enemies.create(54 * t, 9 * t, 'drone');
    game.physics.enable(enemy14, Phaser.Physics.ARCADE);
    enemy14.body.allowGravity = false;
    enemy14.name = "Drone";
    
    var enemy15 = enemies.create(50 * t, 13 * t, 'drone');
    game.physics.enable(enemy15, Phaser.Physics.ARCADE);
    enemy15.body.allowGravity = false;
    enemy15.name = "Drone";
    
    var enemy16 = enemies.create(50 * t, 9 * t, 'sDrone');
    game.physics.enable(enemy16, Phaser.Physics.ARCADE);
    enemy16.body.allowGravity = false;
    enemy16.name = "sDrone";
    
    enemy17 = enemies.create(56 * t, 1 * t, 'GTank');
    game.physics.enable(enemy17, Phaser.Physics.ARCADE);
    enemy17.name = "GTank";
    gcannon = game.add.sprite(56 * t, 1 * t, 'GCannon');
    game.physics.enable(gcannon, Phaser.Physics.ARCADE);
    gcannon.body.setSize(32, 32, 0, 0);
    gcannon.anchor.setTo(.5, .5);
    
    //////////////////////////////////
    //Room #4                       //
    //////////////////////////////////
    var enemy18 = mines.create(69 * t, 6 * t, 'mineR');
    game.physics.enable(enemy18, Phaser.Physics.ARCADE);
    enemy18.body.allowGravity = false;
    enemy18.name = "mine";
    
    var enemy19 = mines.create(69 * t, 7 * t, 'mineG');
    game.physics.enable(enemy19, Phaser.Physics.ARCADE);
    enemy19.body.allowGravity = false;
    enemy19.name = "mine";
    
    var enemy20 = mines.create(74 * t, 13 * t, 'mineG');
    game.physics.enable(enemy20, Phaser.Physics.ARCADE);
    enemy20.body.allowGravity = false;
    enemy20.name = "mine";
    
    var enemy21 = mines.create(71 * t, 16 * t, 'mineG');
    game.physics.enable(enemy21, Phaser.Physics.ARCADE);
    enemy21.body.allowGravity = false;
    enemy21.name = "mine";
    
    var enemy22 = mines.create(69 * t, 1 * t, 'gmineC');
    game.physics.enable(enemy22, Phaser.Physics.ARCADE);
    enemy22.body.allowGravity = false;
    enemy22.name = "gmine";
    
    var enemy23 = mines.create(74 * t, 5 * t, 'gmineC');
    game.physics.enable(enemy23, Phaser.Physics.ARCADE);
    enemy23.body.allowGravity = false;
    enemy23.name = "gmine";
    
    var enemy24 = enemies.create(62 * t, 13 * t, 'turretC');
    game.physics.enable(enemy24, Phaser.Physics.ARCADE);
    enemy24.body.allowGravity = false;
    enemy24.name = "Sentry";
    
    var enemy25 = enemies.create(63 * t, 13 * t, 'turretC');
    game.physics.enable(enemy25, Phaser.Physics.ARCADE);
    enemy25.body.allowGravity = false;
    enemy25.name = "Sentry";
    
    var enemy26 = enemies.create(75 * t, 13 * t, 'turretR');
    game.physics.enable(enemy26, Phaser.Physics.ARCADE);
    enemy26.body.allowGravity = false;
    enemy26.name = "Sentry";
    
    var enemy27 = enemies.create(90 * t, 2 * t, 'turretL');
    game.physics.enable(enemy27, Phaser.Physics.ARCADE);
    enemy27.body.allowGravity = false;
    enemy27.name = "Sentry";
    
    var enemy28 = enemies.create(96 * t, 3 * t, 'turretG');
    game.physics.enable(enemy28, Phaser.Physics.ARCADE);
    enemy28.body.allowGravity = false;
    enemy28.name = "Sentry";
    
    var enemy29 = enemies.create(95 * t, 4 * t, 'turretR');
    game.physics.enable(enemy29, Phaser.Physics.ARCADE);
    enemy29.body.allowGravity = false;
    enemy29.name = "Sentry";
    
    var enemy30 = enemies.create(96 * t, 5 * t, 'turretC');
    game.physics.enable(enemy30, Phaser.Physics.ARCADE);
    enemy30.body.allowGravity = false;
    enemy30.name = "Sentry";
    
    var enemy31 = enemies.create(97 * t, 4 * t, 'turretL');
    game.physics.enable(enemy31, Phaser.Physics.ARCADE);
    enemy31.body.allowGravity = false;
    enemy31.name = "Sentry";
    
    var enemy32 = enemies.create(98 * t, 8 * t, 'turretR');
    game.physics.enable(enemy32, Phaser.Physics.ARCADE);
    enemy32.body.allowGravity = false;
    enemy32.name = "Sentry";
    
    var enemy33 = enemies.create(84 * t, 9 * t, 'sDrone');
    game.physics.enable(enemy33, Phaser.Physics.ARCADE);
    enemy33.body.allowGravity = false;
    enemy33.name = "sDrone";
    
    var enemy34 = enemies.create(81 * t, 15 * t, 'turretL');
    game.physics.enable(enemy34, Phaser.Physics.ARCADE);
    enemy34.body.allowGravity = false;
    enemy34.name = "Sentry";
    
    var enemy35 = enemies.create(81 * t, 16 * t, 'turretL');
    game.physics.enable(enemy35, Phaser.Physics.ARCADE);
    enemy35.body.allowGravity = false;
    enemy35.name = "Sentry";
    
    var enemy36 = enemies.create(81 * t, 17 * t, 'turretL');
    game.physics.enable(enemy36, Phaser.Physics.ARCADE);
    enemy36.body.allowGravity = false;
    enemy36.name = "Sentry";
    
    var enemy37 = enemies.create(92 * t, 15 * t, 'sDrone');
    game.physics.enable(enemy37, Phaser.Physics.ARCADE);
    enemy37.body.allowGravity = false;
    enemy37.name = "sDrone";
    
    var enemy38 = enemies.create(93 * t, 14 * t, 'sDrone');
    game.physics.enable(enemy38, Phaser.Physics.ARCADE);
    enemy38.body.allowGravity = false;
    enemy38.name = "sDrone";
    
    var enemy39 = enemies.create(93 * t, 16 * t, 'sDrone');
    game.physics.enable(enemy39, Phaser.Physics.ARCADE);
    enemy37.body.allowGravity = false;
    enemy37.name = "sDrone";
}
        
function healthInit(enemy)
{
    if(enemy.name == "Sentry")
        enemy.health = 30;
    
    else if(enemy.name == "sSentry")
        enemy.health = 60;
    
    else if(enemy.name == "Drone")
        enemy.health = 20;
    
    else if(enemy.name == "sDrone")
        enemy.health = 40;
    
    else if(enemy.name == "GTank")
        enemy.health = 100;
}
        
function fixGTank(player, gtank)
{
    if(gtank.body.gravity.x > 0)
        gtank.body.velocity.x = -100;
    
    else if(gtank.body.gravity.x < 0)
        gtank.body.velocity.x = 100;
    
    if(gtank.body.gravity.y > 0)
        gtank.body.velocity.y = -100;
    
    else if(gtank.body.gravity.y < 0)
        gtank.body.velocity.y = 100;
}
        
function render() {}


    };