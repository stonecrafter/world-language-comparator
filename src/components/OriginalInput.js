import React from 'react';
import Select, { components } from 'react-select'
import _ from 'lodash';

// Input renderer for the display of the selected dropdown value
// Not sure if this is the best place to put it, but it's not intended
// to be reused outside of this component so it will stay here for now
const OriginalInputSelectedRenderer = ({ ...props }) => (
  <components.SingleValue {...props}>
    {props.data.key.toUpperCase()}
  </components.SingleValue>
);

export default class OriginalInput extends React.Component {
  state = {
    error: undefined,
    inputValue: ''
  }

  /**
   * Handler for when the submit button is pressed
   * Prevent button from default submitting the page
   * Grab the value to translate from state
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    const query = this.state.inputValue;
    // Only submit if the input value is not an empty string
    if (query) {
      const error = await this.props.handleOriginalQuery(query);
      this.setState(() => ({ error }));
    }
  }

  /**
   * Update state when input value is being changed
   */
  onInputValueChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  /**
   * Used by the select component to determine the currently selected value
   * Not sure why it does not work on its own, but this will fix it
   */
  isOptionSelected = (option, value) => {
    return _.isEqual(option, _.first(value));
  }

  render() {
    const { originalLang } = this.props;

    return (
      <form className="original-input" onSubmit={this.handleSubmit}>
        <div className="original-input__container">
          <Select
            classNamePrefix="origin-select"
            components={{ SingleValue: OriginalInputSelectedRenderer }}
            options={this.props.availableLangs}
            getOptionLabel={(option) => option.name}
            onChange={this.props.changeOriginalLang}
            value={originalLang}
            isOptionSelected={this.isOptionSelected}
          />
          <input
            className="original-input__input no-left-border"
            type="text"
            name="originalQuery"
            placeholder={`Enter ${originalLang.name} text`}
            autoComplete="off"
            onChange={this.onInputValueChange}
          />
        </div>
        <button
          ref={c => this.submitButton = c}
          onClick={() => this.submitButton.blur()}
          className="original-input__button bdr-radius-sm"
          disabled={this.props.loading}
        >Translate</button>
      </form>
    );
  }
}
