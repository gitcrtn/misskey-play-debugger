# misskey-play-debugger

## 概要
aiscript playgroundでmisskey play用のコードを実行可能にしました。  
UiライブラリによるUI表示とMkライブラリの利用が可能です。  

## フォーク元
* misskey v13.2.5
* aiscript v0.12.2

## 実行方法
以下を実行後に http://localhost:3000/aiscript/ をWebブラウザで開いてください。
```
git clone https://github.com/gitcrtn/misskey-play-debugger.git
cd misskey-play-debugger
yarn
yarn dev
```

## 注意点
* 静的ビルド(yarn build)に対応していません。  
静的ビルドしたページで絵文字ありのaiscriptをRUNすると、UNI_EMOJIのエラーが出ることを確認しています。
* Uiを使用したコードをRUNした後に再度RUNする場合はページのリロードが必要です。
* API Mockは未実装です。  
MkライブラリによるAPI利用のモックに対応させる予定です。
* 一部のダイアログ表示（osモジュールの差し替え）が未実装です。
* misskeyのAPIアクセスを全て無効にしています。
* カスタム絵文字に対応していません。  
Unicode絵文字のみ動作確認済みです。
