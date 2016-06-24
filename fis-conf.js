fis.match('/pages/(**.html)',{
	release: '/$1'
});

fis.match('/pages/build.html',{
	release: 'build/index.html'
});

fis.match('/pages/doc.html',{
	release: 'developer/index.html'
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
		allInOne: true
	})
});

fis.match('/server.conf', {
	release: '/config/server.conf'
});

fis.set('project.ignore', 
	[
		'.git/**', 
		'fis-conf.js', 
		'j3pz-2016-web.sublime-project',
		'j3pz-2016-web.sublime-workspace',
	]
);