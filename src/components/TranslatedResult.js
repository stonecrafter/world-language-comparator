import React from 'react';

const TranslatedResult = (props) => (
  <div className="translated-result">
    <h4 className="translated-result__lang">{props.lang}</h4>
    <div className="translated-result__translated">
      {props.value}
    </div>
  </div>
);

export default TranslatedResult;