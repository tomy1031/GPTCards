# GPT-3.5-turboを使用したシステム設計要件定義アシスタント

このリポジトリでは、OpenAIのGPT-3.5-turboを利用して自動的にアイデアカードを生成し、
要件定義を支援する機能を提供しています。
リストとカードをドラッグアンドドロップで移動できることができ、思考を整理するのに役立ちます。
主な機能は以下の通りです。

1. カードのタイトルとタイプを入力して、GPT-4でカードを自動生成
2. カードの作成、編集、削除
3. タイトルと説明の編集
4. カードの説明を元に新しいリストを作成する深堀り機能
5. 既存のリストに新しいカードを追加する
6. 要件定義の新しいカテゴリを追加する
7. 要件定義の完成度をチェックする
8. 説明の変更を反映させる(開発中)
9. カードのデータを管理(セーブ・ロード)
10. プレゼンテーション資料をPowerPoint形式でエクスポート
11. カードの採点と採点結果をボードに反映



## インストール

このリポジトリをクローンし、必要な依存関係をインストールしてください。

```
git clone https://github.com/tomy1031/GPTCards.git
cd GPTCards
npm install 
```

## 使い方

1. プロジェクトのルートディレクトリに、`.env` ファイルを作成し、`REACT_APP_GPT_KEY` にOpenAI APIキーを設定してください。

```
REACT_APP_GPT_KEY=your_openai_api_key
```

2. アプリケーションを起動します。

```
npm start
```

3. GPTを利用した主な機能は以下のfunctionに定義されています。

- `useGPTCreateCards(cardTitle, cardType, setError)`
- `useGPTAddCards(cardTitle, cardType, list, data, index)`
- `useGPTAddList(cardTitle, cardType, data)`
- `useGPTCompletionCheck(cardTitle, cardType, data, setGptText)`
- `useGPTChangeDescription(data, newList, cardTitle, cardType, title)`

4. GPTからのレスポンスを取得するための関数が定義されています。

- `callGPTAPIStream(prompt, setGptText)`
- `callGPTAPI(prompt)`

5. 一意のIDを追加するためのヘルパー関数が定義されています。

- `addUuidsToJson(data)`
- `addUuidsToCard(data)`

## アプリの使用方法

1. まず、ヘッダーの要件のタイトル（テキストボックス）と要件タイプ（セレクトボックス）を入力します。
2. 「カードを作成」ボタンをクリックしてGPTによるカードの生成を開始します。
3. 生成されたカードがリストに追加されます。
4. カードのタイトルと説明、リスト名をダブルクリックして編集できます。
5. カードを削除するには、カードの右上にある × ボタンをクリックします。
6. 必要に応じてリストを追加し(GPT提案あり/なし)、カードを採点し、結果をボードに反映します。
7. 作成したデータをローカルストレージに保存/ロードできます。
8. PowerPoint形式でプレゼンテーション資料をエクスポートします。



## コンポーネント構成

- `App.jsx`: アプリケーションのルートコンポーネント
- `AppContext.js`: アプリケーションの状態管理用コンテキスト
- `src/components/Header.jsx`: ヘッダーコンポーネント（カード作成フォームとサイドメニューボタンを含む）
- `src/components/SideMenu.jsx`: サイドメニューコンポーネント（データの保存/ロード、カード採点、エクスポート機能を含む）
- `src/components/CardList.jsx`: カードリストコンポーネント
- `src/components/Card.jsx`: カードコンポーネント

## コンポーネント

### Card

`Card` コンポーネントでは、タイトルと説明の編集が可能なカードを提供しています。カードのタイトルと説明が変更されたときに、リスト内のカードのデータを更新できるようにしています。また、カードの削除機能も提供しています。

### Header

`Header` コンポーネントでは、カードの作成機能が実装されています。ユーザーは、作成したいカードのタイトルとタイプを入力し、カードを作成することができます。また、サイドメニューの表示/非表示を切り替えるボタンも提供しています。

### SideMenu

`SideMenu` コンポーネントでは、カードのデータを管理できるサイドメニューが提供されています。サイドメニュー内には、カードをリストに追加する機能や、カードを削除する機能が実装されています。

## 使用技術

- React
- GPT
- PowerPoint出力用ライブラリ: pptxgenjs

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。詳細については、`LICENSE`ファイルを参照してください。
