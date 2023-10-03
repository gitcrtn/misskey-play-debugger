REPOPREFIX='https://raw.githubusercontent.com/misskey-dev/misskey/develop/'
PREFIX='./src/misskey/'
while read -r input; do
	if [[ $input =~ '#' ]]; then
		:
	elif [[ $input =~ '\t' ]]; then
		curl $REPOPREFIX$path$input -o $PREFIX$path$input
	else
		path=$input
	fi
done < "files-misskey"
