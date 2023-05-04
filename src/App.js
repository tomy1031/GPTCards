// src/App.jsx

import React, { useState } from 'react';
import AppContext from './contexts/AppContext';
import Header from './components/Header';
import Board from './components/Board';
import initLists from './data/initLists';
import useDragDrop from './hooks/useDragDrop';
import MessageArea from './components/MessageArea';

const App = () => {
  const { data, onDragEnd, setData } = useDragDrop(initLists);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardType, setCardType] = useState('webアプリ');
  //GPTで追加するカード,リストの枚数
  const [listNum ,setListNum] = useState(3);
  const [cardNum ,setCardNum] = useState(3);
  

  return (
    <AppContext.Provider
      value={{
        data,
        onDragEnd,
        setData,
        error,
        setError,
        loading,
        setLoading,
        cardTitle,
        setCardTitle,
        cardType,
        setCardType,
        listNum,
        setListNum,
        cardNum,
        setCardNum
      }}
    >
      <Header/>
      <MessageArea/>
      <Board />
    </AppContext.Provider>
  );
};

export default App; 
