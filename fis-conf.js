fis.match('/pages/(**.html)',{
	release: '/$1'
});

fis.match('/pages/build.html',{
	release: 'build/build.html'
});

fis.match('/components/*/(**.{jpg,png,gif,ico})',{
	release: '/images/$1'
});

fis.match('/components/*/imgs/(**.{jpg,png,gif,ico})',{
	release: '/images/$1'
});

fis.match('components/**/*.{js,css}',{
	isMod:true
});

fis.match('*.tmpl.html',{
	useMap:true
});

fis.match('::packager', {
	postpackager: fis.plugin('loader', {
		// allInOne: true
	})
});