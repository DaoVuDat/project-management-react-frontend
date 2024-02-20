import {createLazyFileRoute} from '@tanstack/react-router';

const SettingRoute = () => {
  return <div>Settings Route</div>;
};

export const Route = createLazyFileRoute('/_dashboard/settings')({
  component: SettingRoute,
});
