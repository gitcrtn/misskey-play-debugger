# misskey-play-debugger

## 概要
aiscript playgroundでmisskey play用のコードを実行可能にしました。  
UiライブラリによるUI表示とMkライブラリの利用が可能です。  
Mk:api()はMock機能を利用可能です。  

## フォーク元
* misskey v13.2.5
* aiscript v0.12.4

## 実行方法
以下を実行後に http://localhost:3000/aiscript/ をWebブラウザで開いてください。
```
git clone https://github.com/gitcrtn/misskey-play-debugger.git
cd misskey-play-debugger
yarn
yarn dev
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

## Linter
Lintボタンをクリックするとコードを静的解析できます。  
以下のエラーに対応しています。  
| No. | Error | 説明 |
| --- | ----- | ---- |
| E0001 | unknown-function | 未定義の関数が呼び出されています |
| E0002 | no-value-for-function-args | 関数呼び出しの引数の数が足りません |
| E0003 | too-many-function-args | 関数呼び出しの引数が多すぎています |

## 注意点
* 静的ビルド(yarn build)に対応していません。  
静的ビルドしたページで絵文字ありのaiscriptをRUNすると、UNI_EMOJIのエラーが出ることを確認しています。
* Uiを使用したコードをRUNした後に再度RUNする場合はページのリロードが必要です。
* 一部のダイアログ表示（osモジュールの差し替え）が未実装です。
* misskeyのAPIアクセスを全て無効にしています。
* カスタム絵文字に対応していません。  
Unicode絵文字のみ動作確認済みです。
