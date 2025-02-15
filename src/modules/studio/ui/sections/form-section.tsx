"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	videoId: string;
};

export const FormSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const FormSectionSkeleton = () => <div>Loading...</div>;

const FormSectionSuspense = ({ videoId }: Props) => {
	const utils = trpc.useUtils();

	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
	// HACK: Ideally, the select part of the form should be on its own component to avoid long loading times
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const update = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getOne.invalidate({ id: videoId });
			utils.studio.getMany.invalidate();

			toast.success("Video updated successfully");
		},
		onError: (error) => toast.error(error.message),
	});

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		resolver: zodResolver(videoUpdateSchema),
		defaultValues: video,
	});

	const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) =>
		await update.mutateAsync(data);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold ">Video Details</h1>
						<h3 className="text-xs text-muted-foreground">
							Manage your video details
						</h3>
					</div>
					<div className="flex items-center gap-x-2">
						{/* TODO: Make the disabled prop of the button dynamic */}
						<Button
							type="submit"
							disabled={form.formState.isSubmitting || update.isPending}>
							Save
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant={"ghost"} size="icon">
									<MoreVerticalIcon className="size-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<TrashIcon className="size-4 mr-2" />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<div className="space-y-8 lg:col-span-3">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									{/* TODO: Add AI generate button */}
									<FormControl>
										<Input {...field} placeholder="Add a title to your video" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									{/* TODO: Add AI generate button */}
									<FormControl>
										<Textarea
											{...field}
											value={field.value ?? "No description"}
											placeholder="Add a description for your video"
											rows={10}
											className="resize-none pr-10"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* TODO: Add thumbnail field here */}
						<FormField
							control={form.control}
							name="categoryId"
							disabled={categories.length === 0}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value ?? undefined}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
};
