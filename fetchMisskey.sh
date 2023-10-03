REPO=https://github.com/misskey-dev/misskey.git
BRANCH=develop
rm -rf src/misskey
git clone --filter=blob:none --no-checkout --branch=$BRANCH $REPO src/misskey
cd src/misskey
git config core.sparsecheckout true
cp ../../files-misskey ./.git/info/sparse-checkout
git checkout
rm -rf .git
