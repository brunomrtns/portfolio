import React, { ReactNode } from "react";
import Navbar from "../components/navbar";

interface MainLayoutProps {
	children: ReactNode;
	setCurrentPage: (page: string) => void;
	setSelectedCategory: (categoryId: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
	children,
	setCurrentPage,
	setSelectedCategory,
}) => {
	return (
		<>
			<Navbar
				setCurrentPage={setCurrentPage}
				setSelectedCategory={setSelectedCategory}
			/>
			{children}
		</>
	);
};

export default MainLayout;
