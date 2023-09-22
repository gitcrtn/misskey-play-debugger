# misskey-play-debugger

## 概要
aiscript playgroundでmisskey play用のコードを実行可能にしました。  
UiライブラリによるUI表示とMkライブラリの利用が可能です。  
Mk:api()はMock機能を利用可能です。  
### フォークの変更
* Github Pagesで利用可能に（未確認だが後述の絵文字使用時のエラーがある？）
* yarnからnpmに
* AiScriptのバージョンを更新
* Linterを廃止

## 使用バージョン
* misskey v13.2.5
* aiscript v0.16.0

## ローカルで実行
以下を実行後に表示されるURLをWebブラウザで開いてください。
```
git clone https://github.com/gitcrtn/misskey-play-debugger.git
cd misskey-play-debugger
npm ci
npm run dev
```

## API Mockの使い方
以下のようにjsonで定義したレスポンスでモックされます。  
パラメータ引数がMk:api()で指定された場合は、  
パラメータのキーがあればその値をレスポンスとして返します。  
```
{
    "path/to/api": ["response"],
    "path/to/api-per-param": {
        "paramA": "responseA",
        "paramB": ["responseB"]
    }
}
```

## 注意点
* 静的ビルド(yarn build)に対応していません。  
静的ビルドしたページで絵文字ありのaiscriptをRUNすると、UNI_EMOJIのエラーが出ることを確認しています。
* Uiを使用したコードをRUNした後に再度RUNする場合はページのリロードが必要です。
* 一部のダイアログ表示（osモジュールの差し替え）が未実装です。
* misskeyのAPIアクセスを全て無効にしています。
* カスタム絵文字に対応していません。  
Unicode絵文字のみ動作確認済みです。
