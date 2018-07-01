import React from 'react';
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
        <TargetLanguages
          selectedLangs={this.state.selectedLangs}
        />
        <Footer />
      </div>
    );
  }
};