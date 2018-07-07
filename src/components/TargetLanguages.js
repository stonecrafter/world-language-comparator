import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CSSTransitionGroup } from 'react-transition-group'

import TranslatedResult from './TranslatedResult';
import TargetLangSelector from './TargetLangSelector';

export default class TargetLanguages extends React.Component {
  state = {
    dragEnabled: true
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    width: '80vw',
    margin: 'auto auto 2rem auto',
    ...draggableStyle
  });

  /**
   * Conditionally enable drag and drop depending on mouse or touch position
   * Need to do this to enable copy / paste and selection of text
   */
  toggleDrag = (drag) => {
    if (drag !== this.state.dragEnabled) {
      this.setState({ dragEnabled: drag });
    }
  }

  render() {
    return (
      <Droppable droppableId="target-languages">
        {(provided, snapshot) => (
          <div
            className="target-languages"
            ref={provided.innerRef}
          >
            <TargetLangSelector
              availableLangs={this.props.availableLangs}
              handleAddLang={this.props.handleAddLang}
            />
            <CSSTransitionGroup
              transitionName="target-languages--change"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              {this.props.selectedLangs.map((lang, index) => (
                <Draggable key={lang.key} draggableId={lang.key} index={index} isDragDisabled={!this.state.dragEnabled}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={this.getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <TranslatedResult
                        langObject={lang}
                        handleRemoveLang={this.props.handleRemoveLang}
                        toggleDrag={this.toggleDrag}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </CSSTransitionGroup>
          </div>
        )}
      </Droppable>
    );
  }
}
