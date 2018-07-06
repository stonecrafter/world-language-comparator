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
          <h4 className="header__title">Nordic Language Comparator</h4>
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
            <p>An interactive illustration of the similarites and differences between the five major languages of the Nordic region.</p>

            <p>Automatic translations are powered by <a href="http://translate.yandex.com/">Yandex.Translate</a>.
            There are more than five officially recognised languages, but they are not supported by the translation service.
            Click <a href="https://www.norden.org/en/fakta-om-norden-1/nordic-dictionaries">here</a> to learn more.</p>
          </div>
        </Modal>
      </header>
    );
  }
}
