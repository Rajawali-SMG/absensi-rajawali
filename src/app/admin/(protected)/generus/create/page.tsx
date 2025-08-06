"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
	generusCreateSchema,
	type JenisKelaminType,
	type JenjangType,
	type KeteranganType,
	type PendidikanTerakhirType,
	type SambungType,
} from "@/types/generus";

export default function GenerusCreatePage() {
	const { data, isPending, isError, error } = api.kelompok.getAll.useQuery();
	const router = useRouter();
	const utils = api.useUtils();

	const { mutate } = api.generus.createGenerus.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.generus.getAllPaginated.invalidate();
			toast.success(message);
			router.push("/admin/generus");
		},
	});

	const kelompokOptions =
		data?.data.map((item) => ({
			value: item.id,
			label: item.nama,
		})) || [];

	const form = useForm({
		defaultValues: defaultGenerus,
		onSubmit: ({ value }) => {
			mutate(value);
		},
		validators: {
			onSubmit: generusCreateSchema,
		},
	});

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">
				Buat Data Generus
			</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div className="space-y-4">
					<form.Field name="nama">
						{(field) => (
							<>
								<Input
									label="Nama"
									variant="secondary"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenisKelamin">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Jenis Kelamin"
									options={jenisKelaminOptions}
									placeholder="Pilih Jenis Kelamin"
									required={true}
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value as JenisKelaminType)
									}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="tempatLahir">
						{(field) => (
							<>
								<Input
									label="Tempat Lahir"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Kota Semarang"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="tanggalLahir">
						{(field) => (
							<>
								<Input
									label="Tanggal Lahir"
									htmlFor={field.name}
									type="date"
									name={field.name}
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="2000-01-01"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="jenjang">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Jenjang"
									options={jenjangOptions}
									placeholder="Pilih Jenjang"
									required={true}
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value as JenjangType)
									}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="nomerWhatsapp">
						{(field) => (
							<>
								<Input
									label="Nomor WhatsApp"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="pendidikanTerakhir">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Pendidikan Terakhir"
									options={pendidikanTerakhirOptions}
									placeholder="Pilih Pendidikan Terakhir"
									required={true}
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value as PendidikanTerakhirType)
									}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="namaOrangTua">
						{(field) => (
							<>
								<Input
									label="Nama Orang Tua"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="nomerWhatsappOrangTua">
						{(field) => (
							<>
								<Input
									label="Nomor WhatsApp Orang Tua"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+628123456789"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="sambung">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Sambung"
									options={sambungOptions}
									placeholder="Pilih Sambung"
									required={true}
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value as SambungType)
									}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatTempatTinggal">
						{(field) => (
							<>
								<Input
									label="Alamat Tempat Tinggal"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={true}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="keterangan">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Keterangan"
									options={keteranganOptions}
									placeholder="Pilih Keterangan"
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value as KeteranganType)
									}
									required={true}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="alamatAsal">
						{(field) => (
							<>
								<Input
									label="Alamat Asal"
									htmlFor={field.name}
									type="text"
									name={field.name}
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Jl. Madukoro No. 1"
									required={false}
									className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
								<TextError field={field} />
							</>
						)}
					</form.Field>

					<form.Field name="kelompokId">
						{(field) => (
							<div className="space-y-1">
								<Select
									name={field.name}
									label="Kelompok"
									options={kelompokOptions}
									placeholder="Pilih Kelompok"
									required={true}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									disabled={isPending}
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
							<Button type="submit" disabled={!canSubmit}>
								{isSubmitting ? "Memproses..." : "Kirim"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
