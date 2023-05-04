const Loading = () => {
    return(
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                <p className="text-white text-xl">処理中...</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    )
};

export default Loading;
