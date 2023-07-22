import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import yaml from 'js-yaml';

// API設定
const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';

export const useGPTCreateCards = async (cardTitle, cardType, setError) => {
    if (!cardTitle || !cardType) {
        setError("すべてのフィールドを入力してください。");
        return;
    }

    const prompt = `
あなたはシステム設計のプロです。
作りたい成果物は、${cardTitle}です。
成果物の種類は、${cardType}です。
上記の要件定義のために必要な要素のYaml  を作り、より良い成果物に仕上げるための、要件定義のステップをlistNameとして6つ出力してください。
・listName:要件定義のステップバイステップでの手順
・title:項目名
・description:提案(箇条書き)

#例(アプリの場合)
- listName: アプリの目的
  cards:
    - title: アプリで実現したいこと
      description: |-
        ・誰でも要件定義が作れるアプリ
        ・GPTが必要な項目と回答を提案し、回答のなかからやりたいものを見出す。
    - title: ターゲット
      description: |-
        ・アプリを作りたい人
        ・情シスよりもITリテラシーが低めな人
- listName: アプリの機能要件
  cards:
    - title: ログイン機能
      description: 要件定義の保存のために作成
`;
    const response = await callGPTAPI(prompt);
    console.log(response);
    //YamlをJSON形式に変換
    const jsonResponse = yaml.load(response);
    // const jsonResponse = yamlToJSON(response);
    console.log(jsonResponse);
    //IDを追加する
    const gptCreateCards = await addUuidsToJson(jsonResponse);
    console.log(gptCreateCards);
    return gptCreateCards;
};

export const useGPTAddCards = async (cardTitle, cardType, list, data, index) => {
    const cardText = JSON.stringify(list.cards);
    const prompt = `
あなたはシステム設計のプロです。要件定義のために、[#これまでの質問]に追加する必要な項目名と提案📤を作成してください。
・作りたい成果物は、${cardTitle}です。
・成果物の種類は、${cardType}です。
・質問のカテゴリ(listName)は${list.listName}です。

#これま での質問(JSON)※title,descriptionの内容をあわせる
${cardText}

質問と解答の作成に必要な要素のYamlを作り、以下cardsを優先順位高いものから6つ出力してください。
・title:項目名
・description:提案（箇条書き）

#例
- cards:
  - title: アプリで実現したいこと
    description: |-
      ・誰でも要件定義が作れるアプリ
      ・GPTが必要な項目と回答を提案し、回答のなかからやりたいものを見出す。
  - title: ターゲット
    description: |-
      ・アプリを作りたい人
      ・情シスよりもITリテラシーが低めな人
`;

    const response = await callGPTAPI(prompt);
    console.log(response);
    //YamlをJSON形式に変換
    const jsonResponse = yaml.load(response);
    // const jsonResponse = yamlToJSON(response);
    console.log(jsonResponse);
    //IDを追加する
    const gptAddCards = await addUuidsToCard(jsonResponse);
    const updatedData = [...data];
    updatedData[index].cards = [...updatedData[index].cards, ...gptAddCards];
    return updatedData;
};


export const useGPTAddList = async (cardTitle, cardType, data) => {
    const prevCategory = data.map((obj) => obj.listName);
    const prompt = `
あなたはシステム設計のプロです。
作りたい成果物は、${cardTitle}です。
成果物の種類は、${cardType}です。


#これまでのカテゴリ一覧
${JSON.stringify(prevCategory)}

#要件定義に必要な要素をステップバイステップで出した時、「#これまでのカテゴリ一覧」にない要素があれば、その要素のYamlを作り、必要なtitle,descriptionを優先順位高いものから出力してください。
・listName:新しく作成するカテゴリ名
・title:項目名
・description:提案（箇条書き）

#例
- listName: アプリの目的
  cards:
    - title: アプリで実現したいこと
      description: |-
        ・誰でも要件定義が作れるアプリ
        ・GPTが必要な項目と回答を提案し、回答のなかからやりたいものを見出す。
    - title: ターゲット
      description: |-
        ・アプリを作りたい人
        ・情シスよりもITリテラシーが低めな人
`;
    const response = await callGPTAPI(prompt);
    console.log(response);
    //YamlをJSON形式に変換
    const jsonResponse = yaml.load(response);
    // const jsonResponse = yamlToJSON(response);
    console.log(jsonResponse);
    //IDを追加する
    const gptAddCards = await addUuidsToJson(jsonResponse);
    let updatedData = [...data]
    updatedData.push(gptAddCards[0]);
    return updatedData;
};

// 完成度チェック
export const useGPTCompletionCheck = async (cardTitle, cardType, data, setGptText) => {
    let prompt = `あなたはシステム設計のプロです。
    以下は要件定義の項目をJSON化したものです。
    ・作りたい成果物は、${cardTitle}です。
    ・成果物の種類は、${cardType}です。
    
    以下の内容を出力してください。出力の際ITの専門用語を使うのはNGです。

    【1.要件定義完成度】
    30-100で記載してください。（完成度:この情報をもとにエンジニアが設計できるか、やや厳し目に評価）
    (出力例)完成度 ○%

    【2.追加が必要な項目】
    要件定義完成度を100%にするのに必要な項目を、優先度の高いものから順に
    箇条書きで不足が無いように全て洗い出して下さい。
    提案は【提案】、必須項目は【必須】と書いてください。項目の説明もお願いします。
    
    【3.その他内容についてのアドバイス】
    ITに詳しくない人でもわかる言葉で、専門的な要素についての説明は不要
    #JSONの内容
    `;
    prompt += JSON.stringify(data);
    await callGPTAPIStream(prompt, setGptText);
}

export const useGPTChangeDescription = async (data, newList, cardTitle, cardType, title) => {
    let prompt = `あなたはシステム設計のプロです。
    あなたはシステム設計のプロです。
    作りたい成果物は、${cardTitle}です。
    成果物の種類は、${cardType}です。
    以下「元データ（JSON）」をYamlの「ここに説明を記載」を置き換えて、「#出力形式」に合わせたyamlで出力してください。
    
    #元データ
    ${JSON.stringify(newList)}
    
    #項目の説明
    ・listName:
    ・title:カテゴリに対する項目名
    ・description:titleに対する提案（箇条書き）
    
    #出力形式
    - listName: ${title}
      cards:
        - title: アプリで実現したいこと
          description: |-
            ・誰でも要件定義が作れるアプリ
            ・GPTが必要な項目と回答を提案し、回答のなかからやりたいものを見出す。
        - title: ターゲット
          description: |-
            ・アプリを作りたい人
            ・情シスよりもITリテラシーが低めな人
    `;
    const response = await callGPTAPI(prompt);
    const jsonResponse = yaml.load(response);
    // const jsonResponse = yamlToJSON(response);
    console.log(jsonResponse);
    //IDを追加する
    const gptNewList = await addUuidsToJson(jsonResponse);
    let updatedData = [...data]
    //listNameが書き換わるので、上書き

    updatedData.push(gptNewList[0]);
    return updatedData;
}


// GPTからのレスポンスを取得
const callGPTAPI = async (prompt) => {
    try {
        const endpoint = API_URL + "chat/completions";

        const data = {
            // モデル ID の指定
            model: MODEL,
            // 質問内容
            messages: [
                {
                    'role': 'user',
                    'content': prompt,
                }
            ],
        };

        const response = await axios.post(endpoint, data,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.REACT_APP_GPT_KEY}`,
            },
        });

        console.log(response);
        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error("GPTからの適切な結果を取得できませんでした。");
        }
    } catch (error) {
        console.error(error);
        throw new Error("GPTへのリクエスト中にエラーが発生しました。");
    }
};


// GPTからのレスポンスを取得
const callGPTAPIStream = async (prompt, setGptText) => {
    try {
        const endpoint = API_URL + "chat/completions";

        const data = {
            // モデル ID の指定
            model: MODEL,
            stream: true,

            // 質問内容
            messages: [
                {
                    'role': 'user',
                    'content': prompt,
                }
            ],
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_GPT_KEY}`,
            },
            body: JSON.stringify(data),
        });

        // ReadableStream として使用する
        const reader = response.body?.getReader();

        if (response.status !== 200 || !reader) {
            throw new Error("GPTからの適切な結果を取得できませんでした。");
        }

        const decoder = new TextDecoder('utf-8');

        let sendMessage = ""
        const read = async () => {
            const { done, value } = await reader.read();
            if (done) return reader.releaseLock();

            const chunk = decoder.decode(value, { stream: true });
            // この chunk には以下のようなデータ格納されている。複数格納されることもある。
            // data: { ... }
            // これは Event stream format と呼ばれる形式
            // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
            console.log(chunk);

            const jsons = chunk
                // 複数格納されていることもあるため split する
                .split('data:')
                // data を json parse する
                // [DONE] は最後の行にくる
                .map((data) => {
                    const trimData = data.trim();
                    if (trimData === '') return undefined;
                    if (trimData === '[DONE]') return undefined;
                    return JSON.parse(data.trim());
                })
                .filter((data) => data);

            // あとはこの jsons を好きに使用すれば良いだけ。
            console.log(jsons);
            let chunkMessage = "";
            chunkMessage = jsons.map((data)=>{
                return data.choices[0].delta.content || "";
            })
            sendMessage += chunkMessage.join('');
            setGptText(sendMessage);

            return read();
        }
        await read();
    } catch (error) {
        console.error(error);
        throw new Error("GPTへのリクエスト中にエラーが発生しました。");
    }
};


// const callGPTAPIStream = async (prompt, setGptText) => {


//     const url = 'https://api.openai.com/v1/chat/completions';
//     const completion = await fetch(url, {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.REACT_APP_GPT_KEY}`,
//         },
//         body: JSON.stringify({
//             'model': 'gpt-3.5-turbo',
//             'stream': true,
//             'messages': prompt,
//         }),
//     });


//     // ReadableStream として使用する
//     const reader = completion.body?.getReader();

//     if (completion.status !== 200 || !reader) {
//         return "error";
//     }

//     const decoder = new TextDecoder('utf-8');
//     try {
//         // この read で再起的にメッセージを待機して取得します
//         const read = async () => {
//             const { done, value } = await reader.read();
//             if (done) return reader.releaseLock();

//             const chunk = decoder.decode(value, { stream: true });
//             // この chunk には以下のようなデータ格納されている。複数格納されることもある。
//             // data: { ... }
//             // これは Event stream format と呼ばれる形式
//             // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
//             console.log(chunk);

//             const jsons = chunk
//                 // 複数格納されていることもあるため split する
//                 .split('data:')
//                 // data を json parse する
//                 // [DONE] は最後の行にくる
//                 .map((data) => {
//                     const trimData = data.trim();
//                     if (trimData === '') return undefined;
//                     if (trimData === '[DONE]') return undefined;
//                     return JSON.parse(data.trim());
//                 })
//                 .filter((data) => data);

//             // あとはこの jsons を好きに使用すれば良いだけ。
//             console.log(jsons);
//             setGptText(jsons.join(''));

//             return read();
//         };
//         await read();
//     } catch (e) {
//         console.error(e);
//     }
// }

// レスポンスからJSONを抽出
// const extractJsonFromText = (response) => {
//     const jsonString = response.match(/\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/)[0];
//     return JSON.parse(jsonString);
// };



// const yamlToJSON = (yamlText) => {
//     const lines = yaml.split('\n');
//     let json = [];
//     let currentList = {};

//     lines.forEach(line => {
//         const value = line.substr(line.indexOf(': ') + 1);

//         if (line.indexOf('listName:') !== -1) {
//             if (currentList.listName) {
//                 json.push(currentList);
//             }
//             currentList = { listName: value, cards: [] };
//         } else if (line.startsWith('title:')) {
//             currentList.cards.push({ title: value, description: '' });
//         } else if (line.startsWith('description:')) {
//             currentList.cards[currentList.cards.length - 1].description = line.replace('description: ', '');
//         }
//     });

//     if (currentList.listName) {
//         json.push(currentList);
//     }

//     return json;
// };


// const addUuidsToJson = async(jsonData) => {
//     await jsonData.map((data) => ({
//         id: uuidv4(),
//         ...data,
//         cards: data.cards.map((card) => ({
//             id: uuidv4(),
//             ...card,
//         })),
//     }));
//     return jsonData;
// }
const addUuidsToJson = (data) => {
    return data.map(item => {
        return {
            ...item,
            id: uuidv4(),
            cards: item.cards.map(card => {
                return {
                    ...card,
                    id: uuidv4(),
                };
            }),
        };
    });
};


const addUuidsToCard = (data) => {
    return data[0].cards.map(item => {
        item.id = uuidv4()
        return item;
    });
};