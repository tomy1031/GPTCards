import { v4 as uuidv4 } from "uuid";

const initLists = [
  {
    id: uuidv4(),
    listName: "ユーザーのニーズ",
    cards: [
      {
        id: uuidv4(),
        title: "ユーザーはどのような機能を求めているか？",
        description: "・簡単に出品ができる\n・商品検索がしやすい\n・取引がスムーズであること\n・安心して利用できること"
      },
    ],
  },
  {
    id: uuidv4(),
    listName: "ビジネス上の目的",
    cards: [
      {
        id: uuidv4(),
        title: "サービス提供者が実現したいことは何か？",
        description: "・競合他社に対する差別化を実現する\n・ユーザーのニーズに合ったサービスを提供することで、市場シェアを拡大する\n・安定的な収益を確保する"
      },
    ],
  },
  {
    id: uuidv4(),
    listName: "アプリの機能要件",
    cards: [
      {
        id: uuidv4(),
        title: "ユーザー登録機能",
        description: "・アカウント作成\n・ログイン\n・ログアウト\n・パスワードリセット"
      },
      {
        id: uuidv4(),
        title: "商品検索機能",
        description: "・キーワード検索\n・カテゴリー検索\n・絞り込み検索"
      },
      {
        id: uuidv4(),
        title: "出品機能",
        description: "・商品情報入力\n・画像アップロード\n・価格設定\n・在庫管理"
      },
      {
        id: uuidv4(),
        title: "取引機能",
        description: "・商品の購入\n・支払い\n・商品の配送\n・評価"
      },
    ],
  },
];

export default initLists;