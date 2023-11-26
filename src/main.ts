import './style.css'
import Point from './classes/Point'
import {
    PRIMARY_COLOUR,
    SECONDARY_COLOUR,
    PLAYER_COLOUR
} from './constants/index'
import GameBoardManager from './classes/GameBoardManager'
import TileManager from './classes/TileManager'

const {
    canvasContext,
    height,
    width,
    numberOfColums,
    numberOfRows,
    pixelSize
} = GameBoardManager.getInstance()
const tileManager = TileManager.getInstance()

let isFirstLoad = true

function renderTiles(canvasContext: CanvasRenderingContext2D) {

}

class Player {
    private fillColour: string = PLAYER_COLOUR
    private pointManager: PointManager
    private canvasContext: CanvasRenderingContext2D
    public x: number = 0
    public y: number = 0

    constructor(
        pointManager: PointManager, 
        canvasContext: CanvasRenderingContext2D
    ) {
        this.pointManager = pointManager
        this.canvasContext = canvasContext
    }
    
    init() {
        const middleValue = ((numberOfColums - 1) / 2 ) 
        this.x = middleValue * pixelSize
        this.y = middleValue * pixelSize
    }
    
    render() {
        this.canvasContext.fillStyle = this.fillColour
        this.canvasContext.fillRect(this.x, this.y, pixelSize, pixelSize)
        this.pointManager.tryToScore(this.x, this.y)
    }

}

class PlayerController {
    private player:Player

    constructor(player: Player) {
        this.player = player
        this.register()
    }

    register() {
        document.addEventListener('keydown', this.listener.bind(this))
    }

    listener({ key }: KeyboardEvent) {
        switch (key) {
            case 'w':
                this.up()
                break
            case 'd':
                this.right()
                break
            case 's':
                this.down()
                break
            case 'a': 
                this.left()
                break
        }
    }

    up() {
        if (this.player.y > 0) {
            this.player.y -= pixelSize
        }
    }

    down() {
        if(this.player.y < height - pixelSize) {
            this.player.y += pixelSize
        }
    }

    left() {
        if (this.player.x > 0) {
            this.player.x -= pixelSize
        }
    }

    right() {
        if(this.player.x < width - pixelSize) {
            this.player.x += pixelSize
        }
    }
}



const randomMultipleInRange = 
    (multipleOf: number, max: number) => Math.floor(Math.random() * max) * multipleOf

class GameManager {
    pointsPerScore = 20
    points = 0
    pointsMissed = 0

    init() {
        this.points = 0
        this.pointsMissed = 0
        this.updatePoints()
    }

    scorePoint() {
        this.points += this.pointsPerScore
        this.updatePoints()
    }

    updatePoints() {
        const numberOfPointsElement = document.querySelector('.number-of-points')

        if(numberOfPointsElement?.innerHTML) {
            numberOfPointsElement.innerHTML = String(this.points)
        }
            
        const pointsMissedElement = document.querySelector('.missed-points')
        if(pointsMissedElement?.innerHTML) {
            pointsMissedElement.innerHTML = String(this.pointsMissed)
        }
    }

    missedPoint() {
        this.pointsMissed -= this.pointsPerScore
        this.updatePoints()
    }
}

interface PointsDictionary {
    [key: string]: Point
}

class PointManager {
    private timeToLive: number = 3000
    private points: PointsDictionary = {}
    private gameManager: GameManager
    private canvasContext: CanvasRenderingContext2D
    
    constructor(
        gameManager: GameManager, 
        canvasContext: CanvasRenderingContext2D
    ) {
        this.gameManager = gameManager
        this.canvasContext = canvasContext
    }
    
    createRandomPoint() {
        const randomColumInRange = randomMultipleInRange(pixelSize, numberOfColums)
        const randomRowInRange = randomMultipleInRange(pixelSize, numberOfColums)

        const point = new Point(randomColumInRange, randomRowInRange, this.canvasContext)
        this.points[this.getPointKey(point.x, point.y)] = point

        setTimeout(() => {
            this.removePoint(point)
            this.gameManager.missedPoint()
        }, this.timeToLive)
    }

    init() {
        this.points = {}
    }

    render() {
        Object.values(this.points).forEach(point => point.render())                
    }

    getPointKey(x: number , y: number) {
        return `(${x}-${y})`
    }

    getPoint(x: number, y: number) {
        return this.points[this.getPointKey(x, y)]
    }

    removePoint(point: Point) {
        delete this.points[this.getPointKey(point.x, point.y)]
    }

    tryToScore(x: number, y: number) {
        const point = this.getPoint(x, y)
        if(!point) return
        
        this.removePoint(point)
        this.gameManager.scorePoint() 
    }
}

const gameManager = new GameManager()
const pointManager = new PointManager(gameManager, canvasContext)
const player = new Player(pointManager, canvasContext)
new PlayerController(player)

// Bind reset button
document.querySelector('.restart-button')
    ?.addEventListener('click', () => (isFirstLoad = true))

let framesRendered: number = 0
const FRAMES_UNTIL_POINT = 15
function main() {
    ++framesRendered
    canvasContext.beginPath()

    if(isFirstLoad) {
        pointManager.init()
        player.init()
        gameManager.init()
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