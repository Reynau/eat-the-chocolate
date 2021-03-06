const PIXI = require('pixi.js')
const path = require('path')
const tmx = require('tmx-parser')
const TiledMap = require('tiled-to-pixi')

const Character = require('./Character')
const Entities = require('./Entities')
const Game = require('./Game')
const KeyboardHandler = require('./KeyboardHandler')

// PIXI constants
const app = new PIXI.Application()
const loader = PIXI.loader

let game

// Game constants
let character = {}
let entities = {}

let map = {}

let maxHearts = 10
let maxCoins = 10

let delta = 0
let timestep = 1000 / 60
let lastFrame = Date.now()

document.body.appendChild(app.view)

app.stop()
loader
  .add('character', 'assets/gfx/character.png')
  .add('objects', 'assets/gfx/objects.png')
  .add('TestMap', 'maps/testmap.tmx')
  .add('assets/gfx/Overworld.png')

  .use(TiledMap.middleware)

  .load(function (loader, resources) {
    map = new TiledMap('TestMap')
    app.stage.addChild(map)

    character = new Character(new KeyboardHandler(), resources.character.texture, 64, 32, map)
    app.stage.addChild(character.getAnimation())

    entities.hearts = []
    for (let i = 0; i < maxHearts; ++i) {
      let rndX = Math.random() * 800
      let rndY = Math.random() * 600
      let tmpHeart = new Entities.Heart(resources.objects.texture, rndX, rndY)
      entities.hearts.push(tmpHeart)
      app.stage.addChild(tmpHeart.getAnimation())
      tmpHeart.visible = false
    }

    entities.coins = []
    for (let i = 0; i < maxCoins; ++i) {
      let rndX = Math.random() * 800
      let rndY = Math.random() * 600
      let tmpCoin = new Entities.Coin(resources.objects.texture, rndX, rndY)
      entities.coins.push(tmpCoin)
      app.stage.addChild(tmpCoin.getAnimation())
      tmpCoin.visible = false
    }

    game = new Game(map, character, entities)

    app.start()
    setInterval(loop, timestep)
  })

function updateDelta () {
  let timestamp = Date.now()
  delta = timestamp - lastFrame
  lastFrame = timestamp
}

function loop () {
  updateDelta()
  while (delta >= timestep) {
    game.update()
    game.updateCamera(app.stage, app.renderer)
    delta -= timestep
  }
}