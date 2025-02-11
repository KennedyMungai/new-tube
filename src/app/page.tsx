import Image from "next/image";

const HomePage = () => {
	return (
		<div>
			<Image src="/logo.svg" height={50} width={50} alt="Logo" />
			<p className="text-xl font-semibold tracking-tight">NewTube</p>
		</div>
	);
};

export default HomePage;
