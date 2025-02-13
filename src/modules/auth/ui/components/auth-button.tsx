"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
	// TODO: Add different auth states

	return (
		<>
			<SignedOut>
				<SignInButton mode="modal">
					<Button
						variant={"outline"}
						className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-5">
						<UserCircleIcon /> Sign In
					</Button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton>
					<UserButton.MenuItems>
						{/* TODO: Add user profile item */}
						<UserButton.Link
							label="Studio"
							href="/studio"
							labelIcon={<ClapperboardIcon className="size-4" />}
						/>
					</UserButton.MenuItems>
				</UserButton>
			</SignedIn>
		</>
	);
};
