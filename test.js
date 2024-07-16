function readLinesToArray(_input) {
    let array = _input.split("\n");
    let testCases = parseInt(array[0]);
    let result = [];

    for (let i = 1; i <= testCases; i++) {
        let line = array[i].trim();
        let rank = calculateRank(line);
        result.push(rank);
    }

    return result.join("\n");
}

function calculateRank(_line) {
    let rank = 25;
    let stars = 0;
    let consecutiveWins = 0;

    const starsNeeded = {
        25: 2, 24: 2, 23: 2, 22: 2, 21: 2,
        20: 3, 19: 3, 18: 3, 17: 3, 16: 3,
        15: 4, 14: 4, 13: 4, 12: 4, 11: 4,
        10: 5, 9: 5, 8: 5, 7: 5, 6: 5,
        5: 5, 4: 5, 3: 5, 2: 5, 1: 5
    };

    let duels = _line.split('');
    let duelLength = duels.length;

    for (let i = 0; i < duelLength; i++) {
        if (duels[i] == 'W') {
            stars++;
            consecutiveWins++;
            if (rank >= 6 && rank <= 25 && consecutiveWins >= 3) {
                stars++;
            }
        } else if (duels[i] == 'L') {
            if (rank > 20) {
                stars = Math.max(0, stars - 1);
            } else if (rank <= 20) {
                stars--;
            }
            consecutiveWins = 0;
        }

        while (stars >= starsNeeded[rank] && rank > 1) {
            stars -= starsNeeded[rank];
            rank--;
        }

        if (rank === 1 && stars >= starsNeeded[1]) {
            return "Archmage";
        }
    }

    return rank;
}

const input = `10
WWWWWWWWWWWWWWWWWWWLWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWLWWWWWWWWWWWWWWLWWWWWWW
WWWWWWLWWWWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWLWWWWWWWWWWWWWLWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWLWWWWWWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWW
WLWWWWWWWWWLLWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWLWWWWWWWWW
WWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWLWWWWWWWWWWLWLWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWLWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWLWWWWWWWWWWWLWWWWWWLWWLWWWWW
WWWWWWWWWWLWWWWWWWWWWWWLWWWWWWWWWWW
WWWWWWWWWWLWWWWWWWWWWWWWWWWWWWWWWWWWWWW`;

console.log(readLinesToArray(input));
