import { Menu as InternalMenu, MenuDivider, MenuItem, MenuItemGroup, SubMenu } from './Menu';

export const Menu = Object.assign(InternalMenu, { Item: MenuItem, SubMenu, Divider: MenuDivider, ItemGroup: MenuItemGroup });
export { MenuDivider, MenuItem, MenuItemGroup, SubMenu };
export type * from './Menu';
