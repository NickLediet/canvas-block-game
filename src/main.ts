import './style.css'
import GameBoardManager from './classes/GameBoardManager'
import TileManager from './classes/TileManager'
import Player from './classes/Player'
import PointManager from './classes/PointManager'
import GameManager from './classes/GameManager'
import PlayerController from './classes/PlayerController'
const {
    canvasContext,
} = GameBoardManager.getInstance()
const tileManager = TileManager.getInstance()
let isFirstLoad = true

const gameManager = new GameManager()
const pointManager = new PointManager(gameManager)
const player = new Player(pointManager)
new PlayerController(player)

// Bind reset button
document.querySelector('.restart-button')
    ?.addEventListener('click', () => (isFirstLoad = true))

let framesRendered: number = 0
const FRAMES_UNTIL_POINT = 15
gameManager.init()

function main() {
    ++framesRendered
    canvasContext.beginPath()

    if(isFirstLoad) {
        pointManager.init()
        player.init()

        isFirstLoad = false
    }

    tileManager.render()

    if(framesRendered % FRAMES_UNTIL_POINT === 0) {
        pointManager.createRandomPoint()
    }

    pointManager.render()
    player.render()
    canvasContext.closePath()
    
}
setInterval(main, 60)