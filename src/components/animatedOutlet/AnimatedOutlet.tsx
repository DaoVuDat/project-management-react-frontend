import { getRouterContext, Outlet } from '@tanstack/react-router';
import { forwardRef, useContext, useRef } from 'react';
import { useIsPresent } from 'framer-motion';
import { cloneDeep } from 'lodash';
import {motion} from 'framer-motion';

// eslint-disable-next-line react/display-name
const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
	const RouterContext = getRouterContext();

	const routerContext = useContext(RouterContext);

	const renderedContext = useRef(routerContext);

	const isPresent = useIsPresent();

	if (isPresent) {
		renderedContext.current = cloneDeep(routerContext);
	}

	return (
		<motion.div ref={ref}>
			<RouterContext.Provider value={renderedContext.current}>
				<Outlet />
			</RouterContext.Provider>
		</motion.div>
	);
});

export {AnimatedOutlet}