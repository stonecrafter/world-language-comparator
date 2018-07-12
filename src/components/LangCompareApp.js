import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Loader } from 'react-overlay-loader';
import _ from 'lodash';

import 'react-overlay-loader/styles.css';

import CONSTANTS from './helpers/constants';
import Header from './Header';
import Footer from './Footer';
import OriginalInput from './OriginalInput';
import TargetLanguages from './TargetLanguages';
import { getTranslations, getSupportedLangs } from './helpers/requestHelpers';

export default class LangCompareApp extends React.Component {
  state = {
    loading: true,
    availableLangs: [],
    selectedLangs: [],
    originalLang: {
      key: '',
      name: ''
    }
  }

  async componentDidMount() {
    // Get list of available languages
    const availableLangs = await getSupportedLangs();

    // Set the initial state
    this.setState({ availableLangs, loading: false });

    // Initialise selected languages from local storage
    // A little awkward, should this be done before the above
    // to avoid multiple set state calls? But then we can't reuse the handleAddLang method
    this.selectLangsFromLocalStorage();
  }

  /**
   * Get language settings from local storage
   */
  selectLangsFromLocalStorage = (availableLangs) => {
    // Since items are added to the front of the array, in order to preserve order
    // for the user we have to reverse the stored array, and add the last item first
    // (then it will show up at the bottom of the list like the user expects)
    const storedKeys = _.reverse(JSON.parse(localStorage.getItem(CONSTANTS.TARGET_LANG_LOCAL_STORAGE_KEY)));
    if (storedKeys && storedKeys.length > 0) {
      for (const key of storedKeys) {
        // Find the display name of the selected language
        const { name } = _.find(this.state.availableLangs, { key });
        this.handleAddLang({ key, name, value: '' });
      }
    }

    // Set the original language, default to English if not found
    const originalLangKey = localStorage.getItem(CONSTANTS.ORIGINAL_LANG_LOCAL_STORAGE_KEY) || 'en';
    const originalLang = _.find(this.state.availableLangs, { key: originalLangKey });
    this.changeOriginalLang(originalLang)
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
  handleOriginalQuery = async (query) => {
    if (!this.state.loading) {
      this.setState((prevState) => ({ loading: true }));
      const res = await getTranslations(query, this.state.originalLang, this.state.selectedLangs);
      this.setState({ loading: false, selectedLangs: res });
    }
  }

  /**
   * Handle user adding a target language
   * Add the language to the selected list, and disable it in the available list
   */
  handleAddLang = async (newLang) => {
    if (newLang && !_.isEmpty(newLang)) {
      const availableLangsCopy = [...this.state.availableLangs];
      const index = _.findIndex(availableLangsCopy, { key: newLang.key });
      availableLangsCopy[index].isDisabled = true;
      await this.setState((prevState) => ({
        selectedLangs: [newLang, ...prevState.selectedLangs],
        availableLangs: availableLangsCopy
      }));

      // Add new language to local storage
      this.updateTargetLangLocalStorage();
    }
  }

  /**
   * Handle user removing a target language
   * Remove the language from the selected list and add it back to the available list
   */
  handleRemoveLang = async (lang) => {
    if (lang) {
      const selectedLangsCopy = [...this.state.selectedLangs];
      selectedLangsCopy.splice(selectedLangsCopy.indexOf(lang), 1);

      const availableLangsCopy = [...this.state.availableLangs];
      const index = _.findIndex(availableLangsCopy, { key: lang.key });
      availableLangsCopy[index].isDisabled = false;
      await this.setState({ selectedLangs: selectedLangsCopy, availableLangs: availableLangsCopy });

      // Remove the language from local storage
      this.updateTargetLangLocalStorage();
    }
  }

  /**
   * Change the selected original language
   */
  changeOriginalLang = (originalLang) => {
    if (originalLang && !_.isEmpty(originalLang)) {
      // The original language that was previously selected should be made available for selection again
      // if it exists (it will not exist upon first time app load)
      // and the language being selected at present should be made disabled
      const availableLangsCopy = [...this.state.availableLangs];
      const newLangIndex = _.findIndex(availableLangsCopy, { key: originalLang.key });
      availableLangsCopy[newLangIndex].isDisabled = true;

      const prevLangIndex = _.findIndex(availableLangsCopy, { key: this.state.originalLang.key });
      if (prevLangIndex > -1) {
        availableLangsCopy[prevLangIndex].isDisabled = false;
      }

      this.setState((prevState) => ({
        availableLangs: availableLangsCopy,
        originalLang
      }));

      // Save original language selection to local storage
      localStorage.setItem(CONSTANTS.ORIGINAL_LANG_LOCAL_STORAGE_KEY, originalLang.key);
    }
  }

  /**
   * Update target language list local storage based on current state
   */
  updateTargetLangLocalStorage = () => {
    const langKeyList = JSON.stringify(_.map(this.state.selectedLangs, 'key'));
    localStorage.setItem(CONSTANTS.TARGET_LANG_LOCAL_STORAGE_KEY, langKeyList);
  }

  render() {
    return (
      <div className="app">
        <Loader fullPage loading={this.state.loading} text={'Just a minute!'} />
        <Header />
        <div className="app__title-area">
          <h1 className="app__title">Compare World Languages</h1>
          <OriginalInput
            handleOriginalQuery={this.handleOriginalQuery}
            loading={this.state.loading}
            availableLangs={this.state.availableLangs}
            changeOriginalLang={this.changeOriginalLang}
            originalLang={this.state.originalLang}
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