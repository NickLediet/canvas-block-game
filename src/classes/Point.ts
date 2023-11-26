import { POINT_COLOUR } from '../constants/index'
import GameBoardManager from './GameBoardManager'

const { pixelSize } = GameBoardManager.getInstance()

export default class Point {
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