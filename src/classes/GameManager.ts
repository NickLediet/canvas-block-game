export default class GameManager {
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