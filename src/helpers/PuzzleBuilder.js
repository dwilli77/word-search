class PuzzleBuilder {
  constructor(words, gridSize = 15) {
    this.words = words;
    this.gridSize = gridSize;
  }

  createPuzzle() {
    const lettersOf = this.makeLettersOf(this.words);
    let results = false;
    do {
      this.grid = this.makeGrid(this.gridSize)
      results = this.placeWords(
        this.grid,
        this.gridSize,
        this.words,
        lettersOf
      );
      this.gridSize++;
    } while (!results);
    const filledGrid = this.fillGrid(this.grid);
    return filledGrid;
  }

  makeGrid(gridSize) {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        grid[i][j] = "";
      }
    }
    return grid;
  }

  makeLettersOf(words) {
    const lettersOf = words.reduce((lettersOf, word) => {
      lettersOf[word] = Array.from(word);
      return lettersOf;
    }, {});
    return lettersOf;
  }

  horizontal([row, col], i) {
    return [row, col + i];
  }

  vertical([row, col], i) {
    return [row + i, col];
  }

  diagonal([row, col], i) {
    return [row + i, col + i];
  }

  mirrorDiagonal([row, col], i) {
    return [row + i, col - i];
  }

  fitsHorizontal(gridSize, startColumn, wordLength) {
    return gridSize - startColumn >= wordLength;
  }

  fitsVertical(gridSize, startRow, wordLength) {
    return gridSize - startRow >= wordLength;
  }

  fitsDiagonal(gridSize, startRow, startColumn, wordLength) {
    return (
      this.fitsHorizontal(gridSize, startColumn, wordLength) &&
      this.fitsVertical(gridSize, startRow, wordLength)
    );
  }

  fitsMirrorDiagonal(gridSize, startRow, startColumn, wordLength) {
    return (
      this.fitsVertical(gridSize, startRow, wordLength) &&
      startColumn - wordLength >= 0
    );
  }

  letterCanExistAtPosition(grid, position, letter) {
    const [row, col] = position;
    return new RegExp(`^${letter}?$`).test(grid[row][col]);
  }

  insertWordIntoGrid(grid, positions, word, lettersOf) {
    const letters = lettersOf[word];
    letters.forEach((letter, i) => {
      const [row, col] = positions[i];
      grid[row][col] = letter.toUpperCase();
    });
  }

  mapPositionsForWords(grid, gridSize, startPosition, word, lettersOf) {
    const [row, col] = startPosition;
    const indexToPosition = this.findPlacement(gridSize, row, col, word.length);
    if (typeof indexToPosition === "function") {
      const letters = lettersOf[word];
      const positions = letters.reduce((positions, letter, i) => {
        if (positions) {
          const position = indexToPosition(startPosition, i);
          if (this.letterCanExistAtPosition(grid, position, letter)) {
            return positions.concat([position]);
          }
        }
        return false;
      }, []);
      return positions;
    }
    return false;
  }

  findPlacement(gridSize, row, col, wordLength) {
    const shuffledArray = this.shuffleArray([1,2,3,4]);
    // run these in a random order
    const functionsToCall = {
      1: {
        fn: () => this.fitsHorizontal(gridSize, col, wordLength),
        returnFn: this.horizontal,
      },
      2: {
        fn: () => this.fitsVertical(gridSize, row, wordLength),
        returnFn: this.vertical,
      },
      3: {
        fn: () => this.fitsDiagonal(gridSize, row, col, wordLength),
        returnFn: this.diagonal,
      },
      4: {
        fn: () => this.fitsMirrorDiagonal(gridSize, row, col, wordLength),
        returnFn: this.mirrorDiagonal,
      },
    }
    for (let i = 0; i < shuffledArray.length; i++) {
      if (functionsToCall[shuffledArray[i]].fn()) {
        return functionsToCall[shuffledArray[i]].returnFn
      }
    }
  }

  shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
    }
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    return array;
  }

  placeWords(grid, gridSize, words, lettersOf) {
    const maxAttempts = gridSize * gridSize;
    for (const word of words) {
      let attempts = 0;
      while (attempts < maxAttempts) {
        const row = this.random(0, gridSize - 1);
        const col = this.random(0, gridSize - 1);
        const startPosition = [row, col];
        const positions = this.mapPositionsForWords(
          grid,
          gridSize,
          startPosition,
          word,
          lettersOf
        );

        if (positions) {
          this.insertWordIntoGrid(grid, positions, word, lettersOf);
          break;
        }
        attempts++;
      }
      if (attempts === maxAttempts) {
        return false;
      }
    }
    return grid;
  }

  fillGrid(grid) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const filledGrid = grid.map((row) =>
      row.map((l) =>
        l === "" ? possible[this.random(0, possible.length - 1)] : l
      )
    );
    return filledGrid;
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default PuzzleBuilder;
