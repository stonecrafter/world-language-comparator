import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Loader } from 'react-overlay-loader';
import _ from 'lodash';

import 'react-overlay-loader/styles.css';

import Header from './Header';
import Footer from './Footer';
import EnglishInput from './EnglishInput';
import TargetLanguages from './TargetLanguages';
import { getTranslations, getSupportedLangs } from './helpers/requestHelpers';

export default class LangCompareApp extends React.Component {
  state = {
    loading: true,
    availableLangs: [],
    selectedLangs: []
  }

  async componentDidMount() {
    // Get list of available languages
    const availableLangs = await getSupportedLangs();
    this.setState({ availableLangs, loading: false });
  }

  /**
   * Method required by react-beautiful-dnd
   * https://github.com/atlassian/react-beautiful-dnd#ondragend-required
   * @param {*} result
   */
  onDragEnd = (result) => {
    // Dropped outside the list, do nothing
    if (!result.destination) {
      return;
    }

    // Reorder items and persist it to state
    const orderedItems = Array.from(this.state.selectedLangs);
    const [removed] = orderedItems.splice(result.source.index, 1);
    orderedItems.splice(result.destination.index, 0, removed);

    this.setState({ selectedLangs: orderedItems });
  }

  /**
   * Handle clicking the 'translate' button
   */
  handleEngQuery = async (query) => {
    if (!this.state.loading) {
      this.setState((prevState) => ({ loading: true }));
      const res = await getTranslations(query, this.state.selectedLangs);
      this.setState({ loading: false, selectedLangs: res });
    }
  }

  /**
   * Handle user adding a target language
   * Add the language to the selected list, and disable it in the available list
   */
  handleAddLang = (newLang) => {
    if (newLang && !_.isEmpty(newLang)) {
      const availableLangsCopy = [...this.state.availableLangs];
      const index = _.findIndex(availableLangsCopy, { key: newLang.key });
      availableLangsCopy[index].isDisabled = true;
      this.setState((prevState) => ({
        selectedLangs: [newLang, ...prevState.selectedLangs],
        availableLangs: availableLangsCopy
      }));
    }
  }

  /**
   * Handle user removing a target language
   * Remove the language from the selected list and add it back to the available list
   */
  handleRemoveLang = (lang) => {
    if (lang) {
      const selectedLangsCopy = [...this.state.selectedLangs];
      selectedLangsCopy.splice(selectedLangsCopy.indexOf(lang), 1);

      const availableLangsCopy = [...this.state.availableLangs];
      const index = _.findIndex(availableLangsCopy, { key: lang.key });
      availableLangsCopy[index].isDisabled = false;
      this.setState({ selectedLangs: selectedLangsCopy, availableLangs: availableLangsCopy });
    }
  }

  render() {
    return (
      <div className="app">
        <Loader fullPage loading={this.state.loading} text={'Just a minute!'} />
        <Header />
        <div className="app__title-area">
          <h1 className="app__title">Compare Nordic Languages</h1>
          <EnglishInput
            handleEngQuery={this.handleEngQuery}
            loading={this.state.loading}
          />
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <TargetLanguages
            selectedLangs={this.state.selectedLangs}
            availableLangs={this.state.availableLangs}
            handleAddLang={this.handleAddLang}
            handleRemoveLang={this.handleRemoveLang}
          />
        </DragDropContext>
        <Footer />
      </div>
    );
  }
};