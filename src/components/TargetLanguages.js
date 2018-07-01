import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import TranslatedResult from './TranslatedResult';

export default class TargetLanguages extends React.Component {

  getItemStyle = (isDragging, draggableStyle) => ({
    width: '80vw',
    margin: 'auto auto 2rem auto',
    ...draggableStyle
  });

  render() {
    return (
      <Droppable droppableId="target-languages">
        {(provided, snapshot) => (
          <div
            className="target-languages"
            ref={provided.innerRef}
          >
            {this.props.selectedLangs.map((lang, index) => (
              <Draggable key={lang.key} draggableId={lang.key} index={index}>
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
                      key={lang.key}
                      lang={lang.name}
                      value={lang.value}
                    />
                  </div>
                )}
              </Draggable>
            )
            )}
          </div>
        )}
      </Droppable>
    );
  }
}
