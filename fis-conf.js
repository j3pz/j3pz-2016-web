fis.set('project.ignore',
	[
		'.git/**',
		'api/**',
		'libs/**',
		'pay/**',
		'apiv2-node/**',
		'node_modules',
		'icons/',
		'fis-conf.js',
		'j3pz-2016-web.sublime-project',
		'j3pz-2016-web.sublime-workspace'
	]
);

fis.match('*', {
	// deploy: fis.plugin('local-deliver', {
	// 	to: 'F:\\workspace\\apiv2-node\\public'
	// })
	deploy: fis.plugin('http-push', {
		receiver: 'http://121.41.87.72:8999/receiver',
		// 远端目录
		to: '/alidata/www/j3pz/public/'
	})
});

fis.match('/pages/(**.html)', {
	release: '/$1'
});

fis.match('/pages/build.html', {
	release: 'build/index.html'
});

fis.match('/pages/doc.html', {
	release: 'developer/index.html'
});

fis.match('/pages/upgrade.html', {
	release: 'upgrade/index.html'
});

fis.match('/pages/user.html', {
	release: 'user/index.html'
});

fis.match('/tools/(*)(.{html,js})', {
	release: '/tools/$1/index$2'
});

fis.match('/components/*/(**.{jpg,png,gif,ico})', {
	release: '/images/$1'
});

fis.match('/components/*/imgs/(**.{jpg,png,gif,ico})', {
	release: '/images/$1'
});

fis.match('components/**/*.{js,css}', {
	isMod: true
});

fis.match('*.tmpl.html', {
	useMap: true
});

fis.match('::packager', {
	postpackager: fis.plugin('loader', {
		allInOne: false
	})
});

fis.match('/server.conf', {
	release: '/config/server.conf'
});
