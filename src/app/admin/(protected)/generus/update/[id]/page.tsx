"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import navigation from "next/navigation";
import { use } from "react";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import TextError from "@/components/TextError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import { api } from "@/trpc/react";
import {
	defaultGenerus,
	generusUpdateSchema,
	type JenisKelaminType,
	type JenjangType,
	type KeteranganType,
	type PendidikanTerakhirType,
	type SambungType,
} from "@/types/generus";
import useToastError from "@/utils/useToastError";

export default function GenerusUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = navigation.useRouter();
	const { data: generusData, error: generusError } =
		api.generus.getOneGenerus.useQuery(
			{
				id: id,
			},
			{
				enabled: !!id,
				throwOnError: () => {
					navigation.notFound();
				},
			},
		);
	const {
		data: kelompokData,
		isPending,
		error: kelompokError,
	} = api.kelompok.getAll.useQuery();
	const utils = api.useUtils();

	const {
		mutateAsync,
		data: updateData,
		error: updateError,
	} = api.generus.updateGenerus.useMutation({
		onError: (error) => {
			toast.dismiss();
			toast.error(error.message);
		},
		onMutate({ nama }) {
			toast.loading(`Memperbarui Data Generus ${nama}`);
		},
		onSuccess: ({ message }) => {
			toast.dismiss();
			toast.success(message);
			utils.generus.invalidate();
			router.push("/admin/generus");
		},
	});

	const form = useForm({
		defaultValues: generusData?.data || defaultGenerus,
		onSubmit: ({ value }) => {
			toast.promise(
				mutateAsync({
					...value,
					id: id,
				}),
				{
					error: updateError?.message,
					loading: "Loading...",
					success: updateData?.message,
				},
			);
		},

		validators: {
			onSubmit: generusUpdateSchema,
		},
	});

	const kelompokOptions =
		kelompokData?.data.map((item) => ({
			label: item.nama,
			value: item.id,
		})) || [];

	useToastError(generusError);
	useToastError(kelompokError);

	return (
		<div className="w-full">
			<h1 className="font-bold mb-6 text-gray-800">Perbarui Data Generus</h1>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="space-y-4">
					<form.Field name="nama">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nama"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									type="text"
									value={field.state.value}
									variant="secondary"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenisKelamin">
						{(field) => (
							<>
								<Select
									id="jenis_kelamin"
									label="Jenis Kelamin"
									onChange={(e) =>
										field.handleChange(e.target.value as JenisKelaminType)
									}
									options={jenisKelaminOptions}
									placeholder="Pilih Jenis Kelamin"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tempatLahir">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Tempat Lahir"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Kota Semarang"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tanggalLahir">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Tanggal Lahir"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="2000-01-01"
									required={false}
									type="date"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenjang">
						{(field) => (
							<>
								<Select
									id="jenjang"
									label="Jenjang"
									onChange={(e) =>
										field.handleChange(e.target.value as JenjangType)
									}
									options={jenjangOptions}
									placeholder="Pilih Jenjang"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="nomerWhatsapp">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nomor WhatsApp"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="pendidikanTerakhir">
						{(field) => (
							<>
								<Select
									id="pendidikan_terakhir"
									label="Pendidikan Terakhir"
									onChange={(e) =>
										field.handleChange(e.target.value as PendidikanTerakhirType)
									}
									options={pendidikanTerakhirOptions}
									placeholder="Pilih Pendidikan Terakhir"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="namaOrangTua">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nama Orang Tua"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="nomerWhatsappOrangTua">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Nomor WhatsApp Orang Tua"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="sambung">
						{(field) => (
							<>
								<Select
									id="sambung"
									label="Sambung"
									onChange={(e) =>
										field.handleChange(e.target.value as SambungType)
									}
									options={sambungOptions}
									placeholder="Pilih Sambung"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="alamatTempatTinggal">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Alamat Tempat Tinggal"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="keterangan">
						{(field) => (
							<>
								<Select
									id="keterangan"
									label="Keterangan"
									onChange={(e) =>
										field.handleChange(e.target.value as KeteranganType)
									}
									options={keteranganOptions}
									placeholder="Pilih Keterangan"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="alamatAsal">
						{(field) => (
							<>
								<Input
									id={field.name}
									label="Alamat Asal"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="kelompokId">
						{(field) => (
							<>
								<CustomSelect
									isDisabled={isPending}
									label="Kelompok"
									onChange={(e) => field.handleChange(e?.value || "")}
									options={kelompokOptions}
									placeholder="Pilih Kelompok"
									value={kelompokOptions.find(
										(option) => option.value === field.state.value,
									)}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>
				</div>

				<div className="flex justify-end space-x-4 mt-6">
					<Link href="/admin/generus">Close</Link>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button disabled={!canSubmit} type="submit">
								{isSubmitting ? "Memproses..." : "Perbarui"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
