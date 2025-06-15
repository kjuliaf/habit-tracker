import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import NotoSun from '~icons/noto/sun';
import IonWaterdrop from '~icons/ion/waterdrop';
import EmojioneRedHeart from '~icons/emojione/red-heart'
import RadixIconsValueNone from '~icons/radix-icons/value-none';
import TwemojiToothbrush from '~icons/twemoji/toothbrush';
import TwemojiShower from '~icons/twemoji/shower';
import TwemojiGreenSalad from '~icons/twemoji/green-salad';
import NotoLastQuarterMoonFace from '~icons/noto/last-quarter-moon-face';
import NotoVideoGame from '~icons/noto/video-game';
import NotoWomanWalkingMediumSkinTone from '~icons/noto/woman-walking-facing-right-medium-skin-tone'
import NotoWomanRunningFacingRightMediumSkinTone from '~icons/noto/woman-running-facing-right-medium-skin-tone'
import NotoBroom from '~icons/noto/broom'
import NotoWomanInLotusPositionMediumSkinTone from '~icons/noto/woman-in-lotus-position-medium-skin-tone'
import NotoOpenBook from '~icons/noto/open-book'
import NotoAvocado from '~icons/noto/avocado';
import FluentEmojiPottedPlant from '~icons/fluent-emoji/potted-plant'
import EmojionePencil from '~icons/emojione/pencil'
import StreamLineColorTaskListFlat from '~icons/streamline-color/task-list-flat';
import FamiconsBarbell from '~icons/famicons/barbell'
import NotoSmilingFace from '~icons/noto/smiling-face'

export type IconConfig = {
	component: Component<SVGAttributes<SVGSVGElement>>;
	color: string;
};

export const iconRegistry: Record<string, IconConfig> = {
	'noto:sun': {
		component: NotoSun,
		color: ''
	},
	'twemoji:toothbrush': {
		component: TwemojiToothbrush,
		color: ''
	},
	'ion:waterdrop': {
		component: IonWaterdrop,
		color: '#3B82F6'
	},
	'twemoji:shower': {
		component: TwemojiShower,
		color: ''
	},
	'noto:woman-walking-medium-skin-tone': {
		component: NotoWomanWalkingMediumSkinTone,
		color: ''
	},
	'noto:woman-running-facing-right-medium-skin-tone': {
		component: NotoWomanRunningFacingRightMediumSkinTone,
		color: ''
	},
	'twemoji:green-salad': {
		component: TwemojiGreenSalad,
		color: ''
	},
	'noto:broom': {
		component: NotoBroom,
		color: ''
	},
	'noto:woman-in-lotus-position-medium-skin-tone': {
		component: NotoWomanInLotusPositionMediumSkinTone,
		color: ''
	},
	'famicons:barbell': {
		component: FamiconsBarbell,
		color: '#5C5C5C'
	},
	'emojione:pencil': {
		component: EmojionePencil,
		color: ''
	},
	'noto:open-book': {
		component: NotoOpenBook,
		color: ''
	},
	'fluent-emoji:potted-plant': {
		component: FluentEmojiPottedPlant,
		color: ''
	},
	'noto:avocado': {
		component: NotoAvocado,
		color: '		'
	},
	'streamline-color:task-list-flat': {
		component: StreamLineColorTaskListFlat,
		color: ''
	},
	'noto:video-game': {
		component: NotoVideoGame,
		color: ''
	},
	'emojione:red-heart': {
		component: EmojioneRedHeart,
		color: ''
	},
	'noto:smiling-face': {
		component: NotoSmilingFace,
		color: ''
	},
	'noto:last-quarter-moon-face': {
		component: NotoLastQuarterMoonFace,
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
