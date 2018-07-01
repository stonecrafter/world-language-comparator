import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Loader } from 'react-overlay-loader';

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
    selectedLangs: [
      {
        key: 'no',
        name: 'Norwegian'
      },
      {
        key: 'da',
        name: 'Danish'
      },
      {
        key: 'sv',
        name: 'Swedish'
      },
      {
        key: 'is',
        name: 'Icelandic'
      },
      {
        key: 'fi',
        name: 'Finnish'
      }
    ]
  }

  async componentDidMount() {
    // Get list of available languages
    const availableLangs = await getSupportedLangs();
    this.setState((prevState) => ({
      availableLangs,
      loading: false
    }));
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

    this.setState((prevState) => ({ selectedLangs: orderedItems }));
  }

  handleEngQuery = async (query) => {
    if (!this.state.loading) {
      this.setState((prevState) => ({ loading: true }));
      const res = await getTranslations(query, this.state.selectedLangs);
      this.setState((prevState) => ({
        loading: false,
        selectedLangs: res
      }));
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
          />
        </DragDropContext>
        <Footer />
      </div>
    );
  }
};