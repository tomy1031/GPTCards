import React, { useRef, useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { useGPTChangeDescription } from '../hooks/gptHooks';

const Card = ({ title, description, onTitleChange, onDescriptionChange, onDelete }) => {

    // タイトルと説明を参照するための参照変数を作成する
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const { data, setData, setLoading } = useContext(AppContext);

    // タイトルと説明の編集可能な状態を保持するための変数を作成する
    const [titleEditable, setTitleEditable] = useState(false);
    const [descriptionEditable, setDescriptionEditable] = useState(false);

    // タイトルが編集終了したときの処理
    const handleTitleBlur = (event) => {
        if (event.relatedTarget !== descriptionRef.current) {
            const newTitle = titleRef.current.textContent;
            onTitleChange(newTitle);
            setTitleEditable(false);
        }
    };

    // 説明が編集終了したときの処理
    const handleDescriptionBlur = (event) => {
        if (event.relatedTarget !== titleRef.current) {
            const newDescription = descriptionRef.current.textContent;
            onDescriptionChange(newDescription);
            setDescriptionEditable(false);
        }
    };
    // 深堀り機能
    const useDeepDive = async () => {
        // 新しいリストとカードを作成
        let newCards = await description.split('\n').map((line) => ({
            id: uuidv4(),
            title: line.trim(),
            description: `・説明1
・説明2`,
        }));
        setLoading(true)
        //descriptionにGPTが説明を入力
        // const newData = await useGPTChangeDescription(data, newCards, cardTitle, cardType,title);

        const newList = {
            id: uuidv4(),
            listName: title,
            cards: newCards,
        };
        setData([...data, newList]);

        // 新しいリストをデータに追加
        // setData(newData);
        setLoading(false);
    };

    // 編集可能なカードのUIを返す
    return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg mt-4 whitespace-pre-wrap shadow-lg">
            <div className="flex justify-between items-start">
                <h3
                    className="font-bold text-sm"
                    // タイトルを編集可能な状態にする
                    contentEditable={titleEditable}
                    ref={titleRef}
                    // タイトルの編集が終了したときの処理
                    onBlur={handleTitleBlur}
                    // タイトルがダブルクリックされたときに編集可能にする
                    onDoubleClick={() => setTitleEditable(true)}
                    // contentEditable属性を使った編集に関する警告を非表示にする
                    suppressContentEditableWarning={true}
                >
                    {title}
                </h3>
                <div>
                    <button
                        onClick={useDeepDive} // onDeepDiveプロパティを追加
                        className="text-gray-400 text-sm -mt-3 mr-1 cursor-pointer"
                    >
                        📤
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-gray-400 text-md -mt-3 -mr-1 font-bold cursor-pointer"
                    >
                        ×
                    </button>
                </div>
            </div>

            <p
                className="text-sm"
                // 説明を編集可能な状態にする
                contentEditable={descriptionEditable}
                ref={descriptionRef}
                // 説明の編集が終了したときの処理
                onBlur={handleDescriptionBlur}
                // 説明がダブルクリックされたときに編集可能にする
                onDoubleClick={() => setDescriptionEditable(true)}
                // contentEditable属性を使った編集に関する警告を非表示にする
                suppressContentEditableWarning={true}
            >
                {description}
            </p>
        </div>
    );
};

export default Card;
