import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentsInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	videoId: string;
	onSuccess?: () => void;
};

export const CommentForm = ({ videoId, onSuccess }: Props) => {
	const { user } = useUser();

	const clerk = useClerk();

	const utils = trpc.useUtils();

	const create = trpc.comments.create.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({ videoId });
			form.reset();
			toast.success("Comment added");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});

	const form = useForm<z.infer<typeof commentsInsertSchema>>({
		resolver: zodResolver(commentsInsertSchema.omit({ userId: true })),
		defaultValues: {
			videoId,
			value: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof commentsInsertSchema>) => {
		create.mutateAsync(values);
	};

	return (
		<Form {...form}>
			<form
				className="flex gap-4 group"
				onSubmit={form.handleSubmit(handleSubmit)}>
				<UserAvatar
					size="lg"
					imageUrl={user?.imageUrl ?? "/user-placeholder.svg"}
					name={user?.username ?? "User"}
				/>
				<div className="flex-1">
					<FormField
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										placeholder="Add a comment"
										className="resize-none bg-transparent overflow-hidden min-h-0"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="justify-end gap-2 mt-2 flex">
						<Button
							type="submit"
							size="sm"
							disabled={
								form.formState.isSubmitting ||
								!form.formState.isDirty ||
								!form.formState.isValid ||
								create.isPending
							}>
							Comment
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};
