import GameBoardManager from './GameBoardManager'
import Player from './Player'

const {
    height,
    width,
    pixelSize
} = GameBoardManager.getInstance()

export default class PlayerController {
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