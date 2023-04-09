function SearchWordInputForm({ word, onWordChange, addWord, minLength, maxLength }) {
  const outOfBounds = () => {
    const wordLength = word.length;
    return wordLength < minLength || wordLength > maxLength;
  }

  return (
    <div id="SearchWordInputForm">
      <p className={`num-counter ${outOfBounds() ? 'red' : ''}`}>{`${word.length} / ${maxLength} letters`}</p>
      <form onSubmit={addWord}>
        <input id='word-search-input' value={word} onChange={onWordChange} placeholder="Enter a word" />
        <input type='submit' value='Add' />
      </form>
    </div>
  );
}

export default SearchWordInputForm;
