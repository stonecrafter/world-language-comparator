import React from 'react';
import TranslatedResult from './TranslatedResult';

export default class TargetLanguages extends React.Component {

  render() {
    return (
      <div className="target-languages">
        {this.props.selectedLangs.map(lang => 
          <TranslatedResult
            key={lang.key}
            lang={lang.name}
            value={lang.value}
          />
        )}
      </div>
    );
  }
}
