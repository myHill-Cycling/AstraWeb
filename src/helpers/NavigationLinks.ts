export type NavLink = {
    name: string,
    url: string
}

const navLinks: NavLink[] = [
	{
		name: "About",
		url: "/about"
	},
	{
		name: "Services",
		url: "/services"
	},
	{
		name: "Contact",
		url: "/contact"
	},
	{
		name: "Shop",
		url: "/shop"
	}
];

export default navLinks;