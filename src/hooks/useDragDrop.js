// src/hooks/useDragDrop.js

import { useState } from 'react';

const useDragDrop = (initialData) => {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination,type } = result;


        if (type === 'column') {
            const lists = [...data];
            const [movedList] = lists.splice(source.index, 1);
            lists.splice(destination.index, 0, movedList);
            console.log("リストの移動");
            console.log(lists);            
            setData(lists);        
        }else if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
            const destinationColIndex = data.findIndex(
                (e) => e.id === destination.droppableId
            );

            const sourceCol = data[sourceColIndex];
            const destinationCol = data[destinationColIndex];

            const sourceCards = [...sourceCol.cards];
            const destinationCards = [...destinationCol.cards];

            const [removed] = sourceCards.splice(source.index, 1);
            destinationCards.splice(destination.index, 0, removed);

            const newData = [...data];
            newData[sourceColIndex].cards = sourceCards;
            newData[destinationColIndex].cards = destinationCards;
            console.log("同一リスト間の移動");
            console.log(newData);            
            
            setData(newData);
        } else {
            const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
            const sourceCol = data[sourceColIndex];
            const sourceCards = [...sourceCol.cards];
            const [removed] = sourceCards.splice(source.index, 1);
            sourceCards.splice(destination.index, 0, removed);

            const newData = [...data];
            newData[sourceColIndex].cards = sourceCards;
            console.log("同一リスト間の移動");
            console.log(newData);            
            setData(newData);
        }
    };

    return { data, onDragEnd, setData };
};

export default useDragDrop;
