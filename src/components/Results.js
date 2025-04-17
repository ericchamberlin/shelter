import React from 'react';

function Results({ results }) {
  return (
    <div>
      <h2>Results</h2>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.name}: {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Results;
