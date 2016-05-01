    ///////////////////////////////////////////////////////////////
    //Game: Gravity Tank - Justin Lawson                         //
    ///////////////////////////////////////////////////////////////

    window.onload = function() {

        var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('base', 'assets/tank.png');//tank base//
    game.load.image('cannon', 'assets/cannon.png');//tank cannon//
    game.load.image('bullet', 'assets/bullet.png');//bullet sprite//
    game.load.tilemap('Tilemap', 'assets/Tile Layer 1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level1', 'assets/JSON/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/JSON/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', 'assets/JSON/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level4', 'assets/JSON/level4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('block', 'assets/block.png');//block used for Tilemap//
    game.load.image('turretRight', 'assets/wallTurret.png');//enemy turret on wall//
    game.load.image('turretGround', 'assets/groundTurret.png');//enemy turret on ground//
    game.load.image('turretLeft', 'assets/PNG/leftWallTurret.png');
    game.load.image('turretCeiling', 'assets/PNG/ceilingTurret.png');
    game.load.image('splosion', 'assets/splosionTest.png');//
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
    game.load.image('shieldDrone', 'assets/PNG/sheildedDrone.png');
    game.load.image('sheildTurretR', 'assets/PNG/shieldedWallTurret.png');
    game.load.image('sheildTurretL', 'assets/PNG/shieldedLeftWallTurret.png');
    game.load.image('sheildTurretG', 'assets/PNG/shieldedGroundTurret.png');
    game.load.image('sheildTurretC', 'assets/PNG/shieldedCeilingTurret.png');
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
var enemy1;//wall turret//
var enemy2;//ground turret//
var enemy3;//ground turret//
var enemyTimer = 0;//timer for enemy attacks//
var enemyBullets;
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

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#555555';
    
    map = game.add.tilemap('level1');
    map.addTilesetImage('block');
    map.setCollision(1);
    
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

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
    playerBombs = game.add.group();
    
    enemy1 = enemies.create(576, 320, 'turretRight');
    game.physics.enable(enemy1, Phaser.Physics.ARCADE);
    enemy1.body.allowGravity = false;
    enemy1.name = "Sentry";
    
    enemy2 = enemies.create(352, 320, 'turretGround');
    game.physics.enable(enemy2, Phaser.Physics.ARCADE);
    enemy2.body.allowGravity = false;
    enemy2.name = "Sentry";
    
    enemy3 = enemies.create(64, 512, 'turretGround');
    game.physics.enable(enemy3, Phaser.Physics.ARCADE);
    enemy3.body.allowGravity = false;
    enemy3.name = "Sentry";
    
    shootSFX = game.add.audio('shot');
    hitSFX = game.add.audio('hit');
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    stateText = game.add.text(200, 200, "Press Enter to play!", {font: '34px Arial', fill: '#000'});
    healthText = game.add.text(32, 32, "Health: " + playerHealth, {font: '34px Arial', fill: '#000'});
    weaponText = game.add.text(220, 32, "Weapon: Normal", {font: '34px Arial', fill: '#000'});

    cursors = game.input.keyboard.createCursorKeys();
    weaponSwitch = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upGrav = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downGrav = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftGrav = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightGrav = game.input.keyboard.addKey(Phaser.Keyboard.D);
    startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
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
            enemy1.reset(576, 320);
            enemy2.reset(352, 320);
            enemy3.reset(32, 512);
            
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
        var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5)
        bullet.rotation = cannon.rotation;
        bullet.body.allowGravity = false;
        bullet.name = 'rapid';
        var spread = Math.random() * 0.3;
        var negative = Math.random() * 2;
        if(negative >= 1)
            spread *= -1;
        bullet.lifespan = 900;
        game.physics.arcade.velocityFromRotation(cannon.rotation + spread, 400, bullet.body.velocity);
    }
    
    else if(weaponType = 3)//Grenade//
    {
        var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5);
        bullet.rotation = cannon.rotation;
        bullet.body.gravity.y = 350;
        bullet.name = "grenade";
        game.physics.arcade.velocityFromRotation(cannon.rotation, 275, bullet.body.velocity);
    }
    shootSFX.play();
}
        
function wallCollision(bullet, layer)
{
    if(bullet.name == 'grenade')
    {
        var explosion = playerBombs.create(bullet.body.x, bullet.body.y, 'splosion');
        explosion.lifespan = 600;
        game.physics.enable(explosion, Phaser.Physics.ARCADE);
        explosion.body.setSize(64, 64);
        explosion.anchor.setTo(.5, .5);
        explosion.body.allowGravity = false;
        hitSFX.play();
        bullet.kill();
    }

    bullet.kill();
        
}
        
function enemyShoot(enemy)
{
    if(!enemy.alive)
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
    if(enemy.name == "Sentry")
        bullet.name = "bullet1";
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
    if(playerHealth > 0)
    {
        if(bullet.name == 'bullet1')
            playerHealth -= damageArr[0];
        
        else if(bullet.name == 'bullet2')
            playerHealth -= damageArr[1];
        
        else if(bullet.name == 'bullet3')
            playerHealth -= damageArr[2];
    }
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
    enemy.kill();
}
        
function explosionHit(explosion, enemy)
{
    hitSFX.play();
    enemy.kill();
}
        
function level1Init()
{
    var levelEnemies = game.add.group;
    enemies = levelEnemies;
    enemy1 = levelEnemies.create(576, 320, 'turretRight');
    game.physics.enable(enemy1, Phaser.Physics.ARCADE);
    enemy1.body.allowGravity = false;
    enemy1.name = "Sentry";
    
    enemy2 = levelEnemies.create(352, 320, 'turretGround');
    game.physics.enable(enemy2, Phaser.Physics.ARCADE);
    enemy2.body.allowGravity = false;
    enemy2.name = "Sentry";
    
    enemy3 = levelEnemies.create(32, 512, 'turretLeft');
    game.physics.enable(enemy3, Phaser.Physics.ARCADE);
    enemy3.body.allowGravity = false;
    enemy3.name = "Sentry";
}
        
function render() {}


    };