const PRIMARY_COLOUR = '#8DA05E'
const SECONDARY_COLOUR = '#E9EDE0'
const PLAYER_COLOUR = '#2A2C41'
const POINT_COLOUR = '#FDBF50'
const gameSpaceCanvas = document.querySelector<HTMLCanvasElement>('#game-space')
const gameSpaceCanvasContext = gameSpaceCanvas?.getContext('2d') as CanvasRenderingContext2D

const height = gameSpaceCanvas?.height || 0
const width = gameSpaceCanvas?.width || 0
const pixelSize = parseInt(gameSpaceCanvas?.dataset?.pixelSize as string)
const numberOfColums = width / pixelSize
const numberOfRows = height / pixelSize
let isFirstLoad = true

function renderTiles(gameSpaceCanvasContext: CanvasRenderingContext2D) {
    if(height % pixelSize !== 0 || width % pixelSize !== 0) throw new Error('Provide a valid pixel size')
    const getFillColour = (i: number, j: number) => {
        const condition = j % 2 === 0

        if(i % 2 === 0) return condition ? PRIMARY_COLOUR: SECONDARY_COLOUR 
        return condition ? SECONDARY_COLOUR : PRIMARY_COLOUR
    }

    for(let i = 0; i <= numberOfRows; i++) {
        // Draw colums
        for(let j = 0; j <= numberOfColums; j++) {
            const x = j * pixelSize
            const y = i * pixelSize
            const fillColour = getFillColour(i, j)
            
            if(gameSpaceCanvasContext) {
                gameSpaceCanvasContext.fillStyle = fillColour
                gameSpaceCanvasContext.fillRect(x, y, pixelSize, pixelSize)
            }
        }
    }
}

class Player {
    private fillColour: string = PLAYER_COLOUR
    private pointManager: PointManager
    private gameSpaceCanvasContext: CanvasRenderingContext2D
    public x: number = 0
    public y: number = 0

    constructor(
        pointManager: PointManager, 
        gameSpaceCanvasContext: CanvasRenderingContext2D
    ) {
        this.pointManager = pointManager
        this.gameSpaceCanvasContext = gameSpaceCanvasContext
    }
    
    init() {
        const middleValue = ((numberOfColums - 1) / 2 ) 
        this.x = middleValue * pixelSize
        this.y = middleValue * pixelSize
    }
    
    render() {
        this.gameSpaceCanvasContext.fillStyle = this.fillColour
        this.gameSpaceCanvasContext.fillRect(this.x, this.y, pixelSize, pixelSize)
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

class Point {
    private fillColour: string = POINT_COLOUR
    private gameSpaceCanvasContext: CanvasRenderingContext2D
    public x: number
    public y: number

    constructor(
        x:number, 
        y:number, 
        gameSpaceCanvasContext: CanvasRenderingContext2D
    ) {
        this.x = x
        this.y = y
        this.gameSpaceCanvasContext = gameSpaceCanvasContext
    }

    render() {
        this.gameSpaceCanvasContext.fillStyle = this.fillColour
        this.gameSpaceCanvasContext.fillRect(this.x, this.y, pixelSize, pixelSize)
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
    private gameSpaceCanvasContext: CanvasRenderingContext2D
    
    constructor(
        gameManager: GameManager, 
        gameSpaceCanvasContext: CanvasRenderingContext2D
    ) {
        this.gameManager = gameManager
        this.gameSpaceCanvasContext = gameSpaceCanvasContext
    }
    
    createRandomPoint() {
        const randomColumInRange = randomMultipleInRange(pixelSize, numberOfColums)
        const randomRowInRange = randomMultipleInRange(pixelSize, numberOfColums)

        const point = new Point(randomColumInRange, randomRowInRange, this.gameSpaceCanvasContext)
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
const pointManager = new PointManager(gameManager, gameSpaceCanvasContext)
const player = new Player(pointManager, gameSpaceCanvasContext)
new PlayerController(player)

// Bind reset button
document.querySelector('.restart-button')
    ?.addEventListener('click', () => (isFirstLoad = true))

let framesRendered: number = 0
const FRAMES_UNTIL_POINT = 15
function main() {
    ++framesRendered
    gameSpaceCanvasContext.beginPath()

    if(isFirstLoad) {
        pointManager.init()
        player.init()
        gameManager.init()
        isFirstLoad = false
    }

    renderTiles(gameSpaceCanvasContext)

    if(framesRendered % FRAMES_UNTIL_POINT === 0) {
        pointManager.createRandomPoint()
    }

    pointManager.render()
    player.render()
    gameSpaceCanvasContext.closePath()
    
}
setInterval(main, 60)