import { DeepPartial, extendTheme, Theme, withDefaultColorScheme } from '@chakra-ui/react';
import { createBreakpoints, mode } from '@chakra-ui/theme-tools';

export const fonts = {
  heading: 'solitaire-mvb-pro, sans-serif',
  body: 'solitaire-mvb-pro, sans-serif',
  mono: 'solitaire-mvb-pro, sans-serif'
};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
  '2xl': '92em'
});

const components = {
  Button: {
    baseStyle: {
      // pt: '3px'
    }
  }
};

type BaseTheme = {
  config: Theme['config'];
  colors: Partial<Theme['colors']>;
  fonts: Theme['fonts'];
  breakpoints: Theme['breakpoints'];
  styles: Theme['styles'];
  components: DeepPartial<Theme['components']>;
};

const baseTheme: BaseTheme = {
  config: {
    cssVarPrefix: 'in',
    useSystemColorMode: false,
    initialColorMode: 'dark'
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', '#050505')(props)
      }
    })
  },
  colors: {
    black: '#16161D',
    purple: {
      // bg: "#eaddf9",
      // state: "#b69ccb",
      50: '#b69ccb',
      100: '#b69ccb',
      200: '#b69ccb',
      300: '#b69ccb',
      400: '#b69ccb',
      500: '#b69ccb',
      600: '#b69ccb',
      700: '#b69ccb',
      800: '#b69ccb',
      900: '#b69ccb'
    }
  },
  fonts,
  breakpoints,
  components
};

const theme = extendTheme(baseTheme, withDefaultColorScheme({ colorScheme: 'purple' }));

export default theme;
