import React, { useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Lists from './Lists';
import AppContext from '../contexts/AppContext';
import Loading from './Loading';

const Board = () => {
    const {
        data,
        onDragEnd,
        loading,
        cardTitle,
        cardType,
    } = useContext(AppContext);

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" type="column" direction="horizontal" className="flex flex-wrap -mx-2"
                >
                    {(provided) => (
                        <div
                            className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {data.map((list, index) => (
                                <Lists
                                    key={list.id}
                                    list={list}
                                    data={data}
                                    index={index}
                                    cardTitle={cardTitle}
                                    cardType={cardType}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {loading && <Loading/>}
        </div>
    );
};

export default Board;
