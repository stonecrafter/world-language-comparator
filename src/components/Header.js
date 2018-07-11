import React from 'react';
import Modal from 'react-modal';
import FaClose from 'react-icons/lib/fa/close';

Modal.setAppElement('#LangCompareApp')

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
    this.btn.blur();
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <header className="header">
        <div className="header__items">
          <h4 className="header__title">World Language Comparator</h4>
          <button
            ref={c => this.btn = c}
            className="header__about"
            onClick={this.handleOpenModal}
          >
          About
        </button>
        </div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="About This Project"
          closeTimeoutMS={200}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          className="modal"
        >
          <div className="modal__close">
            <button className="btn-close" onClick={this.handleCloseModal}><FaClose /></button>
          </div>
          <h1 className="modal__title">About</h1>
          <div className="modal__body">
            <p>
              Learning multiple languages at once? Or just curious about how similar or different certain languages are?
              Tired of switching between tabs on machine translation service sites? Here, you can translate a piece of text
              to several target languages in one go, as well as drag and drop the order of language blocks for ease of comparison.
            </p>

            <p>Automatic translations are powered by <a href="http://translate.yandex.com/">Yandex.Translate</a>.
            All languages supported by the translation service are available here.</p>

            <p>This concept grew out of the Nordic Language Comparator, <a href="https://stonecrafter.github.io/nordic-language-comparator/">which you can find here.</a></p>
          </div>
        </Modal>
      </header>
    );
  }
}
