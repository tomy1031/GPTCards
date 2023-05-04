// ReactとReact Beautiful DnDのコンポーネントをインポート
import React, { useRef, useContext} from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useGPTAddCards } from '../hooks/gptHooks';
import Card from './Card';
import AppContext from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
// import Loading from './Loading';

// Listsコンポーネント
const Lists = ({ list, index }) => {
    // リストのローディング
    // const [listLoading, setListLoading] = useState([]);
    // リスト名のRefを作成
    const listNameRef = useRef(null);
    const { data, setData, cardTitle, cardType, setLoading } = useContext(AppContext);

    // GPT提案のカード追加
    const useAddCard = async () => {
        // const newListLoading = [...listLoading]
        // newListLoading[index] = true;
        // setListLoading(newListLoading);
        setLoading(true)
        const newData = await useGPTAddCards(cardTitle, cardType, list, data, index);
        setData(newData);
        // newListLoading[index] = false;
        // setListLoading(newListLoading);
        setLoading(false);
    };

    // リストを削除する関数
    const handleRemoveList = () => {
        const newData = data.filter(listData => listData.id !== list.id);
        setData(newData);
    };


    // リスト名の編集
    const handleListNameBlur = () => {
        // 新しいリスト名を取得
        const newListName = listNameRef.current.textContent;
        // dataのリスト名を更新
        const newData = data.map(listData => {
            if (listData.id === list.id) {
                return { ...listData, listName: newListName };
            }
            return listData;
        });
        setData(newData);
    };

    // カードのタイトルの変更
    const handleTitleChange = (cardId, newTitle) => {
        // 新しいタイトルでカードを更新
        const updatedData = data.map((list) => {
            const newCards = list.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
            );
            return { ...list, cards: newCards };
        });
        setData(updatedData);
    };

    // カードの説明の変更
    const handleDescriptionChange = (cardId, newDescription) => {
        // 新しい説明でカードを更新
        const updatedData = data.map((list) => {
            const newCards = list.cards.map((card) =>
                card.id === cardId ? { ...card, description: newDescription } : card
            );
            return { ...list, cards: newCards };
        });
        setData(updatedData);
    };

    // カードの削除
    const handleDeleteCard = (cardId) => {
        // カードを削除した新しいデータを作成
        const updatedData = data.map((listData) => {
            const newCards = listData.cards.filter((card) => card.id !== cardId);
            return { ...listData, cards: newCards };
        });

        // 新しいデータでstateを更新
        setData(updatedData);
    };

    const handleAddCard = () => {
        // 新しいカードの情報を作成
        const newCard = {
            id: uuidv4(),
            title: 'タイトル',
            description: `・説明1
・説明2`,
        };

        // カードを追加するリストのindexを見つける
        const listIndex = data.findIndex((listData) => listData.id === list.id);

        // データを更新して、新しいカードを追加
        const newData = [...data];
        newData[listIndex].cards.push(newCard);
        setData(newData);
    };


    // JSXの戻り値
    return (

        // リストをDraggableコンポーネントでラップ
        <Draggable draggableId={list.id} index={index}>
            {(provided) => (
                // リストを表示
                <div
                    className="relative bg-gradient-to-r from-gray-300 to-gray-200 p-4 rounded-sm shadow-lg w-full"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    {/* リスト内のカードをDroppableコンポーネントでラップ */}
                    <Droppable droppableId={list.id}>
                        {(dropProvided) => (
                            <div

                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                            >
                                {/* リスト名と新しいカードを追加するボタン */}
                                <div className="text-base font-bold mb-4 flex justify-between items-start" {...provided.dragHandleProps}>
                                    <span
                                        ref={listNameRef}
                                        contentEditable
                                        onBlur={handleListNameBlur}
                                        suppressContentEditableWarning={true}
                                    >
                                        {list.listName}
                                    </span>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={useAddCard}
                                            className="w-7 h-7 p-1 rounded-sm bg-purple-400 text-white text-xs font-bold flex items-center justify-center"
                                        >
                                            ⚡
                                        </button>
                                        <button
                                            onClick={handleAddCard}
                                            className="w-7 h-7 p-1 rounded-sm bg-blue-400 text-white text-xs font-bold flex items-center justify-center hover:bg-blue-500 focus:outline-none"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={handleRemoveList}
                                            className="w-7 h-7 p-1 rounded-sm bg-red-400 text-white text-xs font-bold flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                {/* リスト内のカードを表示 */}
                                <div>
                                    {list.cards.map((card, cardIndex) => (
                                        // カードをDraggableコンポーネントでラップ
                                        <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                                            {(cardProvided, snapshot) => (
                                                // カードを表示
                                                <div
                                                    ref={cardProvided.innerRef}
                                                    {...cardProvided.draggableProps}
                                                    {...cardProvided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? 'opacity-50' : 'opacity-100'
                                                        }`}
                                                >
                                                    <Card
                                                        title={card.title}
                                                        description={card.description}
                                                        onTitleChange={(newTitle) => handleTitleChange(card.id, newTitle)}
                                                        onDescriptionChange={(newDescription) =>
                                                            handleDescriptionChange(card.id, newDescription)
                                                        }
                                                        onDelete={() => handleDeleteCard(card.id)} // onDeleteプロパティを追加
                                                    />
                                                </div>
                                            )}

                                        </Draggable>

                                    ))}
                                    {dropProvided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                    {/* {listLoading[index] && <Loading/>} */}
                </div>
            )}
        </Draggable>
    );
};

// Listsコンポーネントをエクスポート
export default Lists;