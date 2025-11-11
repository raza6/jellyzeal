import React from 'react';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import { Box } from 'ink';

export const Logo = () => {
	return (
		<Box justifyContent="center">
			<Gradient name="instagram">
				<BigText text="JellyZeal"/>
			</Gradient>
		</Box>
	)
}

export default Logo;