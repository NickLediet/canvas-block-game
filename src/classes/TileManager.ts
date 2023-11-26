import { PRIMARY_COLOUR, SECONDARY_COLOUR } from '../constants/index'
import GameBoardManager from './GameBoardManager'

const {
    height,
    width,
    pixelSize,
    numberOfColums,
    numberOfRows,
    canvasContext
} = GameBoardManager.getInstance()

export default class TileManager {
    private static instance: TileManager

    public static getInstance(): TileManager {
        if(!TileManager.instance) {
            TileManager.instance = new TileManager()
        }

        return TileManager.instance
    }

    render() {
        if(height % pixelSize !== 0 || width % pixelSize !== 0) throw new Error('Provide a valid pixel size')
        const getFillColour = (i: number, j: number) => {
            const condition = j % 2 === 0
    
            if(i % 2 === 0) return condition ? PRIMARY_COLOUR: SECONDARY_COLOUR 
            return condition ? SECONDARY_COLOUR : PRIMARY_COLOUR
        }
    
        for(let i = 0; i <= numberOfRows; i++) {
            for(let j = 0; j <= numberOfColums; j++) {
                const x = j * pixelSize
                const y = i * pixelSize
                const fillColour = getFillColour(i, j)
                
                if(canvasContext) {
                    canvasContext.fillStyle = fillColour
                    canvasContext.fillRect(x, y, pixelSize, pixelSize)
                }
            }
        }
    }
}