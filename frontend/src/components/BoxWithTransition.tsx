/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { SxProps } from '@mui/system';

import Box from '@mui/material/Box';

interface BoxWithTransitionProps {
  property: string;
  startValue: string;
  endValue: string;
  duration: string;
  animationStyle: string;
}

interface BoxWithTransitionComponentProps {
  shown: boolean;
  children: React.ReactNode;
  sx?: SxProps;
}

/**
 * Given a property, start value, end value, duration, and animation style,
 * returns a component which wraps @mui/material/Box in a transition.
 */
const BoxWithTransition = ({
  property, startValue, endValue, duration, animationStyle
}: BoxWithTransitionProps) => {
  const collapsed = css`
    ${property}: ${startValue};
    transition: ${property} ${duration} ${animationStyle};
  `;

  const expanded = css`
    ${property}: ${endValue};
    transition: ${property} ${duration} ${animationStyle};
  `;

  return ({ shown, children, sx }: BoxWithTransitionComponentProps) => {
    const animation = shown ? expanded : collapsed;

    return (
      <Box css={animation} sx={{ overflow: "hidden", ...sx }}>
        {children}
      </Box>
    );
  };
};

export default BoxWithTransition;
