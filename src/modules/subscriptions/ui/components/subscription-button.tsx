import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	onClick: ButtonProps["onClick"];
	disabled: boolean;
	isSubscribed: boolean;
	className?: string;
	size: ButtonProps["size"];
};

export const SubscriptionButton = ({
	disabled,
	isSubscribed,
	onClick,
	size,
	className,
}: Props) => {
	return (
		<Button
			size={size}
			variant={isSubscribed ? "secondary" : "default"}
			onClick={onClick}
			disabled={disabled}
			className={cn("rounded-full", className)}>
			{isSubscribed ? "Unsubscribe" : "Subscribe"}
		</Button>
	);
};
