import WordTag from "../word_tag/WordTag";

function WordTagContainer({ words, removeWord, maxNumWords, resetPuzzle }) {
  const wordsLength = words.length;

  return (
    <div id="WordTagContainer">
      <p className='puzzle-reset' onClick={resetPuzzle}>-reset puzzle-</p>
      <p
        className={`word-counter `}
      >{`${wordsLength} / ${maxNumWords} words`}</p>
      {words.map((word, i) => {
        return <WordTag key={i} word={word} removeWord={() => removeWord(i)} />;
      })}
    </div>
  );
}

export default WordTagContainer;
