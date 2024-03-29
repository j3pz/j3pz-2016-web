fis.set('project.ignore',
	[
		'.git/**',
		'node_modules/**',
		'icons/**',
		'css/fonts/**',
		'css/theme/**',
		'js/**',
		'fis-conf.js',
		'j3pz-2016-web.sublime-project',
		'j3pz-2016-web.sublime-workspace'
	]
);

fis.media('server').match('*', {
	deploy: fis.plugin('local-deliver', {
		to: '/www/j3pz/public'
	})
});

fis.media('local').match('*', {
	deploy: fis.plugin('local-deliver', {
		to: 'F:\\workspace\\j3pz.com\\apiv2-node\\public'
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

fis.match('/pages/reset.html', {
	release: 'reset/index.html'
});

fis.match('/pages/reg.html', {
	release: 'register/index.html'
});

fis.match('/pages/login.html', {
	release: 'login/index.html'
});

fis.match('/pages/about.html', {
	release: 'about/index.html'
});

fis.match('/pages/credit.html', {
	release: 'credit/index.html'
});

fis.match('/pages/policy.html', {
	release: 'policy/index.html'
});

fis.match('/tools/(*)(.{html,js})', {
	release: '/tools/$1/index$2'
});

fis.match('/acacia/(*)(.{html,js})', {
	release: '/acacia/$1/index$2'
});

fis.match('/components/*/(**.{jpg,png,gif,ico})', {
	release: '/images/$1',
	useHash: true
});

fis.match('/components/*/imgs/(**.{jpg,png,gif,ico})', {
	release: '/images/$1',
	useHash: true
});

fis.match('components/**/*.{js,css}', {
	isMod: true
});

fis.match('*.js', {
	optimizer: fis.plugin('uglify-js'),
	useHash: true
});

fis.match('*.css', {
	optimizer: fis.plugin('clean-css'),
	useHash: true
});

fis.match('*.tmpl.html', {
	useMap: true
});

fis.match('::packager', {
	postpackager: fis.plugin('loader', {
		allInOne: true
	})
});

fis.match('**.html', {
	optimizer: fis.plugin('htmlminify', {
		ignoreCustomFragments: [/{{.*?}}/]
	})
});

fis.match('/server.conf', {
	release: '/config/server.conf'
});
