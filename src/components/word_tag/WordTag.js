function WordTag({ word, removeWord }) {
  return (
    <div id="WordTag">
      <p>{word}</p>
      <p className="remove-button" onClick={removeWord}>
        x
      </p>
    </div>
  );
}

export default WordTag;
