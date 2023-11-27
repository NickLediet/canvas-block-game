import { randomMultipleInRange } from '../util/index'
import Point from './Point'
import GameBoardManager from './GameBoardManager'
import GameManager from './GameManager'

const {
    pixelSize,
    numberOfColums,
    canvasContext
} = GameBoardManager.getInstance()

interface PointsDictionary {
    [key: string]: Point
}

export default class PointManager {
    private timeToLive: number = 3000
    private points: PointsDictionary = {}
    private gameManager: GameManager
    
    constructor(
        gameManager: GameManager, 
    ) {
        this.gameManager = gameManager
    }
    
    createRandomPoint() {
        const randomColumInRange = randomMultipleInRange(pixelSize, numberOfColums)
        const randomRowInRange = randomMultipleInRange(pixelSize, numberOfColums)

        const point = new Point(randomColumInRange, randomRowInRange, canvasContext)
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
