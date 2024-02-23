import {createLazyFileRoute} from '@tanstack/react-router';


export const Route = createLazyFileRoute('/_dashboard/settings')({
  component: SettingRoute,
});
function SettingRoute(){
  return <div>Settings Route</div>;
}
