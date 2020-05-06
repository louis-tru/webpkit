
export default [
	{
		path: '/',
		page: () => import('./pages/index'),
	},
	{
		path: '/index',
		page: () => import('./pages/index'),
	},
	{
		path: '/404',
		page: () => import('./pages/404'),
	},
	{
		path: '/bad_pixels',
		page: () => import('./pages/bad_pixels'),
	},
	{
		path: '/details',
		page: () => import('./pages/details'),
	},
	{
		path: '/ethereum',
		page: () => import('./pages/ethereum'),
	},
	{
		path: '/iframe',
		page: () => import('./pages/iframe'),
	},
	{
		path: '/led',
		page: () => import('./pages/led'),
	},
	{
		path: '/media',
		page: () => import('./pages/media'),
	},
	{
		path: '/network',
		page: () => import('./pages/network'),
	},
	{
		path: '/network_set',
		page: () => import('./pages/network_set'),
	},
	{
		path: '/photo',
		page: () => import('./pages/photo'),
	},
	{
		path: '/other',
		page: () => import('./pages/other'),
	},
	{
		path: '/factory',
		page: () => import('./pages/factory'),
	},
];
