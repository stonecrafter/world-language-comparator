import React from 'react';
import FaClose from 'react-icons/lib/fa/close';

export default class TranslatedResult extends React.Component {

  handleRemoveLang = () => {
    this.props.handleRemoveLang(this.props.langObject);
  }

  render() {
    return (
      <div className="translated-result">
        <div className="translated-result__header">
          <h4
            className="translated-result__lang"
            // Ugh.... there's got to be a better way to do this
            onMouseEnter={() => this.props.toggleDrag(false)} onTouchStart={() => this.props.toggleDrag(false)}
            onMouseLeave={() => this.props.toggleDrag(true)} onTouchEnd={() => this.props.toggleDrag(true)} onTouchCancel={() => this.props.toggleDrag(true)}
          >
            {this.props.langObject.name}
          </h4>
          <button className="btn-close" onClick={this.handleRemoveLang}><FaClose /></button>
        </div>
        <div
          className="translated-result__translated"
          onMouseEnter={() => this.props.toggleDrag(false)} onTouchStart={() => this.props.toggleDrag(false)}
          onMouseLeave={() => this.props.toggleDrag(true)} onTouchEnd={() => this.props.toggleDrag(true)} onTouchCancel={() => this.props.toggleDrag(true)}
        >
          {this.props.langObject.value}
        </div>
      </div>
    );
  }
};