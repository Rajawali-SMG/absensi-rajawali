"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import navigation from "next/navigation";
import { use, useEffect } from "react";
import toast from "react-hot-toast";
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

export default function GenerusUpdatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = navigation.useRouter();
	const { data: generusData } = api.generus.getOneGenerus.useQuery(
		{
			id: id,
		},
		{
			enabled: !!id,
			throwOnError: ({ message }) => {
				toast.error(message);
				navigation.notFound();
			},
		},
	);
	const {
		data: kelompokData,
		isPending,
		error,
		isError,
	} = api.kelompok.getAll.useQuery();
	const utils = api.useUtils();

	const { mutate } = api.generus.updateGenerus.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.generus.getAllPaginated.invalidate();
			toast.success(message);
			router.push("/admin/generus");
		},
	});

	const form = useForm({
		defaultValues: generusData?.data || defaultGenerus,
		onSubmit: ({ value }) => {
			mutate({
				...value,
				id: id,
			});
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

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

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
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Nama"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
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
							<div className="space-y-1">
								<Select
									label="Jenis Kelamin"
									name={field.name}
									onChange={(e) =>
										field.handleChange(e.target.value as JenisKelaminType)
									}
									options={jenisKelaminOptions}
									placeholder="Pilih Jenis Kelamin"
									required={true}
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="tempatLahir">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Tempat Lahir"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Kota Semarang"
									required={true}
									type="text"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tanggalLahir">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Tanggal Lahir"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="2000-01-01"
									required={false}
									type="date"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenjang">
						{(field) => (
							<div className="space-y-1">
								<Select
									label="Jenjang"
									name={field.name}
									onChange={(e) =>
										field.handleChange(e.target.value as JenjangType)
									}
									options={jenjangOptions}
									placeholder="Pilih Jenjang"
									required={true}
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="nomerWhatsapp">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Nomor WhatsApp"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									required={true}
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="pendidikanTerakhir">
						{(field) => (
							<div className="space-y-1">
								<Select
									label="Pendidikan Terakhir"
									name={field.name}
									onChange={(e) =>
										field.handleChange(e.target.value as PendidikanTerakhirType)
									}
									options={pendidikanTerakhirOptions}
									placeholder="Pilih Pendidikan Terakhir"
									required={true}
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="namaOrangTua">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Nama Orang Tua"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
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
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Nomor WhatsApp Orang Tua"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									required={true}
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="sambung">
						{(field) => (
							<div className="space-y-1">
								<Select
									label="Sambung"
									name={field.name}
									onChange={(e) =>
										field.handleChange(e.target.value as SambungType)
									}
									options={sambungOptions}
									placeholder="Pilih Sambung"
									required={true}
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatTempatTinggal">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Alamat Tempat Tinggal"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={true}
									type="text"
									value={field.state.value}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="keterangan">
						{(field) => (
							<div className="space-y-1">
								<Select
									label="Keterangan"
									name={field.name}
									onChange={(e) =>
										field.handleChange(e.target.value as KeteranganType)
									}
									options={keteranganOptions}
									placeholder="Pilih Keterangan"
									required={true}
									value={field.state.value || ""}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatAsal">
						{(field) => (
							<>
								<Input
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									htmlFor={field.name}
									id={field.name}
									label="Alamat Asal"
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={true}
									type="text"
									value={field.state.value || ""}
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="kelompokId">
						{(field) => (
							<div className="space-y-1">
								<Select
									disabled={isPending}
									label="Kelompok"
									name={field.name}
									onChange={(e) => field.handleChange(e.target.value)}
									options={kelompokOptions}
									placeholder="Pilih Kelompok"
									required={true}
									value={field.state.value}
								/>
							</div>
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
