// src/components/SideMenu.jsx
import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import pptxgen from 'pptxgenjs'
import { useGPTCompletionCheck, useGPTAddList } from '../hooks/gptHooks';


const SideMenu = ({ isOpen, onClose }) => {
    const [selectedSave, setSelectedSave] = useState('');
    const { data, setData, cardTitle, cardType, setLoading, setCardTitle, setCardType } = useContext(AppContext);
    const [exportFormat, setExportFormat] = useState('PowerPoint');
    const [gptText, setGptText] = useState("");
    const [activeTab, setActiveTab] = useState(1);


    const handleExport = async () => {
        if (exportFormat === 'PowerPoint') {
            const pptx = new pptxgen();
            pptx.defineSlideMaster({
                title: "master",
                background: { color: "ffffff" },
                color: "ffffff",
                objects: [
                    // {
                    //     rect: {
                    //         x: -0.01,
                    //         y: -0.1,
                    //         w: "100.2%",
                    //         h: 1,
                    //         fill: { color: "1F4E78" },
                    //     },
                    // },
                    // {
                    //     rect: {
                    //         x: -0.01,
                    //         y: "87%",
                    //         w: "100.2%",
                    //         h: 0.75,
                    //         fill: { color: "FEEA00" },
                    //     },
                    // },
                ],
                slideNumber: { x: "95%", y: "90%" },
            });


            // スライド1枚目
            const slide1 = pptx.addSlide({ masterName: "master" });
            slide1.addText(cardTitle, { x: 0, y: '40%', w: '100%', h: 1.5, align: 'center', fontSize: 24 });

            // スライド2枚目
            const slide2 = pptx.addSlide({ masterName: "master" });
            slide2.addText('目次', { x: 0, y: 0.5, w: '100%', h: 1, align: 'center', fontSize: 24 });
            data.forEach((list, index) => {
                slide2.addText(list.listName, { x: 0.5, y: (index + 1) * 1, w: '100%', h: 1, fontSize: 18 });
            });

            // スライド3枚目以降
            data.forEach((list) => {
                const listSlide = pptx.addSlide({ masterName: "master" });
                listSlide.addText(list.listName, { x: 0, y: '40%', w: '100%', h: 1.5, align: 'center', fontSize: 24 });

                list.cards.forEach((card) => {
                    const slide = pptx.addSlide({ masterName: "master" });
                    slide.addText(card.title, { x: 0, y: 0, w: '100%', h: 1, align: 'center', fontSize: 24 });
                    card.description.split('\n').forEach((text, index) => {
                        slide.addText(text, { x: 0.5, y: (index + 1) * 0.8, w: '100%', h: 1, fontSize: 18, fontFace: "ヒラギノ丸ゴ Pro" });
                    });
                });
            });
            pptx.writeFile({ fileName: cardTitle + '.pptx' });
        }
    };


    const useScoring = async () => {
        await useGPTCompletionCheck(cardTitle, cardType, data, setGptText);
    };

    const saveToLocalStorage = () => {
        const id = uuidv4();
        const datetime = new Date().toISOString();
        const saveData = { id, datetime, data, cardTitle, cardType };
        const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
        savedData.push(saveData);
        localStorage.setItem('savedData', JSON.stringify(savedData));
    };

    const loadFromLocalStorage = () => {
        const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
        const targetSave = savedData.find((save) => save.id === selectedSave);
        if (targetSave) {
            setData(targetSave.data);
            setCardTitle(targetSave.cardTitle);
            setCardType(targetSave.cardType);
        }
    };
    const addList = async () => {
        const newList = {
            id: uuidv4(),
            listName: "追加済みのリスト",
            cards: [{
                id: uuidv4(),
                title: "カード1",
                description: `・説明1
・説明2`
            }]
        };
        setData([...data, newList]);
    };

    const useAddList = async () => {
        setLoading(true);
        const newData = await useGPTAddList(cardTitle, cardType, data);
        if (newData) {
            setData(newData);
        }
        setLoading(false);
    };

    return (
        isOpen && (
            <div className="fixed top-0 right-0 h-screen xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full bg-white shadow-lg z-10 p-4 transition-all ease-linear">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">メニュー</h2>
                    <button className="text-2xl" onClick={onClose}>
                        ×
                    </button>
                </div>
                {/* Tab headers */}
                <div className="flex mb-4">
                    <button
                        className={`w-1/3 text-center py-2 ${activeTab === 1 ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setActiveTab(1)}
                    >
                        アクション
                    </button>
                    <button
                        className={`w-1/3 text-center py-2 ${activeTab === 2 ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setActiveTab(2)}
                    >
                        採点
                    </button>
                    <button
                        className={`w-1/3 text-center py-2 ${activeTab === 3 ? "border-b-2 border-blue-500 font-bold" : ""}`}
                        onClick={() => setActiveTab(3)}
                    >
                        データ
                    </button>
                </div>
                {/* Tab contents */}
                {activeTab === 1 && (
                    <div>
                        <button
                            onClick={addList}
                            className="bg-blue-400 text-white px-4 py-2 rounded-md mb-4 w-full"
                        >
                            リストの追加(空)
                        </button>

                        <button
                            onClick={useAddList}
                            className="bg-blue-400 text-white px-4 py-2 rounded-md mb-4 w-full"
                        >
                            リストの追加(GPT)
                        </button>
                    </div>
                )}
                {activeTab === 2 && (
                    <div>
                        <button
                            onClick={useScoring}
                            className="bg-blue-400 text-white px-4 py-2 rounded-md mb-4 w-full"
                        >
                            採点する
                        </button>
                        <textarea
                            className="border-2 border-gray-200 w-full h-40 mb-4"
                            placeholder="採点結果"
                            value={gptText}
                            readOnly
                        ></textarea>
                        <button className="bg-blue-400 text-white px-4 py-2 rounded-md mb-4 w-full">
                            採点結果をボードに反映
                        </button>
                    </div>
                )}
                {activeTab === 3 && (
                    <div>
                        <button
                            onClick={saveToLocalStorage}
                            className="bg-blue-400 text-white px-4 py-2 rounded-md mb-4 w-full"
                        >
                            保存
                        </button>
                        <div className="mb-4">
                            <label className="block mb-2">データをロード:</label>
                            <select
                                value={selectedSave}
                                onChange={(e) => setSelectedSave(e.target.value)}
                                className="border-2 border-gray-200 w-full mb-4 p-2"
                            >
                                <option value="">選択してください</option>
                                {(JSON.parse(localStorage.getItem('savedData')) || []).map(
                                    (save) => (
                                        <option key={save.id} value={save.id}>
                                            {save.datetime}
                                        </option>
                                    )
                                )}
                            </select>
                            <button
                                onClick={loadFromLocalStorage}
                                className="bg-blue-400 text-white px-4 py-2 rounded-md w-full"
                            >
                                ロード
                            </button>
                        </div>
                        <div className="mb-4">

                            <label className="block mb-2">出力:</label>
                            <select
                                id="exportFormat"
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="border-2 border-gray-200 w-full mb-4 p-2"
                            >
                                <option value="PowerPoint">PowerPoint</option>
                                <option value="Word">Word</option>
                                <option value="Excel">Excel</option>
                            </select>
                        </div>
                        <button
                            onClick={handleExport}
                            className="bg-blue-400 text-white px-4 py-2 rounded-md w-full"
                        >
                            出力
                        </button>
                    </div>
                )}
            </div>
        )
    );
};


export default SideMenu;
