import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
	name: z.string().min(1),
});

export const PlaylistCreateModal = ({ onOpenChange, open }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const create = trpc.playlists.create.useMutation({
		onSuccess: () => {
			toast.success("Playlist created", {
				description: "Check your playlists",
			});
			form.reset();
			onOpenChange(false);
		},
		onError: () => toast.error("Something went wrong"),
	});

	const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
		await create.mutateAsync({
			name,
		});
	};

	return (
		<ResponsiveModal
			title="Create a playlist"
			open={open}
			onOpenChange={onOpenChange}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Playlist Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										className="resize-none"
										placeholder="Playlist name"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button
							disabled={
								form.formState.isSubmitting ||
								create.isPending ||
								!form.formState.isValid ||
								!form.formState.isDirty
							}
							type="submit">
							Create
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveModal>
	);
};
