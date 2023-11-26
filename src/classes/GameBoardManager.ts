
export default class GameBoardManager {
    private static instance: GameBoardManager
    public readonly canvasElement: HTMLCanvasElement
    public readonly canvasContext: CanvasRenderingContext2D
    public readonly height: number
    public readonly width: number
    public readonly pixelSize: number
    public readonly numberOfColums: number
    public readonly numberOfRows: number
    

    private constructor() { 
        this.canvasElement = document.querySelector<HTMLCanvasElement>('#game-space') as HTMLCanvasElement
        this.canvasContext = this.canvasElement?.getContext('2d') as CanvasRenderingContext2D
        this.height = this.canvasElement?.height || 0
        this.width = this.canvasElement?.width || 0
        this.pixelSize = parseInt(this.canvasElement?.dataset?.pixelSize as string)
        this.numberOfColums = this.width / this.pixelSize
        this.numberOfRows = this.height / this.pixelSize
    }

    public static getInstance(): GameBoardManager {
        if(!GameBoardManager.instance) {
            GameBoardManager.instance = new GameBoardManager()
        }

        return GameBoardManager.instance
    }
}