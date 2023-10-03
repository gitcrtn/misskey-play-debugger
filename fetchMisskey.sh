REPOPREFIX='https://raw.githubusercontent.com/misskey-dev/misskey/develop/'
PREFIX='./src/misskey/'
while read -r input; do
	echo $(printf %.1s $input)
	if [ $(printf %.1s $input) = '#' ]; then
		echo $input
	elif [ $(printf %.1s $input) = $'\t' ]; then
		echo $input
		curl $REPOPREFIX$path$input -o $PREFIX$path$input
	else
		path=$input
	fi
done < "files-misskey"
