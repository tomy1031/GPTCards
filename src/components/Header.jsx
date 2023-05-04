// src/components/Header.jsx
import React, { useState, useContext } from 'react';
import { useGPTCreateCards } from '../hooks/gptHooks';
import AppContext from '../contexts/AppContext';
import SideMenu from './SideMenu';

const Header = () => {

    const { data, setData, setError, setLoading, cardTitle, cardType, setCardTitle, setCardType } = useContext(AppContext);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const handleMenuButtonClick = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const useCreateCard = async () => {
        setLoading(true);
        const newData = await useGPTCreateCards(cardTitle, cardType, setError);
        if (newData) {
            setData(newData);
        }
        setLoading(false);
    };

    return (
        <header className="bg-white">
            <div className="border py-3 px-6">
                <div className="flex justify-between text-gray-800">
                    <div className="flex items-center">
                        <span className="ml-2 font-semibold text-[#252C32]">GPT Create Card</span>
                    </div>
                    <div className="ml-6 flex flex-1 gap-x-3">
                        <input
                            type="text"
                            className="w-full rounded-md border border-[#DDE2E4] px-3 py-2 text-sm"
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            placeholder="作りたいものを書いてください"
                        />
                    </div>
                    <div className="ml-2 flex-1 flex">
                        <select
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            className="rounded-md border border-[#DDE2E4] px-3 py-2 text-sm"
                        >
                            <option value="Webアプリ">Webアプリ</option>
                            <option value="スマホアプリ">スマホアプリ</option>
                            <option value="VRコンテンツ">VRコンテンツ</option>
                            <option value="映像">映像</option>
                            <option value="ゲームアプリ">ゲームアプリ</option>
                            <option value="ウェブサイト">ウェブサイト</option>
                        </select>
                        <div className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 bg-blue-400">
                            <button className="text-sm font-medium text-white" onClick={useCreateCard}>
                                カードを作成
                            </button>
                        </div>
                    </div>
                    <div className="flex">
                        <button onClick={handleMenuButtonClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M2 5h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} data={data} setData={setData} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
