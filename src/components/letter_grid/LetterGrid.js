function LetterGrid({ puzzle, words, goBack }) {
  return (
    <div id="LetterGrid">
      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          ← Back
        </button>
        <button className="print-button" onClick={window.print}>
          Print
        </button>
      </div>
      <table>
        <tbody>
          {puzzle.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((letter, j) => {
                  return <td key={`${i}-${j}`}>{letter}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="word-bank">
        <ul>
          {words.map((word) => {
            return <li key={word}>{word}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default LetterGrid;
