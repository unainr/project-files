import { LandingFooter } from "@/components/layouts/footer";
import { MainHeader } from "@/components/layouts/main-header";
import { TypeLayout } from "@/types";

const Layout = ({ children }: TypeLayout) => {
	return (
		<>
			<MainHeader />
			{children}
			<LandingFooter />
		</>
	);
};

export default Layout;
