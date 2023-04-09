import { useState } from "react";
import Description from "../description/Description";
import SearchWordInputForm from "../search_word_input_form/SearchWordInputForm";
import WordTagContainer from "../word_tag_container/WordTagContainer";
import PuzzleBuilder from "../../helpers/PuzzleBuilder";
import LetterGrid from "../letter_grid/LetterGrid";

function WordSearch() {
  const [inputWord, setInputWord] = useState("");
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [creatingPuzzleLoader, setCreatingPuzzleLoader] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzle, setPuzzle] = useState(null);

  const MIN_LENGTH = 3;
  const MAX_LENGTH = 15;
  const MAX_NUM_WORDS = 25;

  const throwError = (text) => {
    setError(text);
    setTimeout(() => {
      setError(null);
    }, 4000);
  };

  const onWordChange = (event) => {
    setInputWord(event.target.value);
  };

  const resetPuzzle = () => {
    if (puzzle) {
      setPuzzle(null);
    }
  };

  const addWord = (e) => {
    e.preventDefault();

    if (!inputWord) {
      return false;
    }
    if (words.length === MAX_NUM_WORDS) {
      return throwError(`Your word bank is full!`);
    }
    if (inputWord.length < MIN_LENGTH) {
      return throwError(`Words needs to be at least ${MIN_LENGTH} letters!`);
    }
    if (inputWord.length > MAX_LENGTH) {
      return throwError(`Words can only be ${MAX_LENGTH} letters long!`);
    }
    if (words.includes(inputWord)) {
      return throwError("That word is already on the list!");
    }
    if (!/^[A-Za-z]*$/.test(inputWord)) {
      return throwError("Only letters are allowed in your word. No spaces.");
    }

    resetPuzzle();

    const newWords = [...words, inputWord];
    setWords(newWords);
    setInputWord("");
  };

  const removeWordAtIndex = (idx) => {
    resetPuzzle();
    let wordCopy = [...words];
    wordCopy.splice(idx, 1);
    setWords(wordCopy);
  };

  const resetPuzzleAndWords = () => {
    resetPuzzle();
    setWords([]);
    document.getElementById("word-search-input").focus();
  };

  const startPuzzleCreate = () => {
    setCreatingPuzzleLoader(true);
    const puzzle = new PuzzleBuilder(words).createPuzzle();
    console.table(puzzle);
    setPuzzle(puzzle);
    setShowPuzzle(true);
    setCreatingPuzzleLoader(false);
  };

  if (error) {
    return (
      <div id="ErrorShow">
        <h3>{error}</h3>
        <button onClick={() => setError(null)}>Ok</button>
      </div>
    );
  }

  if (creatingPuzzleLoader) {
    return (
      <div id="Loader">
        <div className="circle">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  if (showPuzzle && puzzle) {
    return (
      <LetterGrid
        puzzle={puzzle}
        words={words}
        goBack={() => setShowPuzzle(false)}
      />
    );
  }

  return (
    <div id="WordSearch">
      <Description />
      <SearchWordInputForm
        word={inputWord}
        onWordChange={onWordChange}
        minLength={MIN_LENGTH}
        maxLength={MAX_LENGTH}
        addWord={addWord}
      />
      {words.length > 0 && (
        <>
          <WordTagContainer
            words={words}
            removeWord={removeWordAtIndex}
            resetPuzzle={resetPuzzleAndWords}
            maxNumWords={MAX_NUM_WORDS}
          />
          <button
            className="make-grid"
            onClick={puzzle ? () => setShowPuzzle(true) : startPuzzleCreate}
          >{`${puzzle ? "Show" : "Create"} Puzzle`}</button>
        </>
      )}
    </div>
  );
}

export default WordSearch;
