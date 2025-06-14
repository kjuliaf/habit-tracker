import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import NotoSun from '~icons/noto/sun';
import IonWaterdrop from '~icons/ion/waterdrop';
import TablerHeart from '~icons/tabler/heart';
import RadixIconsValueNone from '~icons/radix-icons/value-none';
import AntDesignSmileOutlined from '~icons/ant-design/smile-outlined';
import TwemojiToothbrush from '~icons/twemoji/toothbrush';
import TwemojiShower from '~icons/twemoji/shower';
import TwemojiGreenSalad from '~icons/twemoji/green-salad';
import NotoLastQuarterMoonFace from '~icons/noto/last-quarter-moon-face';
import NotoVideoGame from '~icons/noto/video-game';

export type IconConfig = {
	component: Component<SVGAttributes<SVGSVGElement>>;
	color: string;
};

export const iconRegistry: Record<string, IconConfig> = {
	'noto:sun': {
		component: NotoSun,
		color: ''
	},
	'ion:waterdrop': {
		component: IonWaterdrop,
		color: '#3B82F6'
	},
	'tabler:heart': {
		component: TablerHeart,
		color: '#EF4444'
	},
	'ant-design:smile-outlined': {
		component: AntDesignSmileOutlined,
		color: '#F1931B'
	},
	'twemoji:toothbrush': {
		component: TwemojiToothbrush,
		color: ''
	},
	'twemoji:shower': {
		component: TwemojiShower,
		color: ''
	},
	'twemoji:green-salad': {
		component: TwemojiGreenSalad,
		color: ''
	},
	'noto:last-quarter-moon-face': {
		component: NotoLastQuarterMoonFace,
		color: ''
	},
	'noto:video-game': {
		component: NotoVideoGame,
		color: ''
	},
	none: {
		component: RadixIconsValueNone,
		color: 'transparent'
	}
};

export function getIconConfig(iconName: string): IconConfig {
	return iconRegistry[iconName] || iconRegistry['tabler:heart'];
}

export function getIconColor(iconName: string): string {
	return getIconConfig(iconName).color;
}
