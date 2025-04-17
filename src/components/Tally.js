import React from 'react';

function Tally({ results }) {
  return (
    <div className="tally-column">
      <h2>Vote Tallies</h2>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.name}: {result.votes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tally;
