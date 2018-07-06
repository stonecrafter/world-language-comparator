import React from 'react';
import Select from 'react-select'

export default class TargetLangSelector extends React.Component {
  state = {
    selectedValue: null
  }

  /**
   * Reset the selected value then pass the selected language along
   */
  handleAddLang = (lang) => {
    this.setState({ selectedValue: null });
    this.props.handleAddLang(lang);
  }

  render () {
    return (
      <div className="target-lang-selector">
        {this.props.availableLangs.length > 0 && 
          <Select
            classNamePrefix="searchable-select"
            options={this.props.availableLangs}
            placeholder="Add a language"
            getOptionLabel={(option) => option.name}
            onChange={this.handleAddLang}
            value={this.state.selectedValue}
          />
        }
      </div>
    );
  }
}