import { PLAYER_COLOUR } from '../constants/index'
import GameBoardManager from './GameBoardManager'
import PointManager from './PointManager'

const {
    height,
    width,
    pixelSize,
    numberOfColums,
    numberOfRows,
    canvasContext
} = GameBoardManager.getInstance()

export default class Player {
    private fillColour: string = PLAYER_COLOUR
    private pointManager: PointManager
    public x: number = 0
    public y: number = 0

    constructor(
        pointManager: PointManager, 
    ) {
        this.pointManager = pointManager
    }
    
    init() {
        const middleValue = ((numberOfColums - 1) / 2 ) 
        this.x = middleValue * pixelSize
        this.y = middleValue * pixelSize
    }
    
    render() {
        canvasContext.fillStyle = this.fillColour
        canvasContext.fillRect(this.x, this.y, pixelSize, pixelSize)
        this.pointManager.tryToScore(this.x, this.y)
    }
}