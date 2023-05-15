/** @jsxImportSource @emotion/react */
import React from 'react';
import { useEffect, useRef } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { SxProps } from '@mui/system';

import Box from '@mui/material/Box';

interface CollapsingBoxProps {
  duration: string;
  animationStyle: string;
}

interface CollapsingBoxComponentProps {
  shown: boolean;
  children: React.ReactNode;
  sx?: SxProps;
}

/**
 * Returns a Box component which does a height transition between 0 and its
 * rendered height. Accepts `show` and `sx` propertise. Higher-order component
 * for use in the comment stack.
 */
const CollapsingBox = ({ duration, animationStyle }: CollapsingBoxProps) => {
  return ({ shown, children, sx }: CollapsingBoxComponentProps) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = React.useState<SerializedStyles | null>(null);
    const [collapsed, setCollapsed] = React.useState<SerializedStyles | null>(null);

    const animation = shown ? expanded : collapsed;

    // NOTE: this trick is necessary because CSS cannot do a vertical transition
    // without reflowing everything below the transitioning object on every
    // frame. No problem: compute the height once and use that. These comment
    // objects are unable to change height past the initial render.
    useEffect(() => {
      const box = boxRef.current;

      if (box?.clientHeight !== null && box?.clientHeight !== undefined) {
        const endHeight = box.clientHeight + "px";

        if (!expanded) {
          const expandedClass = css`
            height: ${endHeight};
            transition: height ${duration} ${animationStyle};
          `;
          setExpanded(expandedClass);
        }

        if (!collapsed) {
          const collapsedClass = css`
            height: 0px;
            transition: height ${duration} ${animationStyle};
          `;
          setCollapsed(collapsedClass);
        }
      }
    }, [shown]);

    return (
      <Box ref={boxRef} css={animation} sx={{ overflow: "hidden", ...sx }}>
        {children}
      </Box>
    );
  };
};

export default CollapsingBox;
